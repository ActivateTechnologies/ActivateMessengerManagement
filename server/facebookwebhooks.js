'use strict'

const M = require('./../server/schemas.js');
const Send = require('./../server/send.js');
const Twilio = require('./../server/twilio.js');
const Conversation = require('./../server/conversation.js');
const Config = require('./../config');
const request = require('request');

function processGetWebhook(req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
}

function processPostWebhook(req, res) {
  let messaging_events = req.body.entry[0].messaging;
  messaging_events.forEach((event) => {
    if ((!event.message || !event.message.is_echo) 
     && !event.read && !event.delivery) {
      /*console.log(event);
      console.log("--------------------------------");*/
      let uid = { mid: event.sender.id };
      let user;
      M.User.find({mid: uid.mid}, (error, results) => {
        if (error) {
          console.log('Error getting user object: ', error);
        } else if (results.length == 0) {
          console.log('No users with mid "' + uid.mid + '" found.');
          createUser(uid.mid, (newUid, error) => {
            if (error) {
              //TODO Handle Error
              console.log('Error creating user:', error);
            } else {
              Conversation.startConversation(newUid, 'onboarding');
            }
          });
        } else if (results.length > 1) {
          console.log('Multiple users with mid "' + uid.mid + '" found.');
        } else {
          user = results[0];
          uid._id = user._id;
          if (user.phoneNumber) {
            uid.phoneNumber = user.phoneNumber;
          }
          if (user && !uid.phoneNumber && user.conversationLocation
           && user.conversationLocation.conversationName != 'onboarding'
           && user.conversationLocation.conversationName != 'collectPhoneNumber') {
            Conversation.startConversation(uid, 'collectPhoneNumber');
          } else if (!Conversation.consumeWebhookEvent(event, uid, user)) {
            if (event.message && event.message.text && event.message.quick_reply) {
                processQuickReply(event, uid);
            } else if (event.message && event.message.text && !event.message.quick_reply) {
                processTextMessage(event, uid);
            } else if(event.message && event.message.attachments){
              processAttachment(event, uid);
            } else if (event.postback) {
              processPostback(event, uid);
            }
          }
        }
      });
    }
  });
  res.sendStatus(200);
}

function processOptin(optin) {
  console.log('optin.ref:', optin.ref);
}

function processQuickReply(event, uid) {
  let payload = event.message.quick_reply.payload;
  if (payload.substring(0, 16) == "conversationName") {
    Conversation.handleQuickReply(uid, payload);
  } else if (payload.substring(0, 4) == "Book") {
    Send.book(uid, payload);
  } else if (payload.substring(0, 6) == "Cancel") {
    Send.cancelBooking(uid, payload);
  } else if (payload.substring(0, 9) == "More Info") {
    Send.moreInfo(uid, payload);
  } else if (payload.substring(0, 11) == "phoneNumber") {
    let arr = text.split('|');
    let phoneNumber = arr[1];
    let eventId = arr[2];
    Send.registerUser(uid, phoneNumber, eventId);
  } else {
    switch(payload.toLowerCase()){

      case('start'):
      Send.start(uid);
      break;

      case('yep'):
      Send.yep(uid);
      break;

      case("notifications"):
      Send.notifications(uid);
      break;

      case("my events"):
      Send.myEvents(uid);
      break;

      case("notifications on"):
      Send.notificationsChange(uid, "on");
      break;

      case("notifications off"):
      Send.notificationsChange(uid, "off");
      break;

      default:
      Send.allEvents(uid);
    }
  }
}

function processTextMessage(event, uid) {
  /*Send.processReceivedMessage(uid, event.message.text, () => {
    //LUIS Did not find anything, so default response
    console.log('Got message: ' + event.message.text + ' from ' + uid.mid);
    sendNew.text(uid.mid, "I didn't quite understand that sorry. "
     + "Here are all upcoming events. Alternatively, just say 'help'"
     + " if you wanna talk to our support team", () => {
      M.User.find({userId: uid.mid}, function(err, result){
        if(result.length > 0 && result[0].facebookID){
          Send.allEvents(uid);
        }
        else {
          Send.start(uid);
        }
      })
    });
  });
  */
  Send.allEvents(uid);
}

function processAttachment(event, uid) {
  //Handling like button
  console.log("Detected Attachment");
  //console.log(event.message.attachments);
  if (event.message.attachments[0].payload.url
    === "https://scontent.xx.fbcdn.net/t39.1997-6/"
    + "851557_369239266556155_759568595_n.png?_nc_ad=z-m"){
    Send.menu(uid);
  }
}

function processPostback(event, uid) {
  let text = event.postback.payload;
  if (text.substring(0, 4) == "Book") {
    Send.book(uid, text);
  } else if(text.substring(0, 6) == "Cancel") {
    Send.cancelBooking(uid, text);
  } else if(text.substring(0, 5) == "Share") {
    Send.shareEvent(uid, text);
  } else if(text.substring(0, 9) == "More Info") {
    Send.moreInfo(uid, text);
  } else {
    switch(text.toLowerCase()) {

      case('start'):
      //Send.start(uid);
      createUser(uid.mid, (newUid, error) => {
        if (error) {
          //TODO Handle Error
          console.log('Error creating user:', error);
        } else {
          Conversation.startConversation(newUid, 'onboarding');
        }
      });
      break;

      case("my events"):
      Send.myEvents(uid);
      break;

      case("notifications"):
      Send.notifications(uid);
      break;

      default:
      Send.allEvents(uid);
    }
  }
}

function createUser(mid, callback) {
  M.User.find({mid: mid}).sort('signedUpDate').exec((error, results) => {
    if (!error && results.length > 0) {
      console.log('User already exists');
      callback({
        _id: results[0].id,
        mid: mid
      })
    } else {
      console.log('Going to create used with mid "' + mid + '"');
      var get_url = "https://graph.facebook.com/v2.6/" + mid
       + "?fields=first_name,last_name,profile_pic,locale,timezone,gender"
       + "&access_token=" + Config.VERIFICATION_TOKEN;
      request(get_url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          let user = M.User({
            mid: mid,
            firstName: body.first_name,
            lastName: body.last_name,
            profilePic: body.profile_pic,
            locale: body.locale,
            gender: body.gender,
            events: [],
            //TODO: Remove when actually using phone numbers:
            phoneNumber: '+44' + mid.substring(0,10), 
            signedUpDate: new Date()
          });
          user.save((err) => {
            if (err) {
              console.log('Error creating user: ', err);
              callback(null, err);
            } else {
              M.Analytics.update({name:"NewUsers"},
              {$push: {activity: {uid:user._id, time: new Date()}}},
              {upsert: true}, (err) => {
                if (err) {
                  console.log('Error saving analytics for "NewUsers":', err);
                }
              });
              callback({
                _id: user.id,
                mid: mid
              });
            }
          });
        } else {
          let errorObject = (error) ? error : response.body.error;
          if (errorObject) {
            console.log('Error retrieving user\s facebook details:', errorObject);
          }
        }
      });
    }
  });
}

module.exports = {
  processPostWebhook: processPostWebhook,
  processGetWebhook: processGetWebhook
}
