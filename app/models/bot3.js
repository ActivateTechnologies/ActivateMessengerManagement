'use strict'

const mongoose = require('mongoose')
let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds011379.mlab.com:11379/uclfootball");

module.exports = require('./schemas')(db)
