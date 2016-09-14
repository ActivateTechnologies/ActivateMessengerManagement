'use strict'

const mongoose = require('mongoose')
let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds013664.mlab.com:13664/bot");

module.exports = require('./schemas')(db)
