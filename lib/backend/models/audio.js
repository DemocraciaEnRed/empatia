const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AudioSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  file: { type: String, required: true },
  mimetype: { type: String, default: null },
  size: { type: Number, default: null },
  reaction: { type: String, default: null },
  about: { type: String, default: null },
  group: { type: String, default: null },
  subgroup: { type: String, default: null },
  messages: [{ type: Schema.Types.ObjectId, ref: 'AudioReply', default: [] }],
  province: { type: String, default: null },
  location: { type: String, default: null },
  scale: { type: String, default: null },
  contact: { type: String, default: null },
  spam: { type: Boolean, default: false },
  fullName: { type: String, default: null },
  email: { type: String, default: null },
  dni: { type: String, default: null },
  featured: { type: Boolean, default: false },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  deletedAt: Date
}, { id: false })
// esto último hace que no esté el campo _id e id duplicado

// AudioSchema.statics.findByName = function (name, cb) {
//   return this.findOne({ name: name }).exec(cb)
// }

/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

AudioSchema.set('toObject', { getters: true })
AudioSchema.set('toJSON', { getters: true })
/**
 * Expose Model
 */

module.exports = function initialize (conn) {
  return conn.model('Audio', AudioSchema)
}
