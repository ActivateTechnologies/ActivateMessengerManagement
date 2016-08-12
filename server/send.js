'use strict'

const request = require('request');
const M = require('./schemas.js');
const config = require('./../config');
const W = require('./wit.js');
const L = require('./luis.js');
const H = require('./helperFunctions');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;

function send(uid, messageData, callback) {
  let recipient;
  if (uid.mid) {
    recipient = {id:uid.mid}
  } else if (uid.phoneNumber) {
    recipient = {phone_number:uid.phoneNumber};
  } else {
    console.log('send not executed, as neither mid nor phone number exist');
    return;
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:VERIFICATION_TOKEN},
    method: 'POST',
    json: {
      recipient: recipient,
      message: messageData
    }
  }, (error, response, body) => {
    let errorObject = (error) ? error : response.body.error;
    if (errorObject) {
      console.log('Error sending message'
       + ' (' + JSON.stringify(messageData) + ')'
       + ' to recipient "' + JSON.stringify(recipient) 
       + '": ', JSON.stringify(errorObject));
      if (callback) {
        callback(errorObject);
      }
    } else if (callback) {
      callback();
    }
  });
}

function start(uid) {
  let messageData = {
    "text":"Hey there! We at Kickabout are all about playing football. Sound Good?",
    "quick_replies":[{
      "content_type":"text",
      "title":"Yep",
      "payload":"yep"
    }]
  }
  send(uid, messageData);
}

function startWithPhoneNumber(phoneNumber, eventId) {
  return new Promise(function(resolve, reject){
    let messageData = {
      "text":"Hey there! We at Kickabout are all about playing football. Sound Good?",
      "quick_replies":[{
        "content_type":"text",
        "title":"Yep",
        "payload":("phoneNumber|" + phoneNumber + "|" + eventId)
      }]
    }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
        recipient: {phone_number:phoneNumber},
        message: messageData
      }
    }, (error, response, body) => {
      let errorObject = (error) ? error : response.body.error;
      if (errorObject) {
        console.log('Error in startWithPhoneNumber(): ', errorObject);
        reject(errorObject);
      } else {
        resolve();
      }
    })
  })
}

function bookedWithPhoneNumber(phoneNumber, name, price, eventName, strapline, image_url, order_number) {
  return new Promise((resolve, reject) => {
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
            "title": eventName,
            "subtitle": strapline,
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
    }, (error, response, body) => {
      let errorObject = (error) ? error : response.body.error;
      if (errorObject) {
        console.log('Error sending booked message to phoneNumber "'
          + phoneNumber + '": ', errorObject);
        reject(errorObject);
      } else {
        resolve();
      }
    })
  })
}

function textWithPhoneNumber(phoneNumber, text) {
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
      let errorObject = (error) ? error : response.body.error;
      if (errorObject) {
        console.log('Error sending text messages to phoneNumber "'
          + phoneNumber + '": ', errorObject);
        reject(errorObject);
      } else {
        resolve();
      }
    })
  })
}

function registerUser (uid, phoneNumber, eventId) {
  var get_url = "https://graph.facebook.com/v2.6/" + uid.mid
   + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token="
   + VERIFICATION_TOKEN;
  request(get_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      let user = M.User({
        mid: uid.mid,
        phoneNumber: phoneNumber,
        firstName: body.first_name,
        lastName: body.last_name,
        profilePic: body.profile_pic,
        locale: body.locale,
        gender: body.gender,
        signedUpDate: new Date()
      })

      user.save((err) => {
        if (err) {
          console.log('Error registering user: ', err);
        } else {
          M.Analytics.update({name:"NewUsers"},
          {$push: {activity: {uid:uid._id, time: new Date()}}},
          {upsert: true}, (err) => {
            if (err) {
              console.log('Error saving analytics for "NewUsers":', err);
            }
          });
          console.log("saved user");
        }
      })
    }
  })
}

function menu (uid) {
  let messageData = {
    "text":"Hi there, what do you want to do?",
    "quick_replies":[{
      "content_type": "text",
      "title": "Show Events",
      "payload": "show events"
    }, {
      "content_type": "text",
      "title": "My Events",
      "payload": "my events"
    }, {
      "content_type": "text",
      "title": "Notifications",
      "payload": "notifications"
    }]
  }
  send(uid, messageData);
}

function notifications (uid) {
  let messageData = {
    "text":"Do you want to receive weekly event updates?",
    "quick_replies":[{
      "content_type": "text",
      "title": "Yes",
      "payload": "notifications on"
    }, {
      "content_type": "text",
      "title": "No",
      "payload": "notifications off"
    }]
  }

  send(uid, messageData);
}

