'use strict'

const mongoose = require('mongoose')
// let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest");
let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds035836.mlab.com:35836/kings");

module.exports = require('./schemas')(db)
