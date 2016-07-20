'use strict'

const request = require('request')
const M = require('./schemas.js')
const S = require('./send.js')
const config = require('./../config')

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
  countUpcomingGames(request/*, response*/) {
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
	console.log('Inside sendConversationMessage()');
	console.log(1);
	// Setting up Wit bot
	if (!context) {
		context = {};
	}
	console.log(2);
	//send.typingIndicator(sender, true);
	wit.converse(sender, message, context)
	.then((context) => {
		console.log(3);
	  console.log('Yay, got Wit.ai response: ' + JSON.stringify(context));
	  if (context.type == 'msg' && context.msg) {
	  	console.log(4);
      console.log('Sender is ' + sender);
      console.log(5);
      S.text(sender, context.msg);
      console.log(6);
      sendConversationMessage(message, sender, context);
      console.log(7);
    } else if (context.type == 'action' && context.action) {
    	console.log(8);
      if (context.action == 'countUpcomingGames') {
      	console.log(9);
        console.log('Context action with countUpcomingGames');
        context.numUpcomingGames = 4;
        console.log(10);
        //sendConversationMessage(message, sender, context);
        wit.converse(sender, message, context)
				.then((context) => {
					console.log('After count: ' + JSON.stringify(context));
				});
        console.log(11);
      }
    } else if (context.type == 'stop') {
    	console.log(12);
	  	//send.typingIndicator(sender, false);
	  }
	  console.log(13);
	})
	.catch((error) => {
		console.error(error);
		callback(null, error);
	});
}

module.exports = {
  sendConversationMessage: sendConversationMessage
}