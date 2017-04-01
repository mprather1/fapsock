import {_extend} from 'util'
import {inherits} from 'util'
import {Transform} from 'stream'

const extend = _extend
export default Gateway

inherits(Gateway, Transform)

const defaultOptions = {
  highWaterMark: 10,
  objectMode: true
}

function Gateway (options) {
  if(! (this instanceof Gateway)) {
    return new Gateway(options)
  }
  
  options = extend({}, options || {})
  options = extend(options, defaultOptions)
  
  Transform.call(this, options)
}

Gateway.prototype._transform = _transform;

function _transform (event, encoding, callback) {
  if (! event.id) {
    return handleError(new Error('event doesn\'t have an \'id\' field'))
  }
  pushToQueue(event, pushed)
  
  function pushed (err) {
    if (err) { 
      handleError(err)
    } else {
      var reply = {
        id: event.id,
        success: true
      }
      callback(null, reply)
    }
  }
  
  function handleError (err) {
    var reply = {
      id: event.id,
      success: false,
      error: err.message
    }
    callback(null, reply)
  }
}

function pushToQueue (object, callback) {
  setTimeout(callback, Math.floor(Math.random() * 1000))
}