function notificationsChange (uid, set) {
  M.User.update({mid:uid.mid}, {notifications: set}, (err) => {
    if (err) {
      console.log('Error changing user\'s notification settings:', err);
    }
    if (set === "on") {
      text(uid, "You will receive weekly notifications");
    } else {
      text(uid, "You won't receive weekly notifications");
    }
  });
}

function booked (uid, name, price, eventName, strapline, image_url, order_number, callback) {
  let messageData = {
    "attachment": {
      "type":"template",
      "payload": {
        "template_type": "receipt",
        "recipient_name": name,
        "currency": "GBP",
        "payment_method": "Stripe",
        "order_number": order_number,
        "elements": [{
          "title": eventName,
          "subtitle": strapline,
          "quantity": 1,
          "price": price,
          "currency": "GBP",
          "image_url": image_url
        }],
        "summary": {
          "total_cost": price
        }
      }
    }
  }

  send(uid, messageData, callback);
}

function bookedPromise (uid, name, price, eventName, strapline, image_url,
 order_number) {
  return new Promise((resolve, reject) => {
    booked(uid, name, price, eventName, strapline, image_url, order_number,
     (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function bookedForFreeEvents (uid) {
  let messageData = {
    "text":"Thanks for booking. Do you want to continue looking?",
    "quick_replies":[{
      "content_type":"text",
      "title":"Yes",
      "payload":"continue"
    }]
  }
  send(uid, messageData);
}

function processReceivedMessage(uid, message, defaultCallback) {
  //W.sendConversationMessage(uid, message);
  L.processTextMessage(uid, message, defaultCallback);
}

function textPromise (uid, text) {
  return new Promise(function(resolve, reject){
    let messageData = { text: text }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
        recipient: {id:uid.mid},
        message: messageData
      }
    }, function(error, response, body) {
      let errorObject = (error) ? error : response.body.error;
      if (errorObject) {
        console.log('Error sending text message ' + JSON.stringify(messageData)
          + ' to mid "'
          + uid.mid + '": ', errorObject);
        reject(errorObject);
      } else {
        resolve();
      }
    })
  })
}

function text (uid, text, callback) {
  let messageData = { text: text }
  send(uid, messageData, callback);
}

function textWithQuickReplies (uid, text, quickReplies) {
  //console.log('textWithQuickReplies', uid, text, quickReplies);
  return new Promise((resolve, reject) => {
    let quickRepliesObjects = [];
    if (quickReplies.length && typeof quickReplies[0] === 'string') {
      quickReplies.forEach((textString) => {
        quickRepliesObjects.push({
          "content_type": "text",
          "title": textString,
          "payload": "staticTempPayLoad~" + textString
        });
      });
    } else {
      quickRepliesObjects = quickReplies;
    }
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:VERIFICATION_TOKEN},
      method: 'POST',
      json: {
        recipient: {id: uid.mid},
        message: {
          text: text,
          quick_replies: quickRepliesObjects
        }
      }
    }, function(error, response, body) {
      let errorObject = (error) ? error : response.body.error;
      if (errorObject) {
        console.log('Error sending messages with quickReplies to mid "'
          + uid.mid + '": ', errorObject);
        reject(errorObject);
      } else {
        resolve();
      }
    });
  });
}

function cards (uid, data, message) {
  if (message === undefined) {
    text(uid, "Here are some upcoming events to join. "
     + "Tap the card for directions or 'More Info' to book.");
  } else {
    text(uid, message);
  }
  send(uid, data);
}

function directions (uid, name, latlong) {
  return new Promise(function (resolve, reject) {
    let image_link = "https://maps.googleapis.com/maps/api/staticmap?center="
      + latlong + "&zoom=15&size=300x300&markers=" + latlong;

    let directions_link = "http://maps.google.com/?q=" + latlong;

    let messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": name,
            "image_url": image_link,
            "item_url": directions_link,
            "buttons": [{
              "type": "web_url",
              "title": "Directions",
              "url": directions_link
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
        recipient: {id:uid.mid},
        message: messageData
      }
    }, function(error, response, body) {
      let errorObject = (error) ? error : response.body.error;
      if (errorObject) {
        console.log('Error sending directions to mid "'
          + uid.mid + '": ', errorObject);
        reject(errorObject);
      } else {
        resolve("success");
      }
    });
  })
}

