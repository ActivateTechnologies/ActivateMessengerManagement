'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest');

let userSchema = new Schema({
  userID: String, //messenger user ID
  facebookID: String,
  email: String,
  name: String
})

let User = mongoose.model('User', userSchema);


let gameSchema = new Schema({
  name: String,
  address: String,
  image_name: String,
  image_url: String,
  latlong: String,
  when: Date,
  desc: String,
  joined: [{
    userId: String
  }],
  capacity: Number
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


module.exports = {
  User: User,
  Game: Game,
  Button: Button
}
