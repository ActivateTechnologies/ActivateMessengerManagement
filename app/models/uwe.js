'use strict'

const mongoose = require('mongoose')
mongoose.createConnection("mongodb://anirudh:kickabout@ds029496.mlab.com:29496/uwe");

module.exports = require('./schemas')(mongoose)