function shareEvent (uid, text) {
  let eid = text.split("|")[1];
  M.Event.find({_id:eid}, function(err, results){
    if (results.length > 0) {
      let event = results[0];
      let publicLink = "http://localhost:3000/event?eid=" + eid;
      let description = event.when.toString().substring(0, 10)
       + " | " + event.strapline;
      let numAttending = event.non_members_attending + event.joined.length;
      if (numAttending > 0){
        description = description + " | " + numAttending + " attending";
      }
      let messageData = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": event.name,
              "subtitle": description,
              "image_url": event.image_url,
              "item_url": event.publicLink,
              "buttons": [{
                "type": "web_url",
                "title": "More Info",
                "url": publicLink,
              }]
            }]
          }
        }
      }
      textPromise(uid, "If you're on your phone, forward the following"
       + " message to a friend or group!")
      .then(()=>{
        send(uid, messageData);
      })
      .catch((e)=>{
        console.log('Error sending text, ' + e);
      });

    }
  })
}

function generateCardElement (name, strapline, image_url, latlong,
 eventId, attending, capacity, booked, description, when, price) {

  let con = "|||.|";
  let pl = "More Info" + con + name + con + strapline + con + latlong + con 
   + eventId + con + description + con + price + con + booked;

  let directions_link = "http://maps.google.com/?q=" + latlong;

  if (attending == capacity) {
    let template = {
      "title": name,
      "subtitle": description + " (fully booked)",
      "image_url": image_url,
      "item_url": directions_link
    }
    return template;
  } else {
    let template = {
      "title": name,
      "subtitle": strapline,
      "image_url": image_url,
      "item_url": directions_link,
      "buttons": [{
        "type": "postback",
        "title": "More Info",
        "payload": pl
      }]
    }
    return template;
  }
}

function cardForBooking (uid, eventId, description, price, booked) {
  let bookOrCancelButton = {}
  let phoneNumber = uid.phoneNumber.substr(uid.phoneNumber.length - 10, 10);
  console.log('phoneNumber:', phoneNumber);
  if (booked === "true") {
    bookOrCancelButton = {
      "type": "postback",
      "title": "Cancel Booking",
      "payload": "Cancel" + "|" + eventId
    }
  } else if (parseFloat(price) > 0) {
    bookOrCancelButton = {
      "type": "web_url",
      "title": "BOOK",
      "url": config.ROOT_URL + "/payment"
        + "?pn=" + phoneNumber + "&eid=" + eventId
    }
  } else {
    bookOrCancelButton = {
      "type": "postback",
      "title": "BOOK",
      "payload": "Book" + "|" + eventId
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
          }/*, {
            "type": "postback",
            "title": "Share",
            "payload": "Share" + "|" + eventId
          }*/
        ]
      }
    }
  }

  send(uid, messageData);
}

