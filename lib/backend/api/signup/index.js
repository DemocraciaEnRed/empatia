/**
 * Module dependencies.
 */

var express = require('express')
var config = require('lib/config')
var api = require('lib/backend/db-api')
var jwt = require('lib/backend/jwt')
var l10n = require('lib/backend/l10n')
var utils = require('lib/backend/utils')
var staff = utils.staff

var setDefaultForum = require('lib/backend/middlewares/forum-middlewares').setDefaultForum
var initPrivileges = require('lib/backend/middlewares/user').initPrivileges
var canCreate = require('lib/backend/middlewares/user').canCreate
var canManage = require('lib/backend/middlewares/user').canManage
var forgotpassword = require('../forgot/lib/forgotpassword')
var signup = require('./lib/signup')

/**
 * Exports Application
 */

var app = module.exports = express()

/**
 * Define routes for SignUp module
 */

app.post('/signup',
(req, res, next) => {
  if (config.allowPublicSignUp)
    next()
  else // solo lxs del staff pueden registrar usus si no está permitido al público
    staff(req, res, next)
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

app.post('/signup/presignup',
function (req, res, next) {
  // check preSignUpToken is equal to config.preSignUpToken
  console.log(req.body)
  if (req.body && req.body.token !== config.preSignUpToken){
    return res.status(400).json({ error: 'Invalid signup' })
  } else {
    next()
  }
},
function (req, res, next) {
  // validate if email, firstName, lastName, dni are not empty
  if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.dni) {
    return res.status(400).json({ error: 'Invalid signup' })
  } else {
    next()
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

  // create a random string without sense
  var randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) 

  var profile = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dni: req.body.dni,
    password: randomPassword
  }
  console.log(profile)
  profile.locale = config.enforceLocale ? config.locale : l10n.requestLocale(req)

  signup.doPreSignUp(profile, meta, function (err) {
    if (err) return res.status(400).json({ error: err.message })
    console.log('preSignUp done')
    if (err) {
      // FIXME: horrible hack for #610. Find a final solution and apply.
      if (err.status) {
        // FIXME: needed this special error code for redirection
        return res.status(500).json({ error: err.message, status: err.status })
      } else {
        // FIXME: user just doesn't exist. Not a server error
        return res.status(200).json({ error: err.message })
      }
    }
    return res.status(200).send()
  })
})
