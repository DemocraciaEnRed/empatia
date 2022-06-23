const config = require('lib/config')
const t = require('t-component')
const log = require('debug')('democracyos:notifier:set-password')
const utils = require('democracyos-notifier/lib/utils')
const template = require('./template')

const jobName = 'set-password'
const subject = `[${config.organizationName}] ¡Te invitamos a participar! Terminá tu registro`

module.exports = function inviteSetPassword (notifier) {
  const { db, agenda, mailer } = notifier
  const users = db.get('users')

  agenda.define(jobName, { priority: 'high' }, (job, done) => {
    const data = job.attrs.data

    users.findOne({ email: data.to }).then((user) => {
      if (!user) throw new Error(`User not found for email "${data.to}"`)

      const html = template({
        userName: user.firstName,
        resetPasswordUrl: data.resetUrl
      }, {
        lang: user.locale
      })

      log('Sending mail to %o', utils.emailAddress(user))
      return mailer.send({
        to: utils.emailAddress(user),
        subject,
        html
      })
    }).then(() => { done() }).catch(err => {
      log('Error: %o', err)
      done(err)
    })
  })
}
