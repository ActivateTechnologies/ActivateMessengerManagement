'use strict'

const VERIFICATION_TOKEN = "EAACDZA59ohMoBABJdOkXYV0Q7MYE7ZA2U6eXbpCiOZBWytmh66xQ8Sg2yD8hcj61FtqQO4AnsFsZBRZCgXdE1a7eFKQ44v2OjCZC9JYXVbWhuosM5OGdEiZBT4FcdGfd9VZClBljY42ByWbiRxEH0y52RvPVeAo6c4JZBzJDVXcHQoAZDZD"
const request = require('request')

module.exports = {

  default(sender) {
      let messageData = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": "How can I help you?",
            "buttons": [
              {
                "type": "postback",
                "title": "Play Football",
                "payload": "play"
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
  },

  text(sender, text) {
      let messageData = { text: text }

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
  },

  play(sender) {
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
  },

  today(sender){

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
  },

  tomorrow(sender){

  },

  soon(sender){

  }

}
