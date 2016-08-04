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
  messaging_events.forEach((event) => {
    if (event.message && !event.message.is_echo) {
      let uid = {
        mid: event.sender.id
      };
      let user;
      M.User.find({userId: uid.mid}, (error, results) => {
        if (error) {
          consol.log('Error getting user object: ', error);
        } else if (results.length == 0) {
          console.log('No users with userId "' + uid.mid + '" found.');
        } else if (results.length > 1) {
          console.log('Multiple users with userId "' + uid.mid + '" found.');
        } else { 
          user = results[0];
          uid._id = user._id;
          if (user.phoneNumber) {
            uid.phoneNumber = user.phoneNumber;
          }
        }
        //if text message or quick reply
        if (event.message && event.message.text) {
          if (user.conversationLocation
           && user.conversationLocation.conversationName) {
            Conversation.executeTreeNodefromId(uid, 
              user.conversationLocation.conversationName,
              user.conversationLocation.nodeId + '.1',
              event.message.text);
          } else {
            if (event.message.quick_reply) {
              processQuickReply(event, uid);
            } else {
              processTextMessage(event, uid);
            }
          }
        } else if(event.message && event.message.attachments){
          processAttachment(event, uid);
        } else if (event.postback) {
          processPostback(event, uid);
        }
      });
    }
  });
  res.sendStatus(200);
})

function processQuickReply(event, uid) {
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

function processTextMessage(event, uid) {
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

function processAttachment(event, uid) {
  //Handling like button
  console.log("Detected Attachment");
  //console.log(event.message.attachments);
  if (event.message.attachments[0].payload.url 
    === "https://scontent.xx.fbcdn.net/t39.1997-6/"
    + "851557_369239266556155_759568595_n.png?_nc_ad=z-m"){
    send.menu(uid);
  }
}

function processPostback(event, uid) {
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
      createUser(uid.mid, (error) => {
        if (error) {
          //TODO Handle Error
          console.log('Error creating user:', error);
        } else {
          Conversation.startConversation(uid, 'onboarding');
        }
      });
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

function createUser(mid, callback) {
  var get_url = "https://graph.facebook.com/v2.6/" + mid 
   + "?fields=first_name,last_name,profile_pic,locale,timezone,gender" 
   + "&access_token=" + VERIFICATION_TOKEN;
  request(get_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      let user = M.User({
        userId: mid,
        firstname: body.first_name,
        lastname: body.last_name,
        profile_pic: body.profile_pic,
        locale: body.locale,
        gender: body.gender
      });
      user.save((err) => {
        if (err) {
          console.log('Error creating user: ', err);
          callback(err);
        } else {
          callback();
        }
      });
    }
  });
}

module.exports = router
