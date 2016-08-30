'use strict'

const request = require('request');
const M = require('./schemas.js');
const config = require('./config');
const S = require('./strings');
const H = require('./helperFunctions');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;
const _ = require('underscore')

// Helpers

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
    "text": S.s.bot.start.text,
    "quick_replies":[{
      "content_type":"text",
      "title": S.s.bot.start.quickReply,
      "payload":"yep"
    }]
  }
  send(uid, messageData);
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



// Menu Related

function menu (uid) {
  let messageData = {
    "text": S.s.bot.menu.text,
    "quick_replies":[{
      "content_type": "text",
      "title": S.s.bot.menu.showEventsText,
      "payload": "show events"
    }, {
      "content_type": "text",
      "title": S.s.bot.menu.myEventsText,
      "payload": "my events"
    }, {
      "content_type": "text",
      "title": S.s.bot.menu.notificationsText,
      "payload": "notifications"
    }]
  }
  send(uid, messageData);
}

function notifications (uid) {
  let messageData = {
    "text":S.s.bot.menu.notifications.text,
    "quick_replies":[{
      "content_type": "text",
      "title": S.s.bot.menu.notifications.notificationsOnText,
      "payload": "notifications on"
    }, {
      "content_type": "text",
      "title": S.s.bot.menu.notifications.notificationsOffText,
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
      text(uid, S.s.bot.menu.notifications.onConfirmationText);
    } else {
      text(uid, S.s.bot.menu.notifications.offConfirmationText);
    }
  });
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
          data.push(event._id);
        }
      });
    });

    if (data.length === 0) {
      textPromise(uid, S.s.bot.myEventsHaventJoined).then(() => {
        allEvents(uid, S.s.bot.allEventsDefault);
      }).catch(console.log);
    }
    else {
      data = generateCard(data);
      cards(uid, data, S.s.bot.yourEvents);
    }
  })
}

/*
  Send receipt for given game details to the user */
function booked (uid, name, price, eventName, strapline, image_url, order_number, timestamp, callback) {
  let messageData = {
    "attachment": {
      "type":"template",
      "payload": {
        "template_type": "receipt",
        "recipient_name": name,
        "currency": "GBP",
        "payment_method": "Stripe",
        "order_number": order_number,
        "timestamp": timestamp,
        "elements": [{
          "title": eventName,
          "subtitle": strapline,
          "quantity": 1,
          "price": price.toFixed(2),
          "currency": "GBP",
          "image_url": image_url
        }],
        "summary": {
          "total_cost": price.toFixed(2)
        }
      }
    }
  }

  send(uid, messageData, callback);
}

function bookedForFreeEvents (uid) {
  let messageData = {
    "text": S.s.bot.booking.freeEventBookedConfirmation,
    "quick_replies":[{
      "content_type":"text",
      "title": S.s.bot.booking.quickReply,
      "payload":"continue"
    }]
  }
  send(uid, messageData);
}

function directions (uid, name, latlong) {
  return new Promise(function (resolve, reject) {
    latlong = latlong.replace(/\s+/g, '');
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
              "title": S.s.bot.eventCard.buttonDirections,
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
    if (err || results.length == 0) {
      console.log('Error getting event to share:' + ((results.length == 0)
        ? "No events with id " + eid + " found."
        : JSON.stringify(err)));
    }
    if (results.length > 0) {
      let event = results[0];
      let publicLink = config.ROOT_URL + "/event?eid=" + eid;
      let description = event.strapline;
      let numAttending = event.non_members_attending + event.joined.length;
      if (numAttending > 0) {
        description = description + " | ☑ " + numAttending;
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
              "item_url": publicLink,
              "buttons": [{
                "type": "web_url",
                "title": S.s.bot.eventCard.buttonShareCardMoreInfo,
                "url": publicLink,
              }]
            }]
          }
        }
      }
      textPromise(uid, S.s.bot.shareInstruction)
      .then(()=>{
        send(uid, messageData);
      })
      .catch((e)=>{
        console.log('Error sending text, ' + e);
      });

    }
  })
}

function cardForBooking (uid, eventId, description, price, booked) {
    let bookOrCancelButton = {}

    // if user has already booked the event
    if (booked) {
      bookOrCancelButton = {
        "type": "postback",
        "title": S.s.bot.eventCard.buttonCancelBooking,
        "payload": "Cancel" + "|" + eventId
      }
    }

    // if it is a paid event then button with weblink
    else if (parseFloat(price) > 0) {
      bookOrCancelButton = {
        "type": "web_url",
        "title": S.s.bot.eventCard.buttonBook,
        "url": config.ROOT_URL + "/payment"
          + "?mid=" + uid.mid + "&eid=" + eventId
      }
    }

    // free event so normal button
    else {
      bookOrCancelButton = {
        "type": "postback",
        "title": S.s.bot.eventCard.buttonBook,
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
            bookOrCancelButton,
            {
              "type": "postback",
              "title": S.s.bot.eventCard.buttonKeepLooking,
              "payload": "No, thanks",
            },
            {
              "type": "postback",
              "title": S.s.bot.eventCard.buttonShare,
              "payload": "Share" + "|" + eventId
            }
          ]
        }
      }
    }

    send(uid, messageData);
}

