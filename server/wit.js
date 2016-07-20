'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const send = require('./sendnew.js');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN

const Wit = require('node-wit').Wit;
const log = require('node-wit').log;

// Wit actions
const actions = {
  send(request, response) {
  	const sessionId = request.sessionId;
  	const context = request.context;
  	const entities = request.entities;

  	const text = response.text;
  	const quickreplies = response.quickreplies;

    console.log('actions.send() called');
  },
  countUpcomingGames(request) {
  	const sessionId = request.sessionId;
  	const context = request.context;
  	const entities = request.entities;

  	/*const text = response.text;
  	const quickreplies = response.quickreplies;*/

		console.log('countUpcomingGames() called with sessionId: ' + sessionId);

		return new Promise(function(resolve, reject) {
			context.numUpcomingGames = 4
      return resolve(context);
    });
  }
};

// Setting up Wit bot
const wit = new Wit({
  accessToken: config.WIT_TOKEN,
  actions: actions,
  logger: new log.Logger(log.INFO)
});

function sendConversationMessage(message, sender, context) {
	// Setting up Wit bot
	if (!context) {
		context = {};
	}
	send.typingIndicator(sender, true);
	wit.converse(sender, message, context)
	.then((context) => {
	  console.log('Yay, got Wit.ai response: ' + JSON.stringify(context));
	  if (context.type == 'msg' && context.msg) {
	  	console.log(1);
      console.log('Sender is ' + sender);
      send.text(sender, context.msg);
      console.log(2);
      sendConversationMessage(message, sender, context);
      console.log(3);
    } else if (context.type == 'action' && context.action) {
    	console.log(4);
      if (context.action == 'countUpcomingGames') {
      	console.log(5);
        console.log('Context action with countUpcomingGames');
        context.numUpcomingGames = 4;
        console.log(6);
        sendConversationMessage(message, sender, context);
        console.log(7);
      }
    } else if (context.type == 'stop') {
    	console.log(8);
	  	send.typingIndicator(sender, false);
	  	console.log(9);
	  } else {
	  	console.log(10);
	  	send.typingIndicator(sender, false);
	  	console.log(11);
	  }
	  console.log(12);
	})
	.catch((error) => {
		console.log('Error with wit.converse', error);
		callback(null, error);
	});
}

module.exports = {
  sendConversationMessage: sendConversationMessage
}