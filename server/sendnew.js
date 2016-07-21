'use strict'

const request = require('request');
const M = require('./schemas.js');
const config = require('./../config');
const W = require('./wit.js');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN

function text(sender, text) {
  let messageData = { text: text }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
        recipient: {id:sender},
        message: messageData,
    }
  }, function(error, response, body) {
		let errorObject = (error) ? error : response.body.error;
    if (errorObject) {
      console.log('Error sending messages (to user ' 
      	+ sender + '): ', errorObject);
    }
  });
}

function textWithQuickReplies(sender, text, quickReplies) {
	let quickRepliesObjects = [];
	quickReplies.forEach((textString) => {
		quickRepliesObjects.push({
      "content_type":"text",
      "title":textString,
      "payload":"staticTempPayLoad~" + textString
    });
	});

  let messageData = {
    text: text,
    quick_replies: quickRepliesObjects
  }

  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error sending messages: ', response.body.error)
      }
  });
}

function typingIndicator(sender, onOrOff) {
  let typingStatus = (onOrOff) ? 'typing_on' : 'typing_off';
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
        recipient: {id:sender},
        sender_action: typingStatus
    }
  }, function(error, response, body) {
    if (error) {
        console.log('Error setting typing indicator: ', error)
    } else if (response.body.error) {
        console.log('Error setting typing indicator: ', response.body.error)
    }
  })
}

module.exports = {
  text: text,
  typingIndicator: typingIndicator,
  textWithQuickReplies: textWithQuickReplies
}
