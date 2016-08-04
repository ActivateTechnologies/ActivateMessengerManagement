'use strict'

const request = require('request');
const M = require('./schemas.js');
const config = require('./../config');
const W = require('./wit.js');
const L = require('./luis.js');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN

// function start(sender){
//
//   let messageData = {
//     "text":"Hey there! We at Kickabout are all about playing football. Sound Good?",
//     "quick_replies":[
//       {
//         "content_type":"text",
//         "title":"Yep",
//         "payload":"yep"
//       }
//     ]
//   }
//
//
//   request({
//       url: 'https://graph.facebook.com/v2.6/me/messages',
//       qs: {access_token:VERIFICATION_TOKEN},
//       method: 'POST',
//       json: {
//           recipient: {id:sender},
//           message: messageData,
//       }
//   }, function(error, response, body) {
//       if (error) {
//           console.log('Error in start(): ', error)
//       } else if (response.body.error) {
//           console.log('Error in start(): ', response.body.error)
//       }
//   })
// }

function start_with_phoneNumber(phoneNumber, gameId){
  return new Promise(function(resolve, reject){
    let messageData = {
      "text":"Hey there! We at Kickabout are all about playing football. Sound Good?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Yep",
          "payload":("phoneNumber|" + phoneNumber + "|" + gameId)
        }
      ]
    }


    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:VERIFICATION_TOKEN},
        method: 'POST',
        json: {
            recipient: {phone_number:phoneNumber},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error in start(): ', error)
            reject(error);
        }
        else if (response.body.error) {
            console.log('Error in start(): ', response.body.error)
            reject(error);
        }
        else {
          resolve();
        }

    })
  })
}

function booked_with_phoneNumber(phoneNumber, name, price, gameName, address, image_url, order_number){
  return new Promise(function(resolve, reject){
    let messageData = {
      "attachment": {
        "type":"template",
        "payload": {
          "template_type": "receipt",
          "recipient_name": name,
          "currency": "GBP",
          "payment_method": "Stripe",
          "order_number": order_number,
          "elements":[{
            "title": gameName,
            "subtitle": address,
            "quantity": 1,
            "price": price,
            "currency":"GBP",
            "image_url":image_url
          }],
          "summary":{
            "total_cost":price
          }
        }
      }
    }

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
        recipient: {phone_number:phoneNumber},
        message: messageData
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending booked message: ', error)
        reject(err);
      }
      else if (response.body.error) {
        console.log('Error sending booked message: ', response.body.error)
        reject(err)
      }
      else {
        resolve();
      }
    })
  })
}

function text_with_phoneNumber(phoneNumber, text) {
  return new Promise(function(resolve, reject){
    let messageData = { text: text }

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
        recipient: {phone_number:phoneNumber},
        message: messageData
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending text messages: ', error)
        reject(err);
      } else if (response.body.error) {
        console.log('Error sending text messages: ', response.body.error)
        reject(err);
      } else {
        resolve();
      }
    })
  })
}

function register_user(sender, phoneNumber, gameId) {
  var get_url = "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;
  request(get_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);

        let user = M.User({
          userId: sender,
          phoneNumber: phoneNumber,
          firstname: body.first_name,
          lastname: body.last_name,
          profile_pic: body.profile_pic,
          locale: body.locale,
          gender: body.gender
        })

        user.save(function(err){
          if(err){
            console.log(err);
          } else {
            game(sender, gameId);
            console.log("saved user");
          }
        })
      }
  })
}

function menu(sender){

  let messageData = {
    "text":"Hi there, what do you want to do?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Show Games",
        "payload":"show games"
      },
      {
        "content_type":"text",
        "title":"My Games",
        "payload":"my games"
      },
      {
        "content_type":"text",
        "title":"Notifications",
        "payload":"notifications"
      }
    ]
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
      console.log('Error in menu(): ', error)
    } else if (response.body.error) {
      console.log('Error in menu(): ', response.body.error)
    }
  })
}

function notifications(sender){

  let messageData = {
    "text":"Do you want to receive weekly game updates?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Yes",
        "payload":"notifications on"
      },
      {
        "content_type":"text",
        "title":"No",
        "payload":"notifications off"
      }
    ]
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error in notifications(): ', error)
    } else if (response.body.error) {
      console.log('Error in notifications(): ', response.body.error)
    }
  })
}

