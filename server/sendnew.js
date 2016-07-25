'use strict'

const request = require('request');
const M = require('./schemas.js');
const config = require('./../config');
const W = require('./wit.js');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN

function text(sender, text, callback) {
  let messageData = { text: text }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
        recipient: {id:sender},
        message: messageData,
    }
  }, function(error, response, body) {
		let errorObject = (error) ? error : response.body.error;
    if (errorObject) {
      console.log('Error sending messages (to user ' 
      	+ sender + '): ', errorObject);
    }
    (callback) ? ((errorObject) ? callback(errorObject) : callback()) : null;
  });
}

function textWithQuickReplies(sender, text, quickReplies) {
	let quickRepliesObjects = [];
	quickReplies.forEach((textString) => {
		quickRepliesObjects.push({
      "content_type":"text",
      "title":textString,
      "payload":"staticTempPayLoad~" + textString
    });
	});

  let messageData = {
    text: text,
    quick_replies: quickRepliesObjects
  }

  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error sending messages: ', response.body.error)
      }
  });
}

function typingIndicator(sender, onOrOff) {
  let typingStatus = (onOrOff) ? 'typing_on' : 'typing_off';
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
        recipient: {id:sender},
        sender_action: typingStatus
    }
  }, function(error, response, body) {
  	let errorObject = (error) ? error : response.body.error;
    if (errorObject) {
      console.log('Error setting typing indicator (for sender: ' 
      	+ sender + '): ', errorObject);
    }
  })
}

function allGames(sender, broadcast, queryDates){
  let temp = "today"
  if(text){
    temp = broadcast;
  }
  let now = new Date();
  let query = (queryDates) ? 
  	{when:{$gt: queryDates.startDate, $lt: queryDates.endDate}}
  	: {when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}
  console.log('Query: ' + JSON.stringify(query));
  M.Game.find(query, function(err, games) {
    let data = [];
    if (games) {
    	games.forEach(function(item) {
	      let booked = false;
	      let join = item.joined;
	      join.forEach(function (i) {
	        if(i.userId === sender){
	          booked = true;
	        }
	      });
	      data.push([item.name, item.address, item.image_url, item.latlong, item._id,
	       item.joined.length + item.non_members_attending, item.capacity, booked,
	       item.desc, item.when, item.price]);
	  	});
	  	console.log(data);
	  	if (data.length) {
	  		data = generate_card(data);
	    	cards(sender, data, temp);
	  	} else {
	  		textWithQuickReplies(sender, "Sadly there are no upcoming games currently. "
	  			+ "Would you like to be notified when the next one is created?",
	  			["Yes! (not coded)", "No thanks"]);
	  	}
	    
    }
  })
}

function my_games(sender, queryDates){
  let now = new Date();
  let query = (queryDates) ? 
  	{when:{$gt: queryDates.startDate, $lt: queryDates.endDate}}
  	: {when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}
  M.Game.find(query, function(err, result){
    let data = [];
    result.forEach(function(item){
      let join = item.joined;

      join.forEach(function(i){
        if(i.userId === sender){
          data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length + item.non_members_attending, item.capacity, true, item.desc, item.when, item.price]);
        }
      });
    })

    //console.log(data);

    if (data.length === 0) {
      text(sender, "You haven't joined any games. Type 'play' to find games")
    } else {
      data = generate_card(data);
      cards(sender, data, "Here are the games you've joined: ");
    }
  });
}

function generate_card(array){
  let elements = [];
  array.forEach(function(item){
    //name, address, image_url, latlong, gameId,
    //attending, capacity, booked, description, when, price
    elements.push(generate_card_element(item[0], item[1], item[2], item[3], item[4],
     item[5], item[6], item[7], item[8], item[9], item[10]));
  });

  var template = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": elements
      }
    }
  }

  return template;
}

function cards(sender, data, day){

  if (day === "today") {
    text(sender, "(sendnew) Here are some upcoming games to join. "
    	+ "Tap the card for directions or 'More Info' to book.");
  }
  else if (day) {
    text(sender, day);
  }

  let messageData = data;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
        recipient: {id:sender},
        message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
        console.log('Error sending cards: ', error)
    } else if (response.body.error) {
        console.log('Error sending cards: ', response.body.error)
    }
  });
}

function generate_card_element(name, address, image_url, latlong, gameId, 
 attending, capacity, booked, description, when, price){
  let pl = "More Info" + "|" + name + "|" + address + "|" + latlong 
  	+ "|" + gameId + "|" + description + "|" + price + "|" + booked;
  let directions_link = "http://maps.google.com/?q=" + address;
  if (attending > 0){
    address = address + " (" + attending + " attending)";
  }
  address = when.toString().substring(0, 10) + "\n" + address;
  if(booked){
    address = address + " (You're going)";
  }
  if(attending == capacity){
    if(attending == capacity){
      address = address + " (fully booked)";
    }
    let template = {
      "title": name,
      "subtitle": address,
      "image_url": image_url,
      "item_url": directions_link,
    }
    return template;
  } else {
    let template = {
      "title": name,
      "subtitle": address,
      "image_url": image_url,
      "item_url": directions_link,
      "buttons": [{
        "type": "postback",
        "title": "More Info",
        "payload": pl,
      }]
    }
    return template;
  }
}

module.exports = {
  text: text,
  typingIndicator: typingIndicator,
  textWithQuickReplies: textWithQuickReplies,
  allGames: allGames,
  my_games: my_games
}
