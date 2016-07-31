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
	      processShowGames(sender, firstIntent, data.entities);
	      break;

	      case("MyGames"):
	      processMyGames(sender, firstIntent, data.entities);
	      break;

	      case("Feedback"):
	      processFeedback(sender, firstIntent, data.entities);
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
	console.log('getDateQuery called with', dateObject);
	if (dateObject && dateObject.date) {
		let dates = {};
		dates.startDate = dateObject.date;
		dates.startDate = new Date(dates.startDate.getTime()
		 - (dates.startDate.getTime() % (86400 * 1000)) - 2 * 3600 * 1000);
		dates.endDate = new Date(dates.startDate.getTime() 
		 + 86400 * 1000 * dateObject.durationInDays
		 + 2 * 3600 * 1000);
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
			sendNew.textWithQuickReplies(sender,
				'Meanwhile continue looking for games to play?',
			  ['Sure thing!', 'Nah not now']);
		}
	});
}

function processShowGames(sender, intent, entities) {
	let queryDates = getDateQuery(resolveTime(entities));
	let dateEntityText = (entities.length) ? entities[0].entity : null;
	sendNew.allGames(sender, null, queryDates, dateEntityText);
}

function processMyGames(sender, intent, entities) {
	let queryDates = getDateQuery(resolveTime(entities));
	let dateEntityText = (entities.length) ? entities[0].entity : null;
	console.log(intent, queryDates, dateEntityText);
	sendNew.my_games(sender, queryDates, dateEntityText);
}

function processFeedback(sender, intent, entities) {
	/*let queryDates = getDateQuery(resolveTime(entities));
	let dateEntityText = (entities.length) ? entities[0].entity : null;
	console.log(intent, queryDates, dateEntityText);
	sendNew.my_games(sender, queryDates, dateEntityText);*/
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
  let durationInDays = 1;
  entities.forEach(function (entity) {
    if (entity.resolution) {
      switch (entity.resolution.resolution_type || entity.type) {
        case 'builtin.datetime':
        case 'builtin.datetime.date':
        case 'builtin.datetime.time':
          let parts = (entity.resolution.date || entity.resolution.time).split('T');
          let weekParts = (entity.resolution.date || entity.resolution.time).split('-W');
          console.log('Parts', JSON.stringify(parts));
          if (!date && dateExpression.test(parts[0])) {
            date = parts[0];
          } else if (!date && weekParts.length > 1) {
          	date = getDateOfISOWeek(weekParts[0], weekParts[1]).toISOString().slice(0,10);
          	//console.log(date, getDateOfISOWeek(weekParts[0], weekParts[1]));
          	durationInDays = 7;
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
      date = toDate8601(now);
    }
    if (time) {
      date += time;
    }
    resolvedDate = new Date(date);
  }

  return {
  	date: resolvedDate,
  	durationInDays: durationInDays
  };

  function toDate8601(date) {
  	return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1)
		 + '-' + pad(date.getUTCDate());
	}

	function pad(num) {
    return (num < 10) ? '0' + num 
    	: '' + num;
	}

	//Source: http://stackoverflow.com/a/16591175/2015362
	function getDateOfISOWeek(y, w) {
    var simple = new Date(y, 0, 1 + (w - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
	}
};

module.exports = {
  processTextMessage: processTextMessage
}