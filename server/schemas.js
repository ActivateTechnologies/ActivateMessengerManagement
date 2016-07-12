'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('./../config')

mongoose.connect(config.MONGODB_URI);

let userSchema = new Schema({
  userId: String,
  firstname: String,
  lastname: String,
  profile_pic: String,
  locale: String,
  gender: String
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
