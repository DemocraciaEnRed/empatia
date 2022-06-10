const config = require('lib/config')
const ObjectID = require('mongoose').Types.ObjectId
const dbReady = require('lib/backend/models').ready

const User = require('lib/backend/models').User
const Forum = require('lib/backend/models').Forum

const {adminMail, adminPass, forumProyectos} = config

const adminData = {
  email: adminMail,
  username: adminMail,
  firstName: 'Admin',
  lastName: 'Sistema',
  dni: '000000000',
  password: adminPass,
  re_password: adminPass,
  locale: 'es'
}
// const forumProyectosData = {
//   name: forumProyectos,
//   title: 'Proyectos',
//   owner: null
// }

const defaultForum = {
  name: 'proyectos',
  title: 'Proyectos',
  owner: null,
  summary: 'Proyectos de EMPATIA',
  coverUrl: 'https://celeste.blob.core.windows.net/clients-assets/empatia/doodad.png',
  permissions: [],
  extra: {
    richSummary: '<div>¡Mirá los proyectos que hay!</div>',
    closingAt: '',
    contentType: 'ejes',
    palabrasCierre: '',
    linkCierre: '',
    hidden: false
  },
  topicsAttrs: [
    {
      name: "resumen",
      title: "Resumen breve",
      description: "Texto corto que acompaña en las tarjetas de la home. Mantengalo corto y conciso.",
      mandatory: true,
      kind: "LongString",
      max: 1000,
      min: 0
    },
    {
      name: "introduccion",
      title: "Introducción de la consulta",
      description: "El siguiente texto aparece como introducción al proyecto",
      mandatory: true,
      kind: "LongString",
      max: 5000,
      min: 0
    },
    {
      name: "pregunta",
      title: "Pregunta a definir con la consulta",
      description: "Colocar aquí la pregunta que será definida en el eje de la consulta",
      mandatory: true,
      kind: "String",
      max: 500,
      min: 0
    }
  ]
}

/**
 * Make any changes you need to make to the database here
 */
class SaltearPromises { }
exports.up = function up (done) {
  dbReady()
    // Primero chequear si ya no hay cosas cargadas
    .then(() => {
      return new Promise((resolve, reject) => {
        User.collection.count({}, (err, count) => {
          if (err) reject(new Error(err))
          if (count) {
            console.log('Ya hay usuarixs cargados (%s), salteando migración', count)
            reject(new SaltearPromises())
          }
          resolve()
        })
      })
    })
    // Agregamos admin user a partir de variables de config/compose
    .then(() => {
      let adminUser = new User(adminData)
      adminUser.reference = adminData.reference
      adminUser.emailValidated = true
      return new Promise((resolve, reject) => {
        User.register(adminUser, adminData.password, function (err, user) {
          if (err) {
            console.error('add admin user failed at ', err)
            reject(new Error('add admin user failed'))
          }else{
            console.log('Saved admin user %s [%s]', user.email, user._id)
            resolve(user)
          }
        })
      })
    })
    // Agregamos forum principal (proyectos)
    .then((user) => {
      defaultForum.owner = user._id
      return new Promise((resolve, reject) => {
        let forumProyecto = new Forum(defaultForum)
        forumProyecto.save(err => {
          if (err) {
            console.error('add forum proyectos failed at ', err)
            reject(new Error('add forum proyectos failed'))
          }else{
            console.log('Saved forum proyectos [%s]', forumProyecto._id)
            resolve(forumProyecto)
          }
        })
      })
    })
    // Devolvemos al Migrator (de lib/migrations)
    .then(() => {
      console.log(`-- Agregados admin user y forum proyectos`)
      done()
    })
    .catch((err) => {
      if (err instanceof SaltearPromises)
        done()
      else{
        console.log('-- Actualizacion de admin user y forum proyectos no funcionó! Error: ', err)
        done(err)
      }
    })
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};
