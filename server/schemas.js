'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('./../config')

//http://stackoverflow.com/a/38153706/2015362
mongoose.Promise = global.Promise;

mongoose.connect(config.MONGODB_URI, (error) => {
  if (error) {
    console.log('Error connecting to mongoose:', error);
  }
});

let userSchema = new Schema({
  mid: String,
  userId: String,
  phoneNumber: String,
  firstName: String,
  lastName: String,
  profilePic: String,
  locale: String,
  gender: String,
  notifications: String,
  publicLink: String,
  signedUpDate: Date,
  messengerSignedUpDate: Date,
  events: [{
    eid: String,
    bookingReference: String,
    joinDate: Date
  }],
  conversationLocation: {
    conversationName: String,
    nodeId: String,
    nodeType: String,
    userErrorText: String
  }
})

let User = mongoose.model('User', userSchema);

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
  capacity: Number,
  non_members_attending: Number
})

let Event = mongoose.model('Events', eventSchema);


/*let buttonSchema = new Schema({
  name: String,
  activity: [{
    uid: String,
    time: Date
  }]
})

let Button = mongoose.model('Button', buttonSchema);*/

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

let Analytics = mongoose.model('Analytics', analyticsSchema);


let ConversationsSchema = new Schema({
  name: String,
  next: Array
})

let Conversations = mongoose.model('Conversations', ConversationsSchema);

module.exports = {
  User: User,
  Event: Event,
  Analytics: Analytics,
  Conversations: Conversations
}