function notifications_change(sender, set){
  M.User.update({userId:sender}, {notifications: set}, function(err){
    if (err) {
      console.log(err);
    }
    if (set === "on") {
      text(sender, "You will receive weekly notifications");
    } else {
      text(sender, "You won't receive weekly notifications");
    }
  })
}

function booked(sender, name, price, gameName, address, image_url, order_number){
  order_number = order_number;
  let messageData = {
    "attachment": {
      "type":"template",
      "payload": {
        "template_type": "receipt",
        "recipient_name": name,
        "currency": "GBP",
        "payment_method": "Stripe",
        "order_number": order_number,
        "elements":[{
          "title": gameName,
          "subtitle": address,
          "quantity": 1,
          "price": price,
          "currency":"GBP",
          "image_url":image_url
        }],
        "summary":{
          "total_cost":price
        }
      }
    }
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending booked message: ', error)
    } else if (response.body.error) {
      console.log('Error sending booked message: ', response.body.error)
    }
  })
}

function booked_for_free_games(sender){
  let messageData = {
    "text":"Thanks for booking. Do you want to continue looking?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Yes",
        "payload":"continue"
      }
    ]
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
      console.log('Error sending booked free message: ', error)
    } else if (response.body.error) {
      console.log('Error sending booked free message: ', response.body.error)
    }
  })
}

function processReceivedMessage(sender, message, defaultCallback) {
  //W.sendConversationMessage(sender, message);
  L.processTextMessage(sender, message, defaultCallback);
}

function text_promise(sender, text){
  return new Promise(function(resolve, reject){
    let messageData = { text: text }

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending text messages: ', error)
        reject(err);
      } else if (response.body.error) {
        console.log('Error sending text messages: ', response.body.error)
        reject(err);
      } else {
        resolve();
      }
    })
  })
}

function text(sender, text) {
  let messageData = { text: text }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending text messages: ', error)
    } else if (response.body.error) {
      console.log('Error sending text messages: ', response.body.error)
    }
  })
}

function cards(sender, data, message){

  if (message === undefined) {
    text(sender, "Here are some upcoming games to join. "
     + "Tap the card for directions or 'More Info' to book.");
  } else {
    text(sender, message);
  }

  let messageData = data;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending cards: ', error)
    } else if (response.body.error) {
      console.log('Error sending cards: ', response.body.error)
    }
  })
}

function directions(sender, name, address, latlong){

  return new Promise(function (resolve, reject) {
    let image_link = "https://maps.googleapis.com/maps/api/staticmap?center="
      + latlong + "&zoom=15&size=300x300&markers=" + latlong;

    let directions_link = "http://maps.google.com/?q=" + address

    let messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": name,
              "image_url": image_link,
              "item_url": directions_link,
              "buttons": [{
                "type": "web_url",
                "title": "Directions",
                "url": directions_link,
              }]
            }
          ]
        }
      }
    }

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending directinos: ', error)
        reject(err);
      } else if (response.body.error) {
        console.log('Error sending directinos: ', response.body.error);
        reject(err);
      } else {
        resolve("success");
      }
    })
  })
}

function shareGame(sender, text){

  let gid = text.split("|")[1];

  M.Game.find({_id:gid}, function(err, results){
    if (results.length > 0) {
      let game = results[0];
      let publicLink = "http://localhost:3000/game?gid=" + gid;
      let description = game.when.toString().substring(0, 10)
       + " | " + game.address;
      let numAttending = game.non_members_attending + game.joined.length;
      if (numAttending > 0){
        description = description + " | " + numAttending + " attending";
      }

      let messageData = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": game.name,
                "subtitle": description,
                "image_url": game.image_url,
                "item_url": game.publicLink,
                "buttons": [{
                  "type": "web_url",
                  "title": "More Info",
                  "url": publicLink,
                }]
              }
            ]
          }
        }
      }
      text_promise(sender, "If you're on your phone, forward the following"
       + " message to a friend or group!").then(()=>{
        request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token:VERIFICATION_TOKEN},
          method: 'POST',
          json: {
            recipient: {id:sender},
            message: messageData
          }
        }, function(error, response, body) {
          let errorObject = (error) ? error : response.body.error;
          if (errorObject) {
            console.log('Error sending share card: ', errorObject)
          }
        })
      }).catch((e)=>{
        console.log('Error sending text, ' + e);
      });

    }
  })
}