function generateCard (array) {
  let elements = [];
  array.forEach((item) => {
    //name, strapline, image_url, latlong, eventId,
    //attending, capacity, booked, description, when, price
    elements.push(generateCardElement(item[0], item[1], item[2], item[3], item[4],
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

function allEvents (uid, broadcast) {
  let now = new Date();
  let query = {when:
    {$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}

  M.Event.find(query).sort('when').exec((err, events) => {
    let data = [];
    events.forEach((event) =>{
      let booked = false;
      let attendees = event.joined;
      attendees.forEach((user) => {
        if (user.uid == uid._id) {
          booked = true;
        }
      });
      data.push([event.name, event.strapline, event.image_url, event.latlong,
        event._id, event.joined.length + event.non_members_attending, event.capacity,
        booked, event.desc, event.when, event.price]);
    });
    data = generateCard(data);
    if (broadcast === undefined) {
      cards(uid, data);
    } else {
      cards(uid, data, broadcast);
    }
  });
}

function yep (uid) {
  M.Analytics.update({name:"Button:Yep"},
    {$push: {activity: {uid:uid._id, time: new Date()}}},
    {upsert: true},
    (err) => {
      if (err) {
        console.log('Error saving analytics for "Button:Yep":', err);
      }
    });
  M.User.find({mid:uid.mid}, (err, result) => {
    if (err) {
      console.log('Error finding user with mid "' + uid.mid + '":', err);
    }
    if(result.length > 0){
      console.log("User is already registered");
      allEvents(uid);
    } else {
      var get_url = "https://graph.facebook.com/v2.6/" + uid.mid
       + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token="
       + VERIFICATION_TOKEN;
      request(get_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          let user = M.User({
            mid: uid.mid,
            firstName: body.first_name,
            lastName: body.last_name,
            profilePic: body.profile_pic,
            locale: body.locale,
            gender: body.gender,
            signedUpDate: new Date()
          });
          user.save((err) => {
            if (err) {
              console.log('Error saving user:', err);
            } else {
              M.Analytics.update({name:"NewUsers"},
              {$push: {activity: {uid:uid._id, time: new Date()}}},
              {upsert: true}, (err) => {
                if (err) {
                  console.log('Error saving analytics for "NewUsers":', err);
                }
              });
              allEvents(uid);
            }
          });
        }
      });
    }
  })
}

function book (uid, rest) {
  let arr = rest.split('|');
  let eventId = arr[1];
  H.updateUserEventAnalytics(uid, eventId, 0, (event, error) => {
    bookedForFreeEvents(uid);
  });
}

function cancelBooking (uid, rest) {
  M.Analytics.update({name:"Button:Cancel"},
    {$push: {activity: {uid:uid._id, time: new Date()}}},
    {upsert: true},
    (err) => {
      if (err) {
        console.log('Error saving analytics for "Button:Cancel":', err);
      }
    });

  let arr = rest.split('|');
  let eventId = arr[1];
  M.Event.find({_id:eventId}, (err, result) => {
    if (result.length > 0) {
      M.Event.findOneAndUpdate({_id:eventId}, {$pull: {joined: {uid: uid._id}}},
      (err, data) => {
        if (err) {
          console.log('Error removing user from game\'s joined:', err);
        }
        text(uid, "Your booking has been cancelled");
      });
      M.User.findOneAndUpdate({_id:uid}, {$pull: {events: {eid:eventId}}},
      (err, data) => {
        if (err) {
          console.log('Error pulling eid from users\'s events:', err);
        }
        bookedForFreeEvents(uid);
      });
    }
  })
}

function moreInfo (uid, text) {
  M.Analytics.update({name:"Button:More Info"},
    {$push: {activity: {uid:uid._id, time: new Date()}}},
    {upsert: true},
    (err) => {
      if (err) {
        console.log('Error saving analytics for "Button:More Info":', err);
      }
    });

  let arr = text.split("|||.|");
  //console.log('moreInfo', text, arr[5]);
  let name = arr[1];
  let strapline = arr[2];
  let latlong = arr[3];
  let eventId = arr[4];
  let description = arr[5];
  let price = arr[6];
  let booked = arr[7]

  directions(uid, name, latlong)
  .then((success) => {
    cardForBooking(uid, eventId, description, price, booked);
  }).catch((err) => {
    console.log('Error sending directions:', err);
  })
}

function event (uid, eventId) {
  M.Event.find({_id:eventId}, function(err, result){
    if(result.length > 0){
      let data = [];
      let item = result[0];
      let now = new Date();
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
      if(item.when > now){
        let booked = false;
        let join = item.joined;

        join.forEach(function(i){
          if(i.uid === uid._id){
            booked = true;
          }
        });
        data.push([item.name, item.strapline, item.image_url, item.latlong,
         item._id, item.joined.length, item.capacity, booked, item.desc,
         item.when, item.price]);
        data = generateCard(data);
        cards(uid, data, "Here is your event: ");
      } else {
        text(uid, "That event has finished")
      }
    }
  })
}

function myEvents (uid) {
  let now = new Date();
  let query = {when:{
    $gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}};

  M.Event.find(query).sort('when').exec((err, events) => {
    let data = [];
    events.forEach((event) => {
      let join = event.joined;
      join.forEach((user) => {
        if (user.uid == uid._id) {
          data.push([event.name, event.strapline, event.image_url, event.latlong,
           event._id, event.joined.length + event.non_members_attending,
           event.capacity, true, event.desc, event.when, event.price]);
        }
      });
    });

    //console.log(data);

    if (data.length === 0) {
      textPromise(uid, "You haven't joined any events.").then(() => {
        allEvents(uid);
      }).catch((e) => {
        console.log('Error finding user\'s games:', e);
      });
    } else {
      data = generateCard(data);
      cards(uid, data, "Here are the events you've joined: ");
    }
  })
}

module.exports = {
  start: start,
  startWithPhoneNumber: startWithPhoneNumber,
  textWithPhoneNumber: textWithPhoneNumber,
  bookedWithPhoneNumber: bookedWithPhoneNumber,
  registerUser: registerUser,
  menu: menu,
  notifications: notifications,
  notificationsChange: notificationsChange,
  booked: booked,
  processReceivedMessage: processReceivedMessage,
  text: text,
  textPromise: textPromise,
  textWithQuickReplies: textWithQuickReplies,
  event: event,
  cards: cards,
  allEvents: allEvents,
  myEvents: myEvents,
  yep: yep,
  book: book,
  bookedPromise: bookedPromise,
  cancelBooking: cancelBooking,
  moreInfo: moreInfo,
  shareEvent: shareEvent
}
