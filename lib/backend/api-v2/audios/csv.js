const debug = require('debug')
const log = debug('democracyos:api:padroncsv')

const express = require('express')
const moment = require('moment')
var utils = require('lib/backend/utils')
var restrict = utils.restrict
var staff = utils.staff
//var maintenance = utils.maintenance
const json2csv = require('json-2-csv').json2csv
const csv2json = require('json-2-csv').csv2json

const dbApi = require('lib/backend/db-api')

const app = module.exports = express.Router()

function escapeTxt (text) {
  if (!text) return ''
  text += ''
  return text.replace(/"/g, '\'').replace(/\r/g, '').replace(/\n/g, '')
}

app.get('/audio/all/csv',
  restrict,
  staff,
  function getAudios(req, res, next){
    log('Getting audios')
    dbApi.audio.getAllWithUsers({}).then((audios) => {
      if(audios){
        log('Serving audios')
        // conver every item toJson
        // let aux = facultades.map(fac => fac.toJSON())
        // console.log(aux)
        req.audios = audios
        next()
      } 
    })
  },
  function sendCsv (req, res, next) {
    var infoAudios = req.audios.map((a) => {
      let _a = a.toJSON()
      return [
        _a._id ? _a._id.toString() : '',
        _a.group ? a.group : '-',
        _a.subgroup ? a.subgroup : '-',
        _a.resolved ? 'SI' : 'NO',
        _a.featured ? 'SI' : 'NO',
        _a.file ? a.file : '-',
        _a.size ? a.size : '-',
        _a.createdAt ? moment(a.createdAt).format('YYYY-MM-DD HH:mm:ss') : '-',
        _a.user ? 'SI' : 'NO',
        _a.user ? escapeTxt(`${a.user.lastName}, ${a.user.firstName}`) : a.fullName ? escapeTxt(a.fullName) : 'Sin completar',
        _a.dni ? escapeTxt(a.dni) : 'No completado',
        _a.contact ? escapeTxt(a.contact) : 'No completado',
        _a.email ? escapeTxt(a.email) : 'No completado',
        _a.province ? escapeTxt(a.province) : 'No completado',
        _a.location ? escapeTxt(a.location) : 'No completado',
        _a.scale ? escapeTxt(a.scale) : 'No completado',
        _a.about ? escapeTxt(a.about) : 'No completado'
      ]
    })
    var data = [['ID', 'Grupo', 'Subgrupo', 'Resuelto', 'Destacado', 'URL Audio', 'Peso Audio', 'Fecha Subido', 'Registrado?', 'Nombre completo', 'DNI', 'Telefono', 'Email', 'Provincia', 'Localidad', 'Escala', 'Acerca de']]
    data = data.concat(infoAudios)
    json2csv(data, function (err, csv) {
      if (err) {
        log('get csv: array to csv error', err)
        return res.status(500).end()
      }
      res.status(200)
      res.set({
        'Content-Encoding': 'UTF-8',
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': `attachment; filename=audios-empatia-${Math.floor((new Date()) / 1000)}.csv`
      })
      res.write(csv)
      res.end()
    }, { prependHeader: false, excelBOM: true, delimiter: { field: '\t' } })
  }
)

// app.post('/padron/bulk/csv',
//   restrict,
//   staff,
//   function readCSV (req, res, next) {
//     log('Reading CSV')
//     console.log(req.body)
//     var csv = req.body.csv
//     if(!csv){
//       return res.status(500).end()
//     }
//     csv2json(csv, function(err, json){
//       if (err){
//         log('csv to array error', err)
//         return res.status(500).end()
//       }
//       req.listDocuments = json.map(d => Object.values(d)[0].trim())
//       console.log(req.listDocuments)
//       next()
//     })
//   },
//   function deleteDuplicates (req, res, next) {
//     log('Deleting duplicates from listDocuments')
//     // delete from req.listDocuments array any duplicate
//     req.listDocuments = req.listDocuments.filter((v, i, a) => a.indexOf(v) === i)
//     next()
//   },
//   async function checkDNI(req, res, next){
//     // Checking every document is not in the padron
//     log('Checking every document is not in the padron')
//     let inPadron = []
//     for(var i = 0; i < req.listDocuments.length; i++){
//       var dni = req.listDocuments[i]
//       var padron = await dbApi.padron.isDNIPadron(dni)
//       if (padron) {
//         log('DNI in padron', dni)
//         inPadron.push(dni)
//       }
//       // if(padron){
//         // return a 400 with a message  
//         // return res.status(400).json({
//         //   message: `El documento ${dni} ya está en el padrón`
//         // })
//       // }
//     }
//     if(inPadron.length > 0){
//       return res.status(400).json({
//         message: `Los documentos ${inPadron.join(', ')} ya están en el padrón`,
//         status: 400
//       })
//     }
//     next()
//   },
//   async function insertDocuments (req, res, next) {
//     let newDocuments = req.listDocuments.map(d => {
//       return {
//         dni: d
//       }
//     })
//     log('Inserting documents')
//     let insertedDocuments = await dbApi.padron.insertMany(newDocuments)
//     if (insertedDocuments){
//       log('Documents inserted')
//       // return a 200
//       return res.status(200).json({
//         message: `${ insertedDocuments.length } Documentos insertados correctamente`,
//         status: 200,
//         insertedDocuments
//       })
//     }
//   }
// )
