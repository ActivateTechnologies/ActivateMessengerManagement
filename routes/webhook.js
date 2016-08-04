'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../server/schemas.js');
const send = require('./../server/send.js');
const sendNew = require('./../server/sendnew.js');
const twilio = require('./../server/twilio.js');
const Conversation = require('./../server/conversation.js');
const request = require('request');
const config = require('./../config');
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN
const FACEBOOK_APP_ID = config.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = config.FACEBOOK_APP_SECRET

router.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

/*router.get('/sendsms', (req, res) => {
  console.log(req.query.to, req.query.message);
  let phone = (req.query.to) ? req.query.to : '+447415633330';
  let message = (req.query.message) ? req.query.message : 'Hello';
  twilio.sendSms(phone, message, (error) => {
    if (error) {
      res.status(200).send('Sms sending error:', error.message);
    } else {
      res.status(200).send('Sms sent!');
    }
  });
}); */

router.post('/webhook/', function (req, res) {
  let messaging_events = req.body.entry[0].messaging;
  messaging_events.forEach(function(event){
    let sender = event.sender.id;
    M.User.find({userId: sender}, (error, results) => {
      if (error) {
        console.log('Error getting user object: ', error);
      } else if (results.length == 0) {
        console.log('No users with userId "' + sender + '" found.');
      } else if (results.length > 1) {
        console.log('Multiple users with userId "' + sender + '" found.');
      } else {
        let user = results[0];
        let uid = {
          _id: user._id,
          mid: sender
        }
        if (user.phoneNumber) {
          uid.phoneNumber = user.phoneNumber;
        }

        //if text message or quick reply
        if (event.message && event.message.text && !event.message.is_echo) {
          if (user.conversationLocation && user.conversationLocation.conversationName) {
            Conversation.executeTreeNodefromId(uid,
              user.conversationLocation.conversationName,
              user.conversationLocation.nodeId + '.1',
              event.message.text);
          } else {
            if (event.message.quick_reply) {
              processQuickReply(event, user, uid);
            } else {
              processTextMessage(event, user, uid);
            }
          }
        } else if(event.message && event.message.attachments && !event.message.is_echo){
          processAttachment(event, user, uid);
        } else if (event.postback) {
          processPostback(event, user, uid);
        } else if(event.optin){
          processOptin(event.optin);
        }
      }
    });
  });
  res.sendStatus(200);
})

function processOptin(optin){
  console.log(optin);
}

function processQuickReply(event, user, uid) {
  let payload = event.message.quick_reply.payload;
  if (payload.substring(0, 16) == "conversationName") {
    Conversation.handleQuickReply(uid, payload);
  } else if (payload.substring(0, 4) == "Book") {
    send.book(uid, payload);
  } else if (payload.substring(0, 6) == "Cancel") {
    send.cancel_booking(uid, payload);
  } else if (payload.substring(0, 9) == "More Info") {
    send.more_info(uid, payload);
  } else if (payload.substring(0, 11) == "phoneNumber") {
    let arr = text.split('|');
    let phoneNumber = arr[1];
    let gameId = arr[2];
    send.register_user(uid, phoneNumber, gameId);
  } else {
    switch(payload.toLowerCase()){

      case('start'):
      send.start(uid);
      break;

      case('yep'):
      send.yep(uid);
      break;

      case("notifications"):
      send.notifications(uid);
      break;

      case("my games"):
      send.my_games(uid);
      break;

      case("notifications on"):
      send.notifications_change(uid, "on");
      break;

      case("notifications off"):
      send.notifications_change(uid, "off");
      break;

      default:
      send.allGames(uid);
    }
  }
}

function processTextMessage(event, user, uid) {
  /*send.processReceivedMessage(uid, event.message.text, () => {
    //LUIS Did not find anything, so default response
    console.log('Got message: ' + event.message.text + ' from ' + uid.mid);
    sendNew.text(uid.mid, "I didn't quite understand that sorry. "
     + "Here are all upcoming games. Alternatively, just say 'help'"
     + " if you wanna talk to our support team", () => {
      M.User.find({userId: uid.mid}, function(err, result){
        if(result.length > 0 && result[0].facebookID){
          send.allGames(uid);
        }
        else {
          send.start(uid);
        }
      })
    });
  });
  */
  send.allGames(uid);
}

function processAttachment(event, user, uid) {
  //Handling like button
  console.log("Detected Attachment");
  //console.log(event.message.attachments);
  if (event.message.attachments[0].payload.url
    === "https://scontent.xx.fbcdn.net/t39.1997-6/"
    + "851557_369239266556155_759568595_n.png?_nc_ad=z-m"){
    send.menu(uid);
  }
}

function processPostback(event, user, uid) {
  let text = event.postback.payload;
  if (text.substring(0, 4) == "Book") {
    send.book(uid, text);
  } else if(text.substring(0, 6) == "Cancel") {
    send.cancel_booking(uid, text);
  } else if(text.substring(0, 5) == "Share") {
    send.shareGame(uid, text);
  } else if(text.substring(0, 9) == "More Info") {
    send.more_info(uid, text);
  } else {
    switch(text.toLowerCase()) {

      case('start'):
      //send.start(uid);
      Conversation.startConversation(uid, 'onboarding');
      break;

      case("my games"):
      send.my_games(uid);
      break;

      case("notifications"):
      send.notifications(uid);
      break;

      default:
      send.allGames(uid);
    }
  }
}

module.exports = router
