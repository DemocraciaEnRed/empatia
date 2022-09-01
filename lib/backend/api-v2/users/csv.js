const debug = require('debug')
const log = debug('democracyos:api:userscsv')
const moment = require('moment')

const express = require('express')
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

app.get('/users/all/csv',
  restrict,
  staff,
  function getUsers (req, res, next) {
    log('Getting users')
    dbApi.user.getAll().then((data) => {
      if (data) {
        log('Serving users')
        req.data = data
        next()
      } else {
        return res.status(500).end()
      }
    }).catch(err => {
      log('Error getting users', err)
      return res.status(500).end()
    })
  },
  function sendCsv (req, res, next) {
    var infoPadron = req.data.map((u) => {
      return [
        u ? u.email : '-',
        u ? escapeTxt(u.dni) : '-',
        u ? escapeTxt(u.firstName) : '-',
        u ? escapeTxt(u.lastName) : '-',
        u ? escapeTxt(u.provincia) : '-',
        u ? escapeTxt(u.localidad) : '-',
        u ? escapeTxt(u.contacto) : '-',
        u ? (u.emailValidated ? 'SI' : 'NO') : '-',
        u ? escapeTxt(moment(u.createdAt).format('YYYY-MM-DD HH:mm:ss')) : '-',
        u ? escapeTxt(moment(u.last).format('YYYY-MM-DD HH:mm:ss')) : '-'
      ]
    })
    var data = [['Email', 'DNI', 'Nombre', 'Apellido', 'Provincia', 'Localidad', 'Contacto', 'Valido?', 'Fecha de creacion', 'Ultimo acceso']]
    data = data.concat(infoPadron)
    json2csv(data, function (err, csv) {
      if (err) {
        log('get csv: array to csv error', err)
        return res.status(500).end()
      }
      res.status(200)
      res.set({
        'Content-Encoding': 'UTF-8',
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': `attachment; filename=${Math.floor((new Date()) / 1000)}-acciones-empatia-users.csv`
      })
      res.write(csv)
      res.end()
    }, { prependHeader: false, excelBOM: true })
  }
)
