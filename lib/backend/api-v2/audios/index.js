const debug = require('debug')
const log = debug('democracyos:api-v2:audio')

const express = require('express')
const moment = require('moment')
var utils = require('lib/backend/utils')
var restrict = utils.restrict
var staff = utils.staff
// var maintenance = utils.maintenance

const dbApi = require('lib/backend/db-api')

const app = module.exports = express.Router()

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
    log('Getting audio')
    console.log(req.params.page)
    dbApi.audio.allPaginated(req.params.page).then((audio) => {
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

// serve audio from folder
app.get('/audio/admin/file/:file',
  restrict,
  staff,
  function getAudio (req, res, next) {
    var filePath = './uploads/' + req.params.file
    res.download(filePath, req.params.file)
  }
)
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

// Submit audio file and return the audio id
app.post('/audio/submit',
  restrict,
  // staff,
  async function submitAudio (req, res, next) {
    log('Submitting audio')
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        })
      } else {
        console.log(req.files)
        // Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let audio = req.files.audio

        // create name for the audio
        let audioName = `${moment(new Date()).format('YYYYMMDD-HHmmss')}-${req.user._id}.mp3`

        // Use the mv() method to place the file in upload directory (i.e. "uploads")
        audio.mv('./uploads/' + audioName)
        
        // Create and save data in the database
        let audioData = {
          user: req.user._id,
          file: audioName,
          mimetype: audio.mimetype,
          size: audio.size
        }

        let newAudio = await dbApi.audio.create(audioData)

        // send response
        res.send({
          status: true,
          message: 'File is uploaded',
          data: {
            id: newAudio._id,
            mimetype: audio.mimetype,
            size: audio.size
          }
        })
      }
    } catch (err) {
      res.status(500).send(err)
    }
  })

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
