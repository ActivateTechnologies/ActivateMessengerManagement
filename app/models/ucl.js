'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds011379.mlab.com:11379/uclfootball");


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
    interactionTime: Date,
    receivedTime: Date,

    phoneNumber: String,
    email: String,
    preferredPosition: String,
    backupPosition: String,
    level: String,
    type: String,

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

  let groupSchema = new Schema({
    name: String,
    list: Array
  })

  let interactionsSchema = new Schema({
    type: String,
    uid: String,
    time: Date
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
  if (!connection.models.Group) {
    console.log("group");
    connection.model('Group', groupSchema)
  }
  if (!connection.models.Interaction) {
    console.log("interactions");
    connection.model('Interaction', interactionsSchema)
  }


  return {
    User: connection.models.User,
    Event: connection.models.Event,
    Analytics: connection.models.Analytics,
    Conversations: connection.models.Conversations,
    Group: connection.models.Group,
    Interaction: connection.models.Interaction
  };
}

module.exports = schema(db)
