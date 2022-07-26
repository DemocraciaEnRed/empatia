/**
 * Module dependencies.
 */

var crypto = require('crypto')
var express = require('express')
var config = require('lib/config')
var api = require('lib/backend/db-api')
var jwt = require('lib/backend/jwt')
var l10n = require('lib/backend/l10n')
var utils = require('lib/backend/utils')
var staff = utils.staff
var manager = utils.manager

var setDefaultForum = require('lib/backend/middlewares/forum-middlewares').setDefaultForum
var initPrivileges = require('lib/backend/middlewares/user').initPrivileges
var canCreate = require('lib/backend/middlewares/user').canCreate
var canManage = require('lib/backend/middlewares/user').canManage
var forgotpassword = require('../forgot/lib/forgotpassword')
var signup = require('./lib/signup')
var log = require('debug')('democracyos:signup-api')

/**
 * Exports Application
 */

var app = module.exports = express()

/**
 * Define routes for SignUp module
 */

app.post('/signup',
(req, res, next) => {
  if (config.allowPublicSignUp){
    next()
  } else {
    // si es manager se le permite, si no es manager, entonces si o si debe ser staff
    if (req.user.manager) {
      manager(req, res, next)
    } else {
      staff(req, res, next)
    }
  }
},
function (req, res) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  }

  var profile = req.body
  profile.locale = config.enforceLocale ? config.locale : l10n.requestLocale(req)

  signup.doSignUp(profile, meta, function (err) {
    if (err) return res.status(400).json({ error: err.message })
    return res.status(200).send()
  })
})

/**
* Populate permissions after setup
*/

function addPrivileges (req, res, next) {
  return jwt.signin(api.user.expose.confidential(req.user), req, res)
}

app.post('/signup/validate', function (req, res, next) {
  signup.emailValidate(req.body, function (err, user) {
    if (err) return res.status(200).json({ error: err.message })
    req.user = user
    return next()
  })
}, initPrivileges, canCreate, setDefaultForum, canManage, addPrivileges)

app.post('/signup/resend-validation-email', function (req, res) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  }

  signup.resendValidationEmail(req.body, meta, function (err) {
    if (err) return res.status(200).json({ error: err.message })
    return res.status(200).send()
  })
})

const verifySignature = function (receivedSignature, payload){
  const hash = crypto
    .createHmac('sha256', config.typeformWebhookSecret)
    .update(payload)
    .digest('base64')
  return receivedSignature === `sha256=${hash}`
}

