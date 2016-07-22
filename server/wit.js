'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const sendNew = require('./sendnew.js');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN

const Wit = require('node-wit').Wit;
const log = require('node-wit').log;

// Wit actions
const actions = {
  send(request, response) {
  	const sessionId = request.sessionId;
  	const context = request.context;
  	const entities = request.entities;
    
    console.log('actions.send() called with text: ' + response.text);
		if (response.quickreplies) {
			console.log('Also includes quickreplies: ', response.quickreplies);
		}
    return new Promise(function(resolve, reject) {
    	if (response.quickreplies) {
    		sendNew.textWithQuickReplies(sessionId, response.text,
    		 response.quickreplies);
    	} else {
    		sendNew.text(sessionId, response.text);
    	}
      return resolve();
    });
  },
  countUpcomingGames(request) {
  	const sessionId = request.sessionId;
  	const context = request.context;

		console.log('countUpcomingGames() called with sessionId: ' + sessionId
			+ ' and entities: ' + JSON.stringify(request.entities));
		return new Promise(function(resolve, reject) {
			getCountUpcomingGames(request.entities, (numGames, dates, error) => {
				if (!error) {
					context.numUpcomingGames = numGames;
					context.queryDates = JSON.stringify(dates);
					return resolve(context);
				} else {
					console.log('Error trying to get games:', error.message);
					context.numUpcomingGames = 0;
					return resolve(context);
				}
			});
    });
  },
  showUpcomingGames(request) {
  	const sessionId = request.sessionId;
  	const context = request.context;

  	console.log('showUpcomingGames() called');
  	sendNew.allGames(sessionId, null, JSON.parse(request.context.queryDates));
  	return new Promise(function(resolve, reject) {
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

function sendConversationMessage(sender, message, context) {
	// Setting up Wit bot
	if (!context) {
		context = {};
	}
	//console.log('sendConversationMessage context: ' + JSON.stringify(context));
	sendNew.typingIndicator(sender, true);
	return wit.runActions(sender, message, context)
	.then((context) => {
	  //console.log('Yay, got Wit.ai response: ' + JSON.stringify(context));
	  sendNew.typingIndicator(sender, false);
	  /*if (context.type == 'msg' && context.msg) {
      console.log('Wit response type msg');
      sendNew.text(sender, context.msg);
      //sendConversationMessage(message, sender, context);
    } else if (context.type == 'action' && context.action) {
    	console.log('Wit response type action');
      if (context.action == 'countUpcomingGames') {
        console.log('Wit action type countUpcomingGames');
        context.numUpcomingGames = 4;
        return sendConversationMessage(sender, null, context);
      }
    } else if (context.type == 'stop') {
	  	sendNew.typingIndicator(sender, false);
	  } else {
	  	sendNew.typingIndicator(sender, false);
	  }*/
	}, (error) => {
		console.log('Error with wit.ai runActions', error)
	})
	/*.catch((error) => {
			console.log('Error with wit.converse', error);
		});*/
}

function getCountUpcomingGames(entities, callback) {
	let dates = {};
	if (entities.datetime && entities.datetime.length) {
		console.log(entities.datetime[0].value);
		dates.startDate = new Date(entities.datetime[0].value);
		dates.startDate = new Date(dates.startDate.getTime()
		 - (dates.startDate.getTime() % (86400 * 1000)) - 2 * 3600 * 1000);
		console.log('Start date: ' + dates.startDate);
		if (entities.datetime[0].grain == 'day') {
			dates.endDate = new Date(dates.startDate.getTime() + 86400 * 1000
			 + 2 * 3600 * 1000);
		} else if (entities.datetime[0].grain == 'week') {
			dates.endDate = new Date(dates.startDate.getTime() + 86400 * 1000 * 7
			 + 2 * 3600 * 1000);
		}
	}
	let query = (Object.keys(dates).length) 
		? {when:{$gt: dates.startDate, $lt: dates.endDate}} : {};
	console.log('Dates are: ', dates, ' and query is ', query);
	M.Game.find(query, function(error, games){
    if (error) {
      callback(0, null, error);
    } else {
    	console.log('Number of games found: ' + games);
      (games) ? callback(games.length, dates) : callback(0, null);
    }
  });
}

module.exports = {
  sendConversationMessage: sendConversationMessage
}