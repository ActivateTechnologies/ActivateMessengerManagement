'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const VERIFICATION_TOKEN = "EAACDZA59ohMoBABJdOkXYV0Q7MYE7ZA2U6eXbpCiOZBWytmh66xQ8Sg2yD8hcj61FtqQO4AnsFsZBRZCgXdE1a7eFKQ44v2OjCZC9JYXVbWhuosM5OGdEiZBT4FcdGfd9VZClBljY42ByWbiRxEH0y52RvPVeAo6c4JZBzJDVXcHQoAZDZD"
const PAGE_ID = "245261069180348"
const send = require('./reply_functions')


app.set('port', (process.env.PORT || 3000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.send("Hi, I'm the Kickabout chat bot")
})

// for Facebook verification
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});




app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging

    messaging_events.forEach(function(event){

      let sender = event.sender.id

      if (event.message && event.message.text) {
        let text = event.message.text

        sendTextMessage(sender, "Received");

        // switch(text.toLowerCase()){
        //   case("play"):
        //   send.play(sender);
        //   break;
        //
        //   case("today"):
        //   send.today(sender);
        //   break;
        //
        //   case("tomorrow"):
        //   send.tomorrow(sender);
        //   break;
        //
        //   case("soon"):
        //   send.soon(sender);
        //   break;
        //
        //   default:
        //   send.default(sender);
        // }
      }

      else if (event.postback) {
        let text = event.postback.payload;

        switch(text.toLowerCase()){
          case("play"):
          send.play(sender);
          break;

          case("today"):
          send.today(sender);
          break;
        }
      }

    })

    res.sendStatus(200)
})


app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
})

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
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
