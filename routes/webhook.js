'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../server/schemas.js');
const send = require('./../server/send.js');
const sendNew = require('./../server/sendnew.js');
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

router.post('/webhook/', function (req, res) {
  let messaging_events = req.body.entry[0].messaging;

  messaging_events.forEach(function(event){

    let sender = event.sender.id;

    //if text message or quick reply
    if (event.message && event.message.text && !event.message.is_echo) {

      //if quick reply
      if (event.message.quick_reply) {
        let text = event.message.quick_reply.payload;

        if (text.substring(0, 4) == "Book") {
          send.book(sender, text);
        }
        else if (text.substring(0, 6) == "Cancel") {
          send.cancel_booking(sender, text);
        }
        else if (text.substring(0, 9) == "More Info") {
          send.more_info(sender, text);
        }
        else {
          switch(text.toLowerCase()){

            case('start'):
            send.start(sender);
            break;

            case('yep'):
            send.yep(sender);
            break;

            case("notifications"):
            send.notifications(sender);
            break;

            case("my games"):
            send.my_games(sender);
            break;

            case("notifications on"):
            send.notifications_change(sender, "on");
            break;

            case("notifications off"):
            send.notifications_change(sender, "off");
            break;

            default:
            send.allGames(sender);
          }
        }
      }

      // if message
      else {
        // send.processReceivedMessage(sender, event.message.text, () => {
        //   //LUIS Did not find anything, so default response
        //   console.log('Got message: ' + event.message.text + ' from ' + sender);
        //   sendNew.text(sender, "I didn't quite understand that sorry. "
        //    + "Here are all upcoming games. Alternatively, just say 'help'"
        //    + " if you wanna talk to our support team", () => {
        //     M.User.find({userId: sender}, function(err, result){
        //       if(result.length > 0 && result[0].facebookID){
        //         send.allGames(sender);
        //       }
        //       else {
        //         send.start(sender);
        //       }
        //     })
        //   });
        // });

        // M.User.find({userId: sender}, function(err, result){
        //   if(result.length > 0 && result[0].facebookID){
        //     send.allGames(sender);
        //   }
        //   else {
        //     send.start(sender);
        //   }
        // })

        M.User.find({userId: sender}, function(err, result){
          if(result.length > 0){
            send.allGames(sender);
          }
          else {
            send.start(sender);
          }
        })
      }
    }

    else if(event.message && event.message.attachments && !event.message.is_echo){
      console.log("detected attachment");
      //handling like button
      console.log(event.message.attachments);
      if(event.message.attachments[0].payload.url === "https://scontent.xx.fbcdn.net/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m"){
        send.menu(sender);
      }
    }

    else if (event.postback) {
      let text = event.postback.payload;

      if (text.substring(0, 4) == "Book") {
        send.book(sender, text);
      }
      else if(text.substring(0, 6) == "Cancel") {
        send.cancel_booking(sender, text);
      }
      else if(text.substring(0, 9) == "More Info") {
        send.more_info(sender, text);
      }
      else {
        switch(text.toLowerCase()) {

          case('start'):
          send.start(sender);
          break;

          case("my games"):
          send.my_games(sender);
          break;

          case("notifications"):
          send.notifications(sender);
          break;

          default:
          send.allGames(sender);

        }
      }
    }
  })

  res.sendStatus(200);
})

module.exports = router
