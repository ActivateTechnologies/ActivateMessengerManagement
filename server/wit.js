'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const send = require('./send.js');
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

function sendConversationMessage(message, sender, context, callback) {
	// Setting up Wit bot
	if (!context) {
		context = {};
	}
	wit.converse(sender, message, context)
	.then((context) => {
	  console.log('Yay, got Wit.ai response: ' + JSON.stringify(context));
	  if (context.type == 'msg' && context.msg) {
      console.log('Sender is ' + sender);
      //typingIndicator(sender, false);
      console.log('send:::');
      console.log(send);
      send.text(sender, context.msg);
    } else if (context.type == 'action' && context.action) {
      if (context.action == 'countUpcomingGames') {
        console.log('Context action with countUpcomingGames');
      }
    }
	  if (context.type != 'stop') {
	  	sendConversationMessage(message, sender, context);
	  }
	})
	.catch((error) => {
		console.error(error);
		callback(null, error);
	});
}

module.exports = {
  sendConversationMessage: sendConversationMessage
}