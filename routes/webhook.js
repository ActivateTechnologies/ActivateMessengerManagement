'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../server/schemas.js');
const send = require('./../server/send.js');
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
    console.log('GOT Message: ', JSON.stringify(req.body.entry));
    let messaging_events = req.body.entry[0].messaging

    messaging_events.forEach(function(event){
      let sender = event.sender.id;
      if (event.optin) {
        console.log("optin");
        console.log(event.optin.ref);
        send.publicLink(sender, event.optin.ref);
      }
      else if (event.message && event.message.text && !event.message.is_echo) {

        //console.log('Got message: ' + event.message.text + ' from ' + sender);
        M.User.find({userId: sender}, function(err, result){
          if(result.length > 0){
            send.processReceivedMessage(event.message.text, sender);
            //send.allGames(sender);
          }
          else {
            console.log('Going to call send.start()')
            send.start(sender);
          }
        })
      }
      else if (event.postback) {
        let text = event.postback.payload;

        if(text.substring(0, 4) == "Book"){
          send.book(sender, text);
        }

        else if(text.substring(0, 6) == "Cancel"){
          send.cancel_booking(sender, text);
        }

        else if(text.substring(0, 9) == "More Info"){
          send.more_info(sender, text);
        }

        else {
          switch(text.toLowerCase()){

            case('start'):
            send.start(sender);
            break;

            case("yep"):
            send.yep(sender);
            break;

            default:
            send.allGames(sender);

          }
        }
      }

    })

    res.sendStatus(200)
})

module.exports = router