function generate_card_element(name, address, image_url, latlong, gameId, attending, capacity, booked, description, when, price){

  let pl = "More Info" + "|" + name + "|" + address + "|" + latlong + "|" + gameId + "|" + description + "|" + price + "|" + booked;

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
  }
  else {

    let template = {
      "title": name,
      "subtitle": address,
      "image_url": image_url,
      "item_url": directions_link,
      "buttons": [{
          "type": "postback",
          "title": "More Info",
          "payload": pl,
      }],
    }

    return template;
  }
}

function card_for_booking(sender, gameId, description, price, booked){

  let bookOrCancelButton = {}

  if (booked === "true") {
    bookOrCancelButton = {
      "type": "postback",
      "title": "Cancel Booking",
      "payload": "Cancel" + "|" + gameId
    }
  } else if (parseFloat(price) > 0) {
    bookOrCancelButton = {
      "type": "web_url",
      "title": "BOOK",
      "url": "limitless-sierra-68694.herokuapp.com/payment"
        + "?mid=" + sender + "&gid=" + gameId
    }
  } else {
    bookOrCancelButton = {
      "type": "postback",
      "title": "BOOK",
      "payload": "Book" + "|" + gameId
    }
  }

  let messageData = {
    "attachment": {
    "type": "template",
    "payload": {
      "template_type": "button",
      "text": description,
      "buttons": [
          bookOrCancelButton, {
            "type": "postback",
            "title": "Keep Looking",
            "payload": "No, thanks",
          }, {
            "type": "postback",
            "title": "Share",
            "payload": "Share" + "|" + gameId
          }
        ]
      }
    }
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
      console.log('Error sending cards: ', error)
    } else if (response.body.error) {
      console.log('Error sending cards: ', response.body.error)
    }
  })
}

function generate_card(array){
  let elements = [];
  array.forEach(function(item){
    //name, address, image_url, latlong, gameId, attending, capacity, booked, description, when, price
    elements.push(generate_card_element(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10]));
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

function allGames(sender, broadcast){
  let now = new Date();
  let query = {when:
    {$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}

  M.Game.find(query).sort('when').exec(function(err, result){

    let data = [];
    result.forEach(function(item){
      let booked = false;
      let join = item.joined;
      join.forEach(function(i){
        if(i.userId === sender){
          booked = true;
        }
      });
      data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length + item.non_members_attending, item.capacity, booked, item.desc, item.when, item.price]);
    })

    data = generate_card(data);
    if(broadcast === undefined){
      cards(sender, data);
    }
    else {
      cards(sender, data, broadcast);
    }
  })
}

function yep (sender) {
  M.Button.update({name:"Yep"},
    {$push: {activity: {userId:sender, time: new Date()}}},
    {upsert: true},
    function(err){
      console.log(err);
    })
  M.User.find({userId:sender}, function(err, result){
    if (err) {
      console.log(err);
    }
    if(result.length > 0){
      console.log("User is already registered");
      allGames(sender);
    }
    else {
      var get_url = "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;
      request(get_url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

            let user = M.User({
              userId: sender,
              firstname: body.first_name,
              lastname: body.last_name,
              profile_pic: body.profile_pic,
              locale: body.locale,
              gender: body.gender
            })
            user.save(function(err){
              if(err){
                console.log(err);
              } else {
                allGames(sender);
              }
            })
          }
      });
    }
  })
}

function book (sender, rest) {

  let arr = rest.split('|');
  let gameId = arr[1];

  /*
    //This was here only for testing purposes
    M.Button.update({name:"Book"},
    {$push: {activity: {userId:sender, time: new Date()}}},
    {upsert: true},
    function(err){
      console.log(err);
    })
  */

  M.Button.update({name:"Payments"},{$push: {
    activity: {
      userId: sender,
      time: new Date(),
      gid: gameId,
      amount: 10
    }
  }}, {upsert: true}, (err) => {
    console.log(err);
  });

  M.Game.find({_id:gameId}, function(err, result){
    let check = true;
    if(result.length > 0){
      M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: sender}}}, function(){
        booked_for_free_games(sender);
      });
    }
  })
}

