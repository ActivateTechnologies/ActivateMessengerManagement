'use strict'

const request = require('request')
const M = require('./schemas.js')

// Kicabout
// const VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD"

// test app
const VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD"

function start(sender){
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "Hey there! We at Kickabout are all about playing football. Sound Good?",
        "buttons": [
          {
            "type": "postback",
            "title": "Yep",
            "payload": "yep"
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
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

function booked(sender){
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "Thanks for booking. Do you want to continue looking?",
        "buttons": [
          {
            "type": "postback",
            "title": "Yes",
            "payload": "continue"
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
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
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
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
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
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function cards(sender, data, day){

  // if(day){
  //   text(sender, "Awesome, here are my options for " + day + ". Tap the card to get directions.");
  // }

  if(day){
    text(sender, "Here are some upcoming games to join. Tap the card for directions or 'More Info' to book.");
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
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
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
            console.log('Error sending messages: ', error)
            reject(err);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
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

function generate_card_for_booking(sender, gameId, description, price, booked){

  if(booked === 'true'){
    let pl = "Cancel" + "|" + gameId;

    let template = {
                      "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": description,
                            "buttons": [
                                {
                                  "type": "postback",
                                  "title": "Cancel Booking",
                                  "payload": pl,
                                },
                                {
                                    "type": "postback",
                                    "title": "Keep Looking",
                                    "payload": "No, thanks",
                                }
                              ],
                            }
                        }
                    }

    return template;
  }

  if(parseFloat(price) > 0){
    let payingLink = "kickabouttest.herokuapp.com/payment" + "?mid=" + sender + "&gid=" + gameId;

    let template = {
                      "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": description,
                            "buttons": [
                                {
                                  "type": "web_url",
                                  "title": "BOOK",
                                  "url": payingLink,
                                },
                                {
                                    "type": "postback",
                                    "title": "Keep Looking",
                                    "payload": "No, thanks",
                                }
                              ],
                            }
                        }
                    }

    return template;
  }
  else {
    let pl = "Book" + "|" + gameId;

    let template = {
                      "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": description,
                            "buttons": [
                                {
                                  "type": "postback",
                                  "title": "BOOK",
                                  "payload": pl,
                                },
                                {
                                    "type": "postback",
                                    "title": "Keep Looking",
                                    "payload": "No, thanks",
                                }
                              ],
                            }
                        }
                    }

    return template;
  }
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


function allGames(sender){
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
      data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked, item.desc, item.when, item.price]);
    })

    data = generate_card(data);
    cards(sender, data, "today");
  })
}

function yep(sender){
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
            sendAllGames(sender);
            console.log("saved it!");
          }
        })
      }
  });
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
        booked(sender);
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
    cards(sender, generate_card_for_booking(sender, gameId, description, price, booked));
  })
  .catch(function(err){
    console.log(err);
  })
}


module.exports = {
  start: start,
  booked: booked,
  text: text,
  play: play,
  cards: cards,
  directions: directions,
  generate_card_element: generate_card_element,
  generate_card: generate_card,
  generate_card_for_booking: generate_card_for_booking,
  allGames: allGames,
  yep: yep,
  book: book,
  cancel_booking: cancel_booking,
  more_info: more_info
}
