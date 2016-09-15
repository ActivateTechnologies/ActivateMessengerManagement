'use strict'

const request = require('request');
const _ = require('underscore')

module.exports = function(code){

  const M = require('./models/' + code);
  const config = require('./config')(code);
  const S = require('./strings')(code);
  const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;

  function send(uid, messageData, callback) {
    let recipient;
    if (uid.mid) {
      recipient = {id:uid.mid}
    }
    else if (uid.phoneNumber) {
      recipient = {phone_number:uid.phoneNumber};
    }
    else {
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

  function textPromise(uid, text) {
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

  function textWithQuickReplies(uid, text, quickReplies) {
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
      if (err) console.log(err);
      if (set === "on") {
        text(uid, S.s.bot.menu.notifications.onConfirmationText);
      }
      else {
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
            data.push(event);
          }
        });
      });

      if (data.length === 0) {
        textPromise(uid, S.s.bot.myEventsHaventJoined).then(() => {
          allEvents(uid, S.s.bot.allEventsDefault);
        }).catch(console.log);
      }
      else {
        data = generateCard(uid, data);
        cards(uid, data, S.s.bot.yourEvents);
      }
    })
  }

  /*
    Send receipt for given game details to the user */
  function booked(uid, name, price, eventName, strapline, image_url, order_number, timestamp, callback) {
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

  function bookedForFreeEvents (uid, eid) {
    M.Event.findOne({_id:eid}, function(err, result){
      if(err){console.log(err);}
      if(result){
        booked(uid, uid.firstName + " " + uid.lastName,
          result.price, result.name, result.strapline, result.image_url,
          new Date().toISOString(), Math.round((new Date()).getTime()/1000))
      }
    })
  }

  function directions(uid, name, latlong) {
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
          resolve();
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
                "title": event.name + ": via Kickabout",
                "subtitle": description,
                "image_url": event.image_url,
                "item_url": S.s.company.botURL,
                "buttons": [{
                  "type": "web_url",
                  "title": S.s.bot.eventCard.buttonShareCardMoreInfo,
                  "url": S.s.company.botURL,
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
      // if (booked) {
      //   bookOrCancelButton = {
      //     "type": "postback",
      //     "title": S.s.bot.eventCard.buttonCancelBooking,
      //     "payload": "Cancel" + "|" + eventId
      //   }
      // }

      // if it is a paid event then button with weblink
      //else

      if (parseFloat(price) > 0) {
        bookOrCancelButton = {
          "type": "web_url",
          "title": S.s.bot.eventCard.buttonBook,
          "url": config.ROOT_URL + "/payment." + code + "?eid=" + eventId + "&uid=" + uid._id
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

  function generateCard(uid, events) {
    let elements = [];
    _.each(events, (event) => {

          let latlong = event.latlong.replace(/\s+/g, '');
          let pl = "More Info" + '|' + event._id;
          // let directions_link = "http://maps.google.com/?q=" + latlong;

          let bookButton = {};
          if (parseFloat(event.price) > 0){
            bookButton = {
              "type": "web_url",
              "title": S.s.bot.eventCard.buttonBook,
              "url": config.ROOT_URL + "/payment." + code + "?eid=" + event._id + "&uid=" + uid._id
            }
          }

          // free event so normal button
          else {
            bookButton = {
              "type": "postback",
              "title": S.s.bot.eventCard.buttonBook,
              "payload": "Book" + "|" + event._id
            }
          }

          if (event.joined.length == event.capacity) {
            let template = {
              "title": event.name,
              "subtitle": event.strapline + " (fully booked)",
              "image_url": event.image_url
            }
            elements.push(template);
          }
          else {
            let template = {
              "title": event.name,
              "subtitle": event.strapline,
              "image_url": event.image_url,
              "buttons": [
                bookButton,
                {
                "type": "postback",
                "title": S.s.bot.eventCard.buttonMoreInfo,
                "payload": pl
                }
              ]
            }
            elements.push(template);
          }
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

  function cards(uid, data, message) {
    if (message) {
      textPromise(uid, message)
      .then(() => {
        send(uid, data);
      }, (e)=> { if (e) console.log(e);})
    }
    else {
      send(uid, data);
    }
  }

  function event(uid, eventId) {
    M.Event.findOne({_id:eventId}, function(err, result){
      if(err) console.log(err);
      if(result){
        let data = [];
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
        if(result.when > now){
          data.push(result);
          data = generateCard(uid, data);
          cards(uid, data);
        }
        else {
          console.log("That event has finished");
        }
      }
    })
  }

  function allEvents(uid, broadcast) {
    let now = new Date();
    let query = {when:
      {$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}

    M.Event.find(query).sort('when').exec((err, events) => {
      if(err) console.log(err);
      let data = generateCard(uid, events);
      if (broadcast) {
        cards(uid, data, broadcast);
      }
      else {
        cards(uid, data);
      }
    });
  }

  function book(uid, rest) {
    let arr = rest.split('|');
    let eid = arr[1];

    // update analytics
    M.Analytics.update({name:"Payments"},
      {$push: {
          activity: {
            uid: uid._id,
            time: new Date(),
            eid: eid,
            amount: 0
          }
        },
        $inc: {total: 0}},
      {upsert: true},
    (e)=> { if (e) console.log(e);});

    // update user record
    M.User.findOneAndUpdate({_id:uid._id},
      {$push: {events: {
        eid: eid,
        bookingReference: uid._id + '-' + eid,
        joinDate: new Date()
      }}},
    (e)=> { if (e) console.log(e);});

    // update event rec
    M.Event.findOneAndUpdate({_id:eid},
      {$push: {joined: {
        uid: uid._id,
        joinDate: new Date()
      }}},
    function(err){
      if(err) console.log(err);
      else {
        bookedForFreeEvents(uid, eid);
      }
    });
  }

  function cancelBooking (uid, eventId) {
    M.Analytics.update({name:"Button:Cancel"},
      {$push: {activity: {uid:uid._id, time: new Date()}}},
      {upsert: true},
    (e)=> { if (e) console.log(e);});

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
    (e)=> { if (e) console.log(e);});

    M.Event.findOne({_id:eventId}, function(err, result){
      if(err){
        console.log(err);
      }
      if(result){
        directions(uid, result.name, result.latlong)
        .then(() => {
          let booked = false;
          _.each(result.joined, function(joiner){
            if(joiner.uid == uid._id){
              booked = true;
            }
          })
          cardForBooking(uid, eventId, result.desc, result.price, booked);
        })
        .catch(console.log)
      }
    })
  }


  return {
    start: start,
    menu: menu,
    notifications: notifications,
    notificationsChange: notificationsChange,
    booked: booked,
    text: text,
    textPromise: textPromise,
    textWithQuickReplies: textWithQuickReplies,
    cards: cards,
    allEvents: allEvents,
    myEvents: myEvents,
    book: book,
    cancelBooking: cancelBooking,
    moreInfo: moreInfo,
    shareEvent: shareEvent,
    event: event
  }

}
