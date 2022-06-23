const fs = require('fs')
const debug = require('debug')
const log = debug('democracyos:api-v2:audio')
const express = require('express');
const aws = require('aws-sdk');
const moment = require('moment')
const config = require('lib/config')
const urlBuilder = require('lib/backend/url-builder')
var notifier = require('democracyos-notifier')
var utils = require('lib/backend/utils')
var restrict = utils.restrict
var staff = utils.staff
// var maintenance = utils.maintenance

const dbApi = require('lib/backend/db-api');
const { response } = require('express');

const app = module.exports = express.Router()
// config.doSpacesEndpoint
// config.doSpacesBucket
// config.doSpacesFolder
// config.doSpacesKey
// config.doSpacesSecret
// Set S3 endpoint to DigitalOcean Spaces
// const spacesEndpoint = new aws.Endpoint('sfo3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: config.doSpacesEndpoint,
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.doSpacesKey,
    secretAccessKey: config.doSpacesSecret
  }
});

// Change bucket property to your Space name

app.get('/audio/admin/all',
  restrict,
  staff,
  function getAudio (req, res, next) {
    log('Getting audio')

    dbApi.audio.all().then((audio) => {
      if (audio) {
        log('Serving audio')
        res.status(200).json(audio)
      } else {
        log('No audio found')
        res.status(200).json([])
      }
    })
    .catch((err) => {
      log(`Error gathering audios`)
      res.status(500)
    })
  }
)

// get audios paginated
app.get('/audio/admin/all/:page',
  restrict,
  staff,
  function getAudio (req, res, next) {
    // validate page is a number
    if (isNaN(req.params.page)) {
      log('Invalid page number')
      res.status(400).json({
        error: 'Invalid page number'
      })
      return
    }
    // validate is not minor to 0
    if (parseInt(req.params.page) < 0) {
      log('Invalid page number')
      res.status(400).json({
        error: 'Invalid page number'
      })
      return
    }
    log('Getting audio')
    // deep copy of req.query
    const query = JSON.parse(JSON.stringify(req.query))
    let orderBy = null
    let limit = parseInt(req.query.limit) || 10
    if (query.orderBy == 'asc') {
      orderBy = 1
    } else {
      orderBy = -1
    }
    delete query.orderBy
    delete query.limit
    let responseData = {
      page: parseInt(req.params.page),
      limit: limit
    }
    if (query.fullName) {
      query.fullName = { $regex: query.fullName, $options: 'i' }
    }
    if (query.email) {
      query.email = { $regex: query.email, $options: 'i' }
    }
    if (query.dni) {
      query.dni = { $regex: query.dni, $options: 'i' }
    }
    dbApi.audio.count(query)
      .then((count) => {
        responseData.count = count
        responseData.pages = Math.ceil(count / responseData.limit)
        return dbApi.audio.allPaginated(req.params.page, query, orderBy, limit)
      })
      .then((audios) => {
        if (audios) {
          log('Serving audio')
          responseData.audios = audios
          res.status(200).json(responseData)
        } else {
          log('No audio found')
          res.status(200).json([])
        }
      })
      .catch((err) => {
        console.log(err)
        log(`Error gathering audios`)
        res.status(500)
      })
  }
)

// // serve audio from folder
// app.get('/audio/admin/file/:file',
//   restrict,
//   staff,
//   function getAudio (req, res, next) {
//     var filePath = './uploads/' + req.params.file
//     res.download(filePath, req.params.file)
//   }
// )
    // log('Getting audio file')
    // dbApi.audio.get(req.params.id).then((audio) => {
    //   if (audio) {
    //     // get audio from folder upload
    //     var file = audio.file
    //     var filePath = './uploads/' + file
    //     res.download(filePath, file)
    //   } else {
    //     log('No audio found')
    //     res.status(200).json([])
    //   }
    // })

app.put('/audio/admin/:audioId',
  restrict,
  staff,
  function updateAudio (req, res, next) {
    log('Updating audio')

    dbApi.audio.update(req.params.audioId, req.body).then((audio) => {
      if (audio) {
        log('Serving audio')
        res.status(200).json(audio)
      } else {
        log('No audio found')
        res.status(200).json([])
      }
    })
    .catch((err) => {
      log(`Error updating audio`)
      res.status(500)
    })
  }
)

