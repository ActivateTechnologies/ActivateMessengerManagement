'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://anirudh:kickabout@ds013664.mlab.com:13664/bot');

let userSchema = new Schema({
  userId: String,
  firstname: String,
  lastname: String,
  profile_pic: String,
  locale: String,
  gender: String,
  eligible: Boolean,
  university: String
})

let User = mongoose.model('User', userSchema);


let gameSchema = new Schema({
  name: String,
  address: String,
  image_url: String,
  latlong: String
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
