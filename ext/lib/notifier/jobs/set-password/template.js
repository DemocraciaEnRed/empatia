const config = require('lib/config')
const utils = require('lib/backend/utils')

const html = require('es6-string-html-template').html
// para inline-ar estilos css - https://github.com/Automattic/juice
const juice = require('juice');

const emailTemplate = require('ext/lib/notifier/responsive-html-email-template');
const buttonTemplate = require('ext/lib/notifier/responsize-email-button-template');

const baseUrl = utils.buildUrl(config)

module.exports = ({
  userName, resetPasswordUrl
}, {
  lang
}) => emailTemplate({
  body: html`
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Recibimos tu inscripción para participar en Empatía. Para finalizar el registro tenés que confirmar tu inscripción haciendo click en el siguiente botón</p>
    ${buttonTemplate({
      url: resetPasswordUrl,
      text: 'Establecer contraseña'
    })}
    <p>Gracias por ser parte de Empatía, la revolución que transforma la Argentina</strong></p>
    <p style='font-size:12px'><i>Si el botón de "Establecer contraseña" no funciona, copiá y pegá el siguiente link en tu navegador: <a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a></i></p>
  `
})
