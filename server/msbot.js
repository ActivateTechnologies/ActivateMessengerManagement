'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const sendNew = require('./sendnew.js');

const builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: config.MS_BOT_APP_ID,
    appPassword: config.MS_BOT_PASSWORD
});
server.post('/api/messages', connector.listen());

//var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v1/application?id=0a8ae437-0ff1-44c4-af7c-cc94fd0baf11&subscription-key=a87263ffb22f4feb9a89aea610608ca7&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.matches('ShowGames', [
  function (session, args, next) {
  	console.log('Args:', JSON.stringify(args));
    // Resolve and store any entities passed from LUIS.
    var time = getTime(args);
    session.send('Going to show you games for', JSON.stringify(time));
    
    /*var time = builder.EntityRecognizer.resolveTime(args.entities);
	    var alarm = session.dialogData.alarm = {
	      title: title ? title.entity : null,
	      timestamp: time ? time.getTime() : null  
	    };*/

	    // Prompt for title
	    /*if (!alarm.title) {
	        builder.Prompts.text(session, 'What would you like to call your alarm?');
	    } else {
	        next();
	    }
	  */
  }
]);

dialog.matches('MyGames', [
  function (session, args, next) {
  	console.log('Args:', JSON.stringify(args));
    
    var time = getTime(args);
    session.send('Going to show you your games for', JSON.stringify(time));
  }
]);

dialog.matches('Greeting', [
  function (session, args, next) {
  	console.log('Args:', JSON.stringify(args));

    session.send(session.message.text + ' to you too!')
  }
]);

function getTime(args) {
	if (args.entities.length && args.entities[0].type == 'builtin.datetime.time') {
  	var time = builder.EntityRecognizer.recognizeTime(args.entities[0].entity);
  	if (time.resolution && time.resolution.start) {
    	console.log('time.getTime()', new Date(time.resolution.start));
    	return new Date(time.resolution.start)
    }
  }
  return null;
}

module.exports = {
  
}