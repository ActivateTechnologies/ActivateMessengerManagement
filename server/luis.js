'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const sendNew = require('./sendnew.js');

function processTextMessage(sender, message, defaultCallback) {
	sendNew.typingIndicator(sender, true);
	postToLuis(message, (body) => {
		let data = JSON.parse(body);
		sendNew.typingIndicator(sender, false);
		console.log('LUIS first intent', data.intents[0]);
		let time = '';
		if (data.entities.length) {
			let entitity = data.entities[0];
			if (entitity.type == 'builtin.datetime.date') {
				console.log('date:', entitity.resolution.date);
				time = entitity.resolution.date;
			} else if (entitity.type == 'builtin.datetime.time') {
				console.log('time:', entitity.resolution.time);
				time = entitity.resolution.time;
			} else {
				console.log(data.entities[0]);
			}
		}
		sendNew.text(sender, data.intents[0].intent + ', ' + time);
	});
}

function postToLuis(message, callback) {
	request({
    url: 'https://api.projectoxford.ai/luis/v1/application?id='
     + config.LUIS_ID + '&subscription-key=' + config.LUIS_SUBSCRIPTION_KEY
     + '&q=' + encodeURIComponent(message),
    method: 'get'
  }, function(error, response, body) {
  	let errorObject = (error) ? error : response.body.error;
  	if (errorObject) {
  		console.log('Error in postToLuis():', errorObject);
  		callback(null);
  	} else {
  		callback(body);
  	}
  });
}

module.exports = {
  processTextMessage: processTextMessage
}