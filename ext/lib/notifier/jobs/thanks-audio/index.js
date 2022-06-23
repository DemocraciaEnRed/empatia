const config = require('lib/config')
const t = require('t-component')
const log = require('debug')('democracyos:notifier:thanks-audio')
const utils = require('democracyos-notifier/lib/utils')
const template = require('./template')

const jobName = 'thanks-audio'
const subject = `[${config.organizationName}] ¡Recibimos tú audio!`

module.exports = function thanksAudioNotification (notifier) {
  const { db, agenda, mailer } = notifier
  const users = db.get('users')

  agenda.define(jobName, { priority: 'high' }, (job, done) => {
    const data = job.attrs.data

    users.findOne({ email: data.to }).then((user) => {
      if (!user) throw new Error(`User not found for email "${data.to}"`)

      const html = template({
        userName: user.firstName,
        url: data.url
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
