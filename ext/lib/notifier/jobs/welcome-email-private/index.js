const config = require('lib/config')
const utils = require('democracyos-notifier/lib/utils')
const template = require('./template')

const jobName = 'welcome-email-private'
const subject = `[${config.organizationName}] ¡Te invitamos a participar! Terminá tu registro`
const log = require('debug')(`democracyos:notifier:${jobName}`)

module.exports = function welcomeEmailPrivate (notifier) {
  const { db, agenda, mailer } = notifier
  const users = db.get('users')

  agenda.define(jobName, { priority: 'high' }, welcomeEmailPrivate)

  function welcomeEmailPrivate (job, done) {
    const data = job.attrs.data

    users.findOne({ email: data.to }).then((user) => {
      if (!user) throw new Error(`User not found for email "${data.to}"`)

      const html = template({
        userName: user.firstName,
        userEmail: user.email,
        password: data.password
      })

      return mailer.send({
        to: utils.emailAddress(user),
        subject,
        html
      })
    }).then(() => { done() }).catch(err => {
      log('Error: %o', err)
      done(err)
    })
  }
}