// Cards

function generateCard(array) {
  let elements = [];
  array.forEach((eventId) => {
    M.Event.findOne({_id:eventId}, function(err, result){
      if(err){console.log(err);}
      if(result){

        let latlong = result.latlong.replace(/\s+/g, '');
        let pl = "More Info" + | + eventId;
        let directions_link = "http://maps.google.com/?q=" + latlong

        if (result.joined.length == result.capacity) {
          let template = {
            "title": result.name,
            "subtitle": result.strapline + " (fully booked)",
            "image_url": result.image_url,
            "item_url": directions_link
          }
          elements.push(template);
        }
        else {
          let template = {
            "title": result.name,
            "subtitle": result.strapline,
            "image_url": result.image_url,
            "item_url": directions_link,
            "buttons": [{
              "type": "postback",
              "title": S.s.bot.eventCard.buttonMoreInfo,
              "payload": pl
            }]
          }
          elements.push(template);
        }
      }
    })
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

function cards (uid, data, message) {
  if (message) {
    textPromise(uid, message).then(() => {
      send(uid, data);
    })
    .catch(console.log);
  }
  else {
    send(uid, data);
  }
}

function allEvents (uid, broadcast) {
  let now = new Date();
  let query = {when:
    {$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}

  M.Event.find(query).sort('when').exec((err, events) => {
    let data = [];
    events.forEach((event) =>{
      data.push(event._id]);
    });
    data = generateCard(data);
    if (broadcast === undefined) {
      cards(uid, data);
    }
    else {
      cards(uid, data, broadcast);
    }
  });
}

function yep(uid) {
  M.Analytics.update({name:"Button:Yep"},
    {$push: {activity: {uid:uid._id, time: new Date()}}},
    {upsert: true},
    (err) => {
      if (err) {
        console.log('Error saving analytics for "Button:Yep":', err);
      }
    });
  M.User.find({mid:uid.mid}, (err, result) => {
    if (err) {console.log(err);}
    if(result.length > 0){
      console.log("User is already registered");
      allEvents(uid, S.s.bot.allEventsDefault);
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
            if (err) {console.log(err);}
            else {
              M.Analytics.update({name:"NewUsers"},
              {$push: {activity: {uid:uid._id, time: new Date()}}},
              {upsert: true}, console.log
              });
              allEvents(uid, S.s.bot.allEventsDefault);
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
  H.updateUserEventAnalytics(uid, eventId, 0, null).then((event) => {
    bookedForFreeEvents(uid);
  })
  .catch(console.log);
}

function cancelBooking (uid, eventId) {
  M.Analytics.update({name:"Button:Cancel"},
    {$push: {activity: {uid:uid._id, time: new Date()}}},
    {upsert: true},
    console.log
    });

  M.Event.find({_id:eventId}, (err, result) => {
    if (result.length > 0) {
      M.Event.findOneAndUpdate({_id:eventId}, {$pull: {joined: {uid: uid._id}}},
      (err, data) => {
        if(err){console.log(err);}
        text(uid, S.s.bot.bookingCancelled);
      });
      M.User.findOneAndUpdate({_id:uid}, {$pull: {events: {eid:eventId}}},
      (err, data) => {
        if(err){console.log(err);}
        allEvents(uid, S.s.bot.allEventsAfterCancel);
      });
    }
  })
}

function moreInfo(uid, eventId) {
  M.Analytics.update({name:"Button:More Info"},
    {$push: {activity: {uid:uid._id, time: new Date()}}},
    {upsert: true},
    console.log
    });

  M.Event.findOne({_id:eventId}, function(err, result){
    if(err){console.log(err);}
    if(result){
      directions(uid, result.name, result.latlong)
      .then((success) => {
        M.User.findOne({uid:uid.mid}, function(e, res){
          if(e){console.log(e);}
          if(res){
            let booked = false;
            _.each(result.joined, function(joiner){
              if(joiner.uid == res._id){
                booked = true;
              }
            })
            cardForBooking(uid, eventId);
          }
       })
      })
      .catch(console.log)
    }
  })
}


module.exports = {
  start: start,
  menu: menu,
  notifications: notifications,
  notificationsChange: notificationsChange,
  booked: booked,
  text: text,
  textPromise: textPromise,
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
