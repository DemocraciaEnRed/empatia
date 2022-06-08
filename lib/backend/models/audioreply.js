const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AudioReplySchema = new Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { id: false })
// esto último hace que no esté el campo _id e id duplicado

// AudioReplySchema.statics.findByName = function (name, cb) {
//   return this.findOne({ name: name }).exec(cb)
// }

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

AudioReplySchema.set('toObject', { getters: true })
AudioReplySchema.set('toJSON', { getters: true })
/**
 * Expose Model
 */

module.exports = function initialize (conn) {
  return conn.model('AudioReply', AudioReplySchema)
}
