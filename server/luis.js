'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const sendNew = require('./sendnew.js');

function processTextMessage(sender, message, defaultCallback) {

}

module.exports = {
  processTextMessage: processTextMessage
}