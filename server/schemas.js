'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('./../config')

mongoose.connect(config.MONGODB_URI);

let userSchema = new Schema({
  userId: String,
  phoneNumber: String,
  firstname: String,
  lastname: String,
  profile_pic: String,
  locale: String,
  gender: String,
  notifications: String,
  publicLink: String,
  conversationLocation: {
    conversationName: String,
    nodeId: String,
    nodeType: String,
    userErrorText: String
  }
})

let User = mongoose.model('User', userSchema);

let gameSchema = new Schema({
  name: String,
  address: String,
  image_name: String,
  image_url: String,
  latlong: String,
  price: Number,
  when: Date,
  desc: String,
  joined: [{
    userId: String
  }],
  capacity: Number,
  non_members_attending: Number
})

let Game = mongoose.model('Game', gameSchema);


let buttonSchema = new Schema({
  name: String,
  activity: [{
    userId: String,
    time: Date
  }]
})

let Button = mongoose.model('Button', buttonSchema);

let analyticsSchema = new Schema({
  name: String,
  activity: [{
    userId: String,
    time: Date,
    gid: String,
    amount: Number
  }]
})

let Analytics = mongoose.model('Analytics', analyticsSchema);


let ConversationsSchema = new Schema({
  name: String,
  next: Array
})

let Conversations = mongoose.model('Conversations', ConversationsSchema);

module.exports = {
  User: User,
  Game: Game,
  Button: Button,
  Analytics: Analytics,
  Conversations: Conversations
}