'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
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
  send: function (request, response) {
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
  countUpcomingGames: function (request) {
  	const sessionId = request.sessionId;
  	const context = request.context;
  	const entities = request.entities;

  	const text = response.text;
  	const quickreplies = response.quickreplies;

		console.log('actions.countUpcomingGames() called');
  }
};

// Setting up Wit bot
const wit = new Wit({
  accessToken: config.WIT_TOKEN,
  actions: actions,
  logger: new log.Logger(log.INFO)
});

function sendConversationMessage(message, sender) {
	// Setting up Wit bot
	wit.converse(sender, message, {})
	.then((data) => {
	  console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
	})
	.catch(console.error);
}

module.exports = {
  sendConversationMessage: sendConversationMessage
}