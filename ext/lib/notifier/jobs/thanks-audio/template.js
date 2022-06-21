const config = require('lib/config')
const utils = require('lib/backend/utils')

const html = require('es6-string-html-template').html
// para inline-ar estilos css - https://github.com/Automattic/juice
const juice = require('juice');

const emailTemplate = require('ext/lib/notifier/responsive-html-email-template');
const buttonTemplate = require('ext/lib/notifier/responsize-email-button-template');

const baseUrl = utils.buildUrl(config)

module.exports = ({
  userName, url
}, {
  lang
}) => emailTemplate({
  body: html`
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Confirmamos que recibimos tú idea en el portal de EMPATÍA.</p>
    <p>¡Facundo y todo su equipo te agradece por compartirnos tú idea!</p>
    <p>Mientras te escuchamos y vemos como llevarla adelante, te invitamos a conocer otros proyectos. ¡Esperamos tú comentario!</p>
    ${buttonTemplate({
      url: url,
      text: 'Conocé los proyectos'
    })}
    <p>Gracias por ser parte de EMPATÍA, la revolución que transforma la Argentina</strong></p>
  `
})
