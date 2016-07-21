'use strict'

const request = require('request');
const M = require('./schemas.js');
const config = require('./../config');
const W = require('./wit.js');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN

function start(sender){

  let messageData = {
    "text":"Hey there! We at Kickabout are all about playing football. Sound Good?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Yep",
        "payload":"yep"
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
          console.log('Error in start(): ', error)
      } else if (response.body.error) {
          console.log('Error in start(): ', response.body.error)
      }
  })
}

function booked(sender, name, price, gameName, address, image_url, order_number){
  order_number = order_number;
  let messageData = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"receipt",
        "recipient_name": name,
        "currency":"GBP",
        "payment_method":"Stripe",
        "order_number": order_number,
        "elements":[
          {
            "title": gameName,
            "subtitle": address,
            "quantity":1,
            "price": price,
            "currency":"GBP",
            "image_url":image_url
          }
        ],
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
          message: messageData,
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

function processReceivedMessage(sender, message) {
  W.sendConversationMessage(sender, message);
}

function text(sender, text) {
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
      if (error) {
          console.log('Error sending text messages: ', error)
      } else if (response.body.error) {
          console.log('Error sending text messages: ', response.body.error)
      }
  })
}

function textWithQuickReplies(sender, text, quickReplies) {
    let messageData = {
      text: text,
      quick_replies: quickReplies
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
    })
}

function play(sender) {
    let messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "When do you want to play?",
          "buttons": [
            {
              "type": "postback",
              "title": "Today",
              "payload": "Today"
            },
            {
              "type": "postback",
              "title": "Tomorrow",
              "payload": "Tomorrow"
            },
            {
              "type": "postback",
              "title": "Soon",
              "payload": "Soon"
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
            console.log('Error sending play message: ', error)
        } else if (response.body.error) {
            console.log('Error sending play message: ', response.body.error)
        }
    })
}

function cards(sender, data, message){

  if(message === undefined){
    text(sender, "Here are some upcoming games to join. Tap the card for directions or 'More Info' to book.");
  }
  else {
    text(sender, message);
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
  })
}

function directions(sender, name, address, latlong){

  return new Promise(function(resolve, reject){
    let image_link = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlong +
                        "&zoom=15&size=300x300&markers=" + latlong

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
                    }],
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

  console.log("card for booking");
  console.log(booked);

  let temp = {
    "type": "postback",
    "title": "BOOK",
    "payload": "Book" + "|" + gameId,
  }

  if(booked === true){
    console.log("booked is true");
    temp = {
      "type": "postback",
      "title": "Cancel Booking",
      "payload": "Cancel" + "|" + gameId,
    }
  }

  else if(parseFloat(price) > 0){
    temp = {
      "type": "web_url",
      "title": "BOOK",
      "url": "limitless-sierra-68694.herokuapp.com/payment" + "?mid=" + sender + "&gid=" + gameId,
    }
  }

  let messageData = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                          "template_type": "button",
                          "text": description,
                          "buttons": [
                              temp,
                              {
                                  "type": "postback",
                                  "title": "Keep Looking",
                                  "payload": "No, thanks",
                              }
                            ],
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

  M.Game.find({when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}, function(err, result){

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

function yep(sender){
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

function book(sender, rest){
  M.Button.update({name:"Book"},
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
      M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: sender}}}, function(){
        booked_for_free_games(sender);
      });
    }
  })
}

function cancel_booking(sender, rest){
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

function more_info(sender, text){
  M.Button.update({name:"More Info"},
    {$push: {activity: {userId:sender, time: new Date()}}},
    {upsert: true},
    function(err){
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
      console.log(now);
      if(item.when > now){
        text(sender, "Here is your game: ");
        let booked = false;
        let join = item.joined;

        join.forEach(function(i){
          if(i.userId === sender){
            booked = true;
          }
        });
        data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked, item.desc, item.when, item.price]);
        data = generate_card(data);
        cards(sender, data);
      }
      else {
        text(sender, "That game has finished")
      }
    }
  })
}

function my_games(sender){
  let now = new Date();

  M.Game.find({when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}, function(err, result){

    let data = [];
    result.forEach(function(item){
      let join = item.joined;

      join.forEach(function(i){
        if(i.userId === sender){
          data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length + item.non_members_attending, item.capacity, true, item.desc, item.when, item.price]);
        }
      });
    })

    console.log("inside my games");
    console.log(data);

    if(data === []){
      text(sender, "You haven't joined any games. Type 'play' to find games")
    }
    else {
      data = generate_card(data);
      cards(sender, data, "Here are the games you've joined: ");
    }
  })
}

function publicLink(sender, optin){
  let arr = optin.split('facebook');
  let gameId = arr[0];
  let facebookID = arr[1];
  M.User.find({userId:sender}, function(err, result){
    if(result.length > 0){
      game(sender, gameId);
      M.User.findOneAndUpdate({userId:sender}, {facebookID:facebookID}, function(err, res){
        if(err){
          console.log(err);
        }
      })
    }
    else {
      M.Button.update({name:"Yep"},
        {$push: {activity: {userId:sender, time: new Date()}}},
        {upsert: true},
        function(err){
          console.log(err);
        })
      var get_url = "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;
      request(get_url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

            let user = M.User({
              userId: sender,
              facebookID: facebookID,
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
              }
            })
          }
      });
    }
  })
}

module.exports = {
  start: start,
  booked: booked,
  processReceivedMessage: processReceivedMessage,
  text: text,
  game: game,
  play: play,
  cards: cards,
  allGames: allGames,
  my_games: my_games,
  yep: yep,
  book: book,
  cancel_booking: cancel_booking,
  more_info: more_info,
  publicLink: publicLink
}
