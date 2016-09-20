'use strict'

const mongoose = require('mongoose')
let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds029496.mlab.com:29496/uwe");


let schema = function(connection){

  let userSchema = new Schema({
    mid: String,
    firstName: String,
    lastName: String,
    profilePic: String,
    locale: String,
    gender: String,
    notifications: String,
    signedUpDate: Date,
    extras: Array,
    events: Array,
    conversationLocation: {
      conversationName: String,
      nodeId: String,
      nodeType: String,
      userErrorText: String
    }
  })

  // extras is an object {}
  // so any new property like striker can be added
  // user.extras['position'] = "striker"

  let eventSchema = new Schema({
    name: String,
    strapline: String,
    image_name: String,
    image_url: String,
    latlong: String,
    price: Number,
    when: Date,
    desc: String,
    joined: [{
      uid: String,
      joinDate: Date
    }],
    capacity: Number
  })

  let analyticsSchema = new Schema({
    name: String,
    total: Number,
    activity: [{
      uid: String,
      time: Date,
      gid: String,
      amount: Number
    }]
  })

  let conversationsSchema = new Schema({
    name: String,
    next: Array
  })

  let registerSchema = new Schema({
    name: String,
    phoneNumber: String,
    email: String,
    fbPageURL: String,
    description: String
  })

  if (!connection.models.User) {
    console.log("user");
    connection.model('User', userSchema);
  }
  if (!connection.models.Event) {
    console.log("event");
    connection.model('Event', eventSchema);
  }
  if (!connection.models.Analytics) {
    console.log("analytics");
    connection.model('Analytics', analyticsSchema)
  }
  if (!connection.models.Conversation) {
    console.log("convo");
    connection.model('Conversations', conversationsSchema)
  }
  return {
    User: connection.models.User,
    Event: connection.models.Event,
    Analytics: connection.models.Analytics,
    Conversations: connection.models.Conversations
  };
}

module.exports = require('./schemas')(db)
