'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const VERIFICATION_TOKEN = "EAACDZA59ohMoBABJdOkXYV0Q7MYE7ZA2U6eXbpCiOZBWytmh66xQ8Sg2yD8hcj61FtqQO4AnsFsZBRZCgXdE1a7eFKQ44v2OjCZC9JYXVbWhuosM5OGdEiZBT4FcdGfd9VZClBljY42ByWbiRxEH0y52RvPVeAo6c4JZBzJDVXcHQoAZDZD"

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

          switch(text.toLowerCase()){
            case ("play" ):
            send_play(sender);
            break;

            default:
            send_text(sender, "Text received, echo: " + text.substring(0, 200))
          }

      }

    })

    res.sendStatus(200)
})


app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

//Sending messages

function send_text(sender, text) {
    let messageData = { text:text }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:VERIFICATION_TOKEN},
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

function send_play(sender) {
    let messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "When do you want to play?",
          "buttons": [
            {
              "type": "postback",
              "title": "Today",
              "payload": "Today"
            },
            {
              "type": "postback",
              "title": "Tomorrow",
              "payload": "Today"
            },
            {
              "type": "postback",
              "title": "Soon",
              "payload": "Today"
            }
          ]
        }
      }
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:VERIFICATION_TOKEN},
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

function send_today(sender){

  send_text(sender, "Awesome, here are my options for today. Tap the card to get directions.");

  let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                      "title": "13:00-1400, 5-Aside, Free",
                      "subtitle": "Whitfield Pl, Kings Cross, London W1T 5JX",
                      "image_url": "https://www.openplay.co.uk/uploads/Cv6mBb44YbRSpaSA-500x_.jpg",
                      "buttons": [{
                          "type": "postback",
                          "title": "Book",
                          "payload": "Book",
                      }],
                  },
                  {
                      "title": "16:00-17:30, 11-Aside, £5",
                      "subtitle": "Corams Fields, 93 Guilford St, London WC1N 1DN",
                      "image_url": "https://www.openplay.co.uk/uploads/356_538f7d4165ba1-500x_.jpg",
                      "buttons": [{
                          "type": "postback",
                          "title": "Book",
                          "payload": "Book",
                      }],
                  }
                ]
            }
        }
    }
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

function send_tomorrow(sender){

}

function send_soon(sender){

}
