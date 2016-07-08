'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../server/schemas.js')
const send = require('./../server/send.js')
const request = require('request')

// For main Activate Messenger App
// const VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD"
// const FACEBOOK_APP_ID = "144481079297226"
// const FACEBOOK_APP_SECRET = "177f41bf5495e3673481700e4ec6995d"

//for Kicabout messenger page and test app
const VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD"
const FACEBOOK_APP_ID = "159289771143437"
const FACEBOOK_APP_SECRET = "56cabb5a4f98662b998e4849d01bb826"

router.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

router.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging

    messaging_events.forEach(function(event){

      let sender = event.sender.id

      if (event.optin) {
        console.log("optin");
        console.log(event.optin.ref);
        send.text(sender, event.optin.ref);
      }

      console.log('1');

      else if (event.message && event.message.text) {
        console.log('2');
        M.User.find({userId: sender}, function(err, result){
          console.log('3');
          if(result.length > 0){
            console.log('4');
            send.processReceivedMessage(event.message, sender);
          }
          else {
            console.log('5');
            send.start(sender);
          }
        })
      }

      else if (event.postback) {
        let text = event.postback.payload;

        if(text.substring(0, 4) == "Book"){
          send.book(sender, text);
        }

        if(text.substring(0, 6) == "Cancel"){
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