app.post('/signup/presignup',
function (req, res, next) {
  const signature = req.headers['typeform-signature']
  const isValid = verifySignature(signature, `${JSON.stringify(req.body)}\u000a`)
  if (!isValid) {
    log('Signature is invalid')
    return res.status(400).json({ error: 'Invalid signature' })
  } else {
    log('Signature is valid')
    next()
  }
},
function (req, res, next) {
  let answerOptions = req.body.form_response.answers.find(a => a.field.ref === 'options')
  if (answerOptions && answerOptions.choices && answerOptions.choices.labels) {
    let selectedOptions = answerOptions.choices.labels
    console.log(selectedOptions)
    if (selectedOptions.includes('Ver y/o presentar un proyecto para mi ciudad') || selectedOptions.includes('Colaborar en los proyectos de Manes')){
      log('User choosed to participate')
      next()
    } else {
      log('User choosed to not participate')
      return res.status(200).json({ error: 'User chosed to not participate' })
    }
  } else {
    log('User choosed to not participateb (No answer options)')
    return res.status(200).json({ error: 'User chosed to not participate' })
  }
},

// function (req, res, next) {
//   // check preSignUpToken is equal to config.preSignUpToken
//   console.log(req.body)
//   if (req.body && req.body.token !== config.preSignUpToken){
//     return res.status(400).json({ error: 'Invalid signup' })
//   } else {
//     next()
//   }
// },
function (req, res, next) {
  var contacto = null
  var phoneNumberAnswer = req.body.form_response.answers.find(a => a.field.ref === 'telefono')
  if (phoneNumberAnswer && phoneNumberAnswer.phone_number) {
    contacto = phoneNumberAnswer.phone_number
  }
  var profile = {
    email: req.body.form_response.answers.find(a => a.field.ref === 'email').email,
    firstName: req.body.form_response.answers.find(a => a.field.ref === 'firstName').text,
    lastName: req.body.form_response.answers.find(a => a.field.ref === 'lastName').text,
    // number to string because typeform returns a number
    dni: (req.body.form_response.answers.find(a => a.field.ref === 'dni').number).toString(),
    contacto: contacto
  }
  // validate if email, firstName, lastName, dni are not empty
  if (!profile.email || !profile.firstName || !profile.lastName || !profile.dni) {
    log('Signup is invalid, missing required fields')
    return res.status(200).json({ error: 'Invalid signup' })
  } else {
    log('Signup is valid')
    req.profile = profile
    next()
  }
},
function (req, res, next){
  var provincia = null
  var provinciaAnswer = req.body.form_response.answers.find(a => a.field.ref === 'provincia')
  if (provinciaAnswer && provinciaAnswer.choice && provinciaAnswer.choice.label) {
    provincia = provinciaAnswer.choice.label
  }
  var localidad_buenosaires = req.body.form_response.answers.find(a => a.field.ref === 'buenosaires')
  var localidad_catamarca = req.body.form_response.answers.find(a => a.field.ref === 'catamarca')
  var localidad_chaco = req.body.form_response.answers.find(a => a.field.ref === 'chaco')
  var localidad_chubut = req.body.form_response.answers.find(a => a.field.ref === 'chubut')
  var localidad_cordoba = req.body.form_response.answers.find(a => a.field.ref === 'cordoba')
  var localidad_corrientes = req.body.form_response.answers.find(a => a.field.ref === 'corrientes')
  var localidad_entrerios = req.body.form_response.answers.find(a => a.field.ref === 'entrerios')
  var localidad_formosa = req.body.form_response.answers.find(a => a.field.ref === 'formosa')
  var localidad_jujuy = req.body.form_response.answers.find(a => a.field.ref === 'jujuy')
  var localidad_lapampa = req.body.form_response.answers.find(a => a.field.ref === 'lapampa')
  var localidad_larioja = req.body.form_response.answers.find(a => a.field.ref === 'larioja')
  var localidad_mendoza = req.body.form_response.answers.find(a => a.field.ref === 'mendoza')
  var localidad_misiones = req.body.form_response.answers.find(a => a.field.ref === 'misiones')
  var localidad_neuquen = req.body.form_response.answers.find(a => a.field.ref === 'neuquen')
  var localidad_rionegro = req.body.form_response.answers.find(a => a.field.ref === 'rionegro')
  var localidad_salta = req.body.form_response.answers.find(a => a.field.ref === 'salta')
  var localidad_sanjuan = req.body.form_response.answers.find(a => a.field.ref === 'sanjuan')
  var localidad_sanluis = req.body.form_response.answers.find(a => a.field.ref === 'sanluis')
  var localidad_santacruz = req.body.form_response.answers.find(a => a.field.ref === 'santacruz')
  var localidad_santafe = req.body.form_response.answers.find(a => a.field.ref === 'santafe')
  var localidad_santiagodelestereo = req.body.form_response.answers.find(a => a.field.ref === 'santiagodelestereo')
  var localidad_tierradelfuego = req.body.form_response.answers.find(a => a.field.ref === 'tierradelfuego')
  var localidad_tucuman = req.body.form_response.answers.find(a => a.field.ref === 'tucuman')
  var localidad = null

  if (localidad_buenosaires && localidad_buenosaires.choice && localidad_buenosaires.choice.label) {
    localidad = localidad_buenosaires.choice.label
  }
  if (localidad_catamarca && localidad_catamarca.choice && localidad_catamarca.choice.label) {
    localidad = localidad_catamarca.choice.label
  }
  if (localidad_chaco && localidad_chaco.choice && localidad_chaco.choice.label) {
    localidad = localidad_chaco.choice.label
  }
  if (localidad_chubut && localidad_chubut.choice && localidad_chubut.choice.label) {
    localidad = localidad_chubut.choice.label
  }
  if (localidad_cordoba && localidad_cordoba.choice && localidad_cordoba.choice.label) {
    localidad = localidad_cordoba.choice.label
  }
  if (localidad_corrientes && localidad_corrientes.choice && localidad_corrientes.choice.label) {
    localidad = localidad_corrientes.choice.label
  }
  if (localidad_entrerios && localidad_entrerios.choice && localidad_entrerios.choice.label) {
    localidad = localidad_entrerios.choice.label
  }
  if (localidad_formosa && localidad_formosa.choice && localidad_formosa.choice.label) {
    localidad = localidad_formosa.choice.label
  }
  if (localidad_jujuy && localidad_jujuy.choice && localidad_jujuy.choice.label) {
    localidad = localidad_jujuy.choice.label
  }
  if (localidad_lapampa && localidad_lapampa.choice && localidad_lapampa.choice.label) {
    localidad = localidad_lapampa.choice.label
  }
  if (localidad_larioja && localidad_larioja.choice && localidad_larioja.choice.label) {
    localidad = localidad_larioja.choice.label
  }
  if (localidad_mendoza && localidad_mendoza.choice && localidad_mendoza.choice.label) {
    localidad = localidad_mendoza.choice.label
  }
  if (localidad_misiones && localidad_misiones.choice && localidad_misiones.choice.label) {
    localidad = localidad_misiones.choice.label
  }
  if (localidad_neuquen && localidad_neuquen.choice && localidad_neuquen.choice.label) {
    localidad = localidad_neuquen.choice.label
  }
  if (localidad_rionegro && localidad_rionegro.choice && localidad_rionegro.choice.label) {
    localidad = localidad_rionegro.choice.label
  }
  if (localidad_salta && localidad_salta.choice && localidad_salta.choice.label) {
    localidad = localidad_salta.choice.label
  }
  if (localidad_sanjuan && localidad_sanjuan.choice && localidad_sanjuan.choice.label) {
    localidad = localidad_sanjuan.choice.label
  } 
  if (localidad_sanluis && localidad_sanluis.choice && localidad_sanluis.choice.label) {
    localidad = localidad_sanluis.choice.label
  }
  if (localidad_santacruz && localidad_santacruz.choice && localidad_santacruz.choice.label) {
    localidad = localidad_santacruz.choice.label
  }
  if (localidad_santafe && localidad_santafe.choice && localidad_santafe.choice.label) {
    localidad = localidad_santafe.choice.label
  }
  if (localidad_santiagodelestereo && localidad_santiagodelestereo.choice && localidad_santiagodelestereo.choice.label) {
    localidad = localidad_santiagodelestereo.choice.label
  }
  if (localidad_tierradelfuego && localidad_tierradelfuego.choice && localidad_tierradelfuego.choice.label) {
    localidad = localidad_tierradelfuego.choice.label
  }
  if (localidad_tucuman && localidad_tucuman.choice && localidad_tucuman.choice.label) {
    localidad = localidad_tucuman.choice.label
  }
  req.profile['provincia'] = provincia
  req.profile['localidad'] = localidad
  next()
},
function (req, res) {
  var meta = {
    ip: req.ip,
    ips: req.ips,
    host: req.get('host'),
    origin: req.get('origin'),
    referer: req.get('referer'),
    ua: req.get('user-agent')
  }

  // create a random string without sense
  var randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  log('Generating random password')
  req.profile.password = randomPassword
  req.profile.locale = config.enforceLocale ? config.locale : l10n.requestLocale(req)

  signup.doPreSignUp(req.profile, meta, function (err) {
    if (err) {
      log('Error happened. Sending 200 to Webhook. Err message: ' + err.message)
      return res.status(200).json({ error: err.message })
    } 
    log('preSignUp done')
    if (err) {
      // FIXME: horrible hack for #610. Find a final solution and apply.
      if (err.status) {
        log('Error happened. Sending 200 to Webhook. Err message: ' + err.message)
        // FIXME: needed this special error code for redirection
        return res.status(200).json({ error: err.message, status: err.status })
      } else {
        // FIXME: user just doesn't exist. Not a server error
        log('Returning 200: user just doesnt exist ')
        return res.status(200).json({ error: err.message })
      }
    }
    log('Returning 200: no error')
    return res.status(201).send()
  })
})
