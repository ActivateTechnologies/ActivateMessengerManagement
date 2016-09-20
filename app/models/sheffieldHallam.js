'use strict'

const mongoose = require('mongoose')
let db = mongoose.createConnection("mongodb://anirudh:kickabout@ds035816.mlab.com:35816/sheffield_hallam");

module.exports = require('./schemas')(db)