function cancel_booking (sender, rest) {
  M.Button.update({name:"Cancel"},
    {$push: {activity: {userId:sender, time: new Date()}}},
    {upsert: true},
    function(err){
      console.log(err);
    })

  let arr = rest.split('|');
  let gameId = arr[1];

  M.Game.find({_id:gameId}, function(err, result){
    let check = true;
    if(result.length > 0){
      M.Game.findOneAndUpdate({_id:gameId}, {$pull: {joined: {userId: sender}}}, function(){
        text(sender, "Your booking has been cancelled");
      });
    }
  })
}

function more_info (sender, text) {
  M.Button.update({name:"More Info"},
    {$push: {activity: {userId:sender, time: new Date()}}},
    {upsert: true},
    function (err) {
      console.log(err);
    })

  let arr = text.split('|');
  let name = arr[1];
  let address = arr[2];
  let latlong = arr[3];
  let gameId = arr[4];
  let description = arr[5];
  let price = arr[6];
  let booked = arr[7]

  directions(sender, name, address, latlong)
  .then(function(success){
    card_for_booking(sender, gameId, description, price, booked);
  })
  .catch(function(err){
    console.log(err);
  })
}

function game(sender, gameId){
  M.Game.find({_id:gameId}, function(err, result){
    if(result.length > 0){
      let data = [];
      let item = result[0];
      let now = new Date();
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
      if(item.when > now){
        let booked = false;
        let join = item.joined;

        join.forEach(function(i){
          if(i.userId === sender){
            booked = true;
          }
        });
        data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked, item.desc, item.when, item.price]);
        data = generate_card(data);
        cards(sender, data, "Here is your game: ");
      }
      else {
        text(sender, "That game has finished")
      }
    }
  })
}

function my_games(sender){
  let now = new Date();
  let query = {when:{
    $gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}};

  M.Game.find(query).sort('when').exec(function(err, result){

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
      text_promise(sender, "You haven't joined any games.")
      .then(()=>{
        allGames(sender);
      })
      .catch((e)=>{
        console.log(e);
      })
    }
    else {
      data = generate_card(data);
      cards(sender, data, "Here are the games you've joined: ");
    }
  })
}

function start(sender){

  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Hey there! We at Kickabout are all about playing football. Sound Good?",
          "image_url": "https://limitless-sierra-68694.herokuapp.com/img/logo.png",
          "buttons": [{
            "title": "Login",
            "type": "web_url",
            "url": ( config.ROOT_URL + "/register?mid=" + sender)
          }]
        }]
      }
    }
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
      console.log('Error in start(): ', error)
    } else if (response.body.error) {
      console.log('Error in start(): ', response.body.error)
    }
  })
}

function start2(sender){

  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "Hey there! We've implemented a login system'",
          "image_url": "https://limitless-sierra-68694.herokuapp.com/img/logo.png",
          "buttons": [{
            "title": "Login",
            "type": "web_url",
            "url": ( config.ROOT_URL + "/register?mid=" + sender)
          }]
        }]
      }
    }
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
      console.log('Error in start(): ', error)
    } else if (response.body.error) {
      console.log('Error in start(): ', response.body.error)
    }
  })
}

module.exports = {
  start: start,
  start2: start2,
  start_with_phoneNumber: start_with_phoneNumber,
  text_with_phoneNumber: text_with_phoneNumber,
  booked_with_phoneNumber: booked_with_phoneNumber,
  register_user: register_user,
  menu: menu,
  notifications: notifications,
  notifications_change: notifications_change,
  booked: booked,
  processReceivedMessage: processReceivedMessage,
  text: text,
  text_promise: text_promise,
  game: game,
  cards: cards,
  allGames: allGames,
  my_games: my_games,
  yep: yep,
  book: book,
  cancel_booking: cancel_booking,
  more_info: more_info,
  shareGame: shareGame
}
