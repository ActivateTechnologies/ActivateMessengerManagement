'use strict'

const mongoose = require('mongoose')
mongoose.createConnection("mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest");

module.exports = require('./schemas')(mongoose)