app.post('/audio/submit',
  // restrict,
  async function uploadToS3 (req, res, next) {
    log('Uploading audio')
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        })
      } else {
        // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let audio = req.files.audio
        console.log(req.files.audio)
        // create name for the audio
        let audioName = `${moment(new Date()).format('YYYYMMDD-HHmmss')}-${req.user._id}.mp3`
        fs.readFile(audio.tempFilePath, async (err, uploadedData) => {
          if (err) {
            console.log(err)
            throw err
          }
          // upload to s3
          s3.upload({
            Bucket: config.doSpacesBucket,
            Key: `${config.doSpacesFolder}/${audioName}`,
            Body: uploadedData,
            ContentType: audio.mimetype,
            ACL: 'public-read'
          }, async (err, data) => {
            if (err) {
              log(`Error uploading audio to S3`)
              fs.unlinkSync(audio.tempFilePath)
              res.send({
                status: false,
                message: 'Error uploading audio (S3ERROR)'
              })
            } else {
              log(`Audio uploaded to S3 ${data.Location}`)
              // save audio to db
              let audioData = {
                user: req.user._id,
                file: data.Location,
                mimetype: audio.mimetype,
                size: audio.size,
                fullName: req.user.fullName,
                email: req.user.email,
                dni: req.user.dni
              }
              dbApi.audio.create(audioData)
              .then((savedAudio) => {
                // delete temp file
                log(`Audio saved to DB`)
                fs.unlinkSync(audio.tempFilePath)
                // send notification to user
                notifier.now('thanks-audio', {
                  to: req.user.email,
                  url: urlBuilder.for('site.forum')
                })
                // send response
                res.send({
                  status: true,
                  message: 'File is uploaded',
                  data: {
                    id: savedAudio._id,
                    mimetype: savedAudio.mimetype,
                    size: savedAudio.size
                  }
                })
              })
              .catch((err) => {
                log(err)
                fs.unlinkSync(audio.tempFilePath)
                res.send({
                  status: false,
                  message: 'Error uploading audio (MONGOERROR)'
                })
              })
            }
          })
        })
      }
    } catch (err) {
      res.status(500).send(err)
    }
  }
)

// // Submit audio file and return the audio id
// app.post('/audio/submit',
//   restrict,
//   // staff,
//   async function submitAudio (req, res, next) {
//     log('Submitting audio')
//     try {
//       if (!req.files) {
//         res.send({
//           status: false,
//           message: 'No file uploaded'
//         })
//       } else {
//         console.log(req.files)
//         // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
//         let audio = req.files.audio

//         // create name for the audio
//         let audioName = `${moment(new Date()).format('YYYYMMDD-HHmmss')}-${req.user._id}.mp3`

//         // Use the mv() method to place the file in upload directory (i.e. "uploads")
//         audio.mv('./uploads/' + audioName)
        
//         // Create and save data in the database
//         let audioData = {
//           user: req.user._id,
//           file: audioName,
//           mimetype: audio.mimetype,
//           size: audio.size
//         }

//         let newAudio = await dbApi.audio.create(audioData)

//         // send response
//         res.send({
//           status: true,
//           message: 'File is uploaded',
//           data: {
//             id: newAudio._id,
//             mimetype: audio.mimetype,
//             size: audio.size
//           }
//         })
//       }
//     } catch (err) {
//       res.status(500).send(err)
//     }
//   })

app.post('/audio/reaction',
  restrict,
  // staff,
  async function submitAudio (req, res, next) {
    log('Submitting audio reaction')
    try {
      let theAudio = await dbApi.audio.getFromIdAndUser(req.body.id, req.user._id)
      if (!theAudio) {
        res.send({
          status: false,
          message: 'Audio not found'
        })
      } else {
        if (theAudio.reaction != null) {
          res.send({
            status: false,
            message: 'Reaction already exists'
          })
        }
        let audioData = {
          reaction: req.body.reaction
        }
        let updatedAudio = await dbApi.audio.update(theAudio._id, audioData)
        res.send({
          status: true,
          message: 'Audio reaction updated',
          data: {
            id: updatedAudio._id,
            reaction: updatedAudio.reaction
          }
        })
      }
    } catch (err) {
      res.status(500).send(err)
    }
  })

app.post('/audio/description',
  restrict,
  // staff,
  async function submitAudio (req, res, next) {
    log('Submitting audio description')
    try {
      let theAudio = await dbApi.audio.getFromIdAndUser(req.body.id, req.user._id)
      if (!theAudio) {
        res.send({
          status: false,
          message: 'Audio not found'
        })
      } else {
        if (theAudio.about != null) {
          res.send({
            status: false,
            message: 'Description already exists'
          })
        }
        let audioData = {
          about: req.body.about,
          scale: req.body.scale,
          contact: req.body.contact,
          location: req.body.location
        }
        let updatedAudio = await dbApi.audio.update(theAudio._id, audioData)
        res.send({
          status: true,
          message: 'Audio description updated',
          data: {
            id: updatedAudio._id,
            description: updatedAudio.about
          }
        })
      }
    } catch (err) {
      res.status(500).send(err)
    }
  })

// app.post('/audio/add',
//   restrict,
//   staff,
//   function addToAudio (req, res, next) {
//     log('Adding to audio')

//     dbApi.audio.add(req.body).then((audio) => {
//       if (audio) {
//         log('Audio added')
//         res.status(200).json(audio)
//       } else {
//         log('Error adding to audio')
//         res.status(500)
//       }
//     })
//     .catch((err) => {
//       log(`Error adding to audio`)
//       res.status(500)
//     })
//   }
// )
