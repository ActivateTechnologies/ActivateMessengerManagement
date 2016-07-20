'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const send = require('./send.js');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN

const Wit = require('node-wit').Wit;
const log = require('node-wit').log;

/*let Wit = null;
let log = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  log = require('../').log;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
}*/

// Wit actions
const actions = {
  send(request, response) {
  	const sessionId = request.sessionId;
  	const context = request.context;
  	const entities = request.entities;

  	const text = response.text;
  	const quickreplies = response.quickreplies;

    console.log('actions.send() called');
    /*// Our bot has something to say!
	    // Let's retrieve the Facebook user whose session belongs to
	    const recipientId = sessions[sessionId].fbid;
	    if (recipientId) {
	      // Yay, we found our recipient!
	      // Let's forward our bot response to her.
	      // We return a promise to let our bot know when we're done sending
	      return fbMessage(recipientId, text)
	      .then(() => null)
	      .catch((err) => {
	        console.error(
	          'Oops! An error occurred while forwarding the response to',
	          recipientId,
	          ':',
	          err.stack || err
	        );
	      });
	    } else {
	      console.error('Oops! Couldn\'t find user for session:', sessionId);
	      // Giving the wheel back to our bot
	      return Promise.resolve()
	    }*/
  },
  countUpcomingGames(request, response) {
  	const sessionId = request.sessionId;
  	const context = request.context;
  	const entities = request.entities;

  	const text = response.text;
  	const quickreplies = response.quickreplies;

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
      console.log('Sender is ' + sender);
      send.text(sender, context.msg);
      sendConversationMessage(message, sender, context);
    } else if (context.type == 'action' && context.action) {
      if (context.action == 'countUpcomingGames') {
        console.log('Context action with countUpcomingGames');
        context.numUpcomingGames = 4;
        sendConversationMessage(message, sender, context);
      }
    } else if (context.type == 'stop') {
	  	send.typingIndicator(sender, false);
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