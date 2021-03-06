const debug = require('debug')
const log = debug('democracyos:db-api:audio')

const utils = require('lib/backend/utils')
const pluck = utils.pluck

const Audio = require('lib/backend/models').Audio
const { ObjectID } = require('mongodb')

exports.all = (query) => {
  log('Getting audios sorted by createdAt')
  return Audio.find(query).sort({ createdAt: 1 })
}

exports.allPaginated = (page, query, sortCreatedAt, limit) => {
  log('Getting audios paginated')
  return Audio.find(query).sort({ createdAt: sortCreatedAt }).skip(page * limit).limit(limit).populate(['user','messages'])
}

exports.get = (audioId) => {
  log('Getting audio sorted by datetime')
  return Audio.findOne({_id: ObjectID(audioId)})
}

exports.getFromIdAndUser = (audioId, userId) => {
  log('Getting audio from id and user')
  return Audio.findOne({_id: ObjectID(audioId), user: ObjectID(userId)}).populate('user')
}

exports.create = (audio) => {
  log('Creating audio')
  return Audio.create(audio)
}
exports.update = (audioId, audio) => {
  log('Updating audio')
  return Audio.findOneAndUpdate({_id: ObjectID(audioId)}, audio, {new: true}).populate('user')
}
exports.remove = (audioId) => {
  log('Removing audio')
  return Audio.findOneAndRemove({_id: ObjectID(audioId)})
}
exports.count = (query) => {
  log('Getting audio count')
  return Audio.find(query).count()
}

exports.getAllWithUsers = (query) => {
  log('Getting audios with users')
  return Audio.find(query).populate('user')
}