'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const sendNew = require('./sendnew.js');

const INTENT_THRESHHOLD = 0.2;

function processTextMessage(sender, message, defaultCallback) {
	sendNew.typingIndicator(sender, true);
	postToLuis(message, (body) => {
		sendNew.typingIndicator(sender, false);
		let data = JSON.parse(body);
		let firstIntent = data.intents[0];
		//let time = getTimeEntity(data.entities);
		//let time = resolveTime(data.entities);
		//console.log('LUIS first intent', firstIntent);
		if (firstIntent.score > INTENT_THRESHHOLD) {
			switch(firstIntent.intent) {
	      case("Greeting"):
	      processGreetings(sender, firstIntent);
	      break;

	      case("Help"):
	      processHelp(sender, firstIntent);
	      break;

	      case("ShowGames"):
	      processShowGames(sender, firstIntent, 
	      	getDateQuery(resolveTime(data.entities)));
	      break;

	      case("MyGames"):
	      processMyGames(sender, firstIntent, 
	      	getDateQuery(resolveTime(data.entities)));
	      break;

	      default:
	      defaultCallback();
	    }
		} else {
			defaultCallback();
		}
	});
}

function getDateQuery (dateObject) {
	if (dateObject) {
		let dates = {};
		dates.startDate = dateObject;
		dates.startDate = new Date(dates.startDate.getTime()
		 - (dates.startDate.getTime() % (86400 * 1000)) - 2 * 3600 * 1000);
		console.log('Start date: ' + dates.startDate);
		/*if (entities.datetime[0].grain == 'day') {*/
			dates.endDate = new Date(dates.startDate.getTime() + 86400 * 1000
			 + 2 * 3600 * 1000);
		/*} else if (entities.datetime[0].grain == 'week') {
			dates.endDate = new Date(dates.startDate.getTime() + 86400 * 1000 * 7
			 + 2 * 3600 * 1000);
		}*/
		/*let now = new Date();
		let query = (Object.keys(dates).length) 
			? {when:{$gt: dates.startDate, $lt: dates.endDate}}
			: {when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}};*/

		console.log('Going to return query:', JSON.stringify(dates));
		return dates;
	} else {
		return null;
	}
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

function processGreetings(sender, intent) {
	sendNew.text(sender, 'Hello there!', (error) => {
		if (!error) {
			sendNew.textWithQuickReplies(sender, 'Looking for games to play?',
			  ['Sure thing!', 'Nah not now']);
		}
	});
}

function processHelp(sender, intent) {
	sendNew.text(sender, 'Sure, someone from our team will '
		+ 'get in touch with you soon', (error) => {
		if (!error) {
			sendNew.textWithQuickReplies(sender, 'Meanwhile looking for games to play?',
			  ['Sure thing!', 'Nah not now']);
		}
	});
}

function processShowGames(sender, intent, queryDates) {
	sendNew.text(sender, 'Sure thing. Here are some upcoming games:', () => {
		sendNew.allGames(sender, null, queryDates);
	});
}

function processMyGames(sender, intent, queryDates) {
	//sendNew.text(sender, 'Here are your games:');
	console.log(queryDates);
	sendNew.my_games(sender, queryDates);
}

/*
	Source: "https://github.com/Microsoft/BotBuilder/blob/master/Node"
		+ "/core/lib/dialogs/EntityRecognizer.js#L29"
*/
function resolveTime (entities) {
  let dateExpression = /^\d{4}-\d{2}-\d{2}/i;
  let now = new Date();
  let resolvedDate;
  let date;
  let time;
  entities.forEach(function (entity) {
    if (entity.resolution) {
      switch (entity.resolution.resolution_type || entity.type) {
        case 'builtin.datetime':
        case 'builtin.datetime.date':
        case 'builtin.datetime.time':
          let parts = (entity.resolution.date || entity.resolution.time).split('T');
          if (!date && dateExpression.test(parts[0])) {
            date = parts[0];
          }
          if (!time && parts[1]) {
            time = 'T' + parts[1];
            if (time == 'TMO') {
              time = 'T08:00:00';
            }
            else if (time == 'TNI') {
              time = 'T20:00:00';
            }
            else if (time.length == 3) {
              time = time + ':00:00';
            }
            else if (time.length == 6) {
              time = time + ':00';
            }
          }
          break;
        case 'chrono.duration':
          var duration = entity;
          resolvedDate = duration.resolution.start;
      }
    }
  });
  if (!resolvedDate && (date || time)) {
    if (!date) {
      date = utils.toDate8601(now);
    }
    if (time) {
      date += time;
    }
    resolvedDate = new Date(date);
  }
  return resolvedDate;
};

module.exports = {
  processTextMessage: processTextMessage
}