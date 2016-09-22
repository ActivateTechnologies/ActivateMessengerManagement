'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds013664.mlab.com:13664/bot");

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
    events: Array,
    conversationLocation: {
      conversationName: String,
      nodeId: String,
      nodeType: String,
      userErrorText: String
    }
  })

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
  if (!connection.models.Register) {
    console.log("register");
    connection.model('Register', registerSchema)
  }

  return {
    User: connection.models.User,
    Event: connection.models.Event,
    Analytics: connection.models.Analytics,
    Conversations: connection.models.Conversations,
    Register: connection.models.Register
  };
}

module.exports = schema(db)
