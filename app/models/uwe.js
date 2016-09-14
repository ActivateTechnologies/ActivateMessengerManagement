'use strict'

const mongoose = require('mongoose')
let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds029496.mlab.com:29496/uwe");

module.exports = require('./schemas')(db)
