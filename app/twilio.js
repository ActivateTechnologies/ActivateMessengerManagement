'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./config')
const twilio = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

function sendSms(phoneNumber, message, callback) {
  twilio.messages.create({
    body: message,
    to: phoneNumber,
    from: config.TWILIO_NUMBER
    // mediaUrl: 'http://www.yourserver.com/someimage.png'
  }, (error, data) => {
    if (error) {
      if (callback) {
        callback(error);
      } else {
        console.error('Twilio could not send sms:', error);
      }
    } else if (callback) {
      callback();
    }
  });
  /*console.log('Sms disabled, sms not sent.');
  if (callback) {
    callback();
  }*/
}

module.exports = {
  sendSms: sendSms
}
