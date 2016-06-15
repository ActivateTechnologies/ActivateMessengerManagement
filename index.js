'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const M = require('./schemas.js')
const VERIFICATION_TOKEN = "EAACDZA59ohMoBABJdOkXYV0Q7MYE7ZA2U6eXbpCiOZBWytmh66xQ8Sg2yD8hcj61FtqQO4AnsFsZBRZCgXdE1a7eFKQ44v2OjCZC9JYXVbWhuosM5OGdEiZBT4FcdGfd9VZClBljY42ByWbiRxEH0y52RvPVeAo6c4JZBzJDVXcHQoAZDZD"
const PAGE_ID = "245261069180348"


app.set('port', (process.env.PORT || 3000))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.send("Hi, I'm the Kickabout chat bot")
})

app.get('/input', function(req, res){
  res.render('input');
})

app.post('/input', function(req, res){
  let element = [req.body.name, req.body.address, req.body.image_url, req.body.latlong];
  today_data_generator.push(element);
  today_data = generate_card(today_data_generator);
  console.log(today_data);

  let game = M.Game({
    name: req.body.name,
    address: req.body.address,
    image_url: req.body.image_url,
    latlong: req.body.latlong
  });

  game.save(function(err){
    if(err){
      console.log(err);
    } else {
      console.log("saved it!");
    }
  })

});

app.post('/clearall', function(req, res){
  today_data = [];
  console.log("Cleared today data");
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
          case("today"):
          send_today(sender, today_data);
          break;

          case("tomorrow"):
          send_tomorrow(sender, tomorrow_data);
          break;

          case("soon"):
          send_soon(sender), soon_data;
          break;

          default:
          send_play(sender);
        }
      }

      else if (event.postback) {
        let text = event.postback.payload;

        if(text.substring(0, 4) == "Book"){
          send_directions(sender, text.substring(4));
        }

        else {
          switch(text.toLowerCase()){

            case("today"):
            send_today(sender, today_data);
            break;

            case("tomorrow"):
            send_tomorrow(sender, tomorrow_data);
            break;

            case("soon"):
            send_soon(sender, soon_data);
            break;

            case("yep"):
            //send_play(sender);
            let result = "";
            let check = "";

            var get_url = "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;

            request.get(get_url)
              .on('response', function(response){
                result = JSON.stringify(response);
                check = "reached"
              })
              .pipe()

            send_text(sender, sender);
            send_text(sender, result);
            send_text(sender, check);

            break;

            default:
            send_play(sender);
          }
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
              "payload": "Tomorrow"
            },
            {
              "type": "postback",
              "title": "Soon",
              "payload": "Soon"
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

function send_today(sender, today_data){

  send_text(sender, "Awesome, here are my options for today. Tap the card to get directions.");

  let messageData = today_data;

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

function send_directions(sender, val){

  let arr = val.split("|")
  let address = arr[0]
  let latlong = arr[1]

  let image_link = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlong +
                      "&zoom=15&size=300x300&markers=" + latlong

  let directions_link = "http://maps.google.com/?q=" + address

  let messageData = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Thanks for booking. Here are your directions",
                  "image_url": image_link,
                  "item_url": directions_link,
                  "buttons": [{
                      "type": "web_url",
                      "title": "Directions",
                      "url": directions_link,
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
}





//////////// Data for sending

function generate_card_element(name, address, image_url, latlong){

  let pl = "Book" + address + "|" + latlong;

  var template = {
    "title": name,
    "subtitle": address,
    "image_url": image_url,
    "buttons": [{
        "type": "postback",
        "title": "Book",
        "payload": pl,
    }],
  }

  return template;
}

function generate_card(array){
  let elements = [];
  array.forEach(function(item){
    //name, address, image_url, latlong
    elements.push(generate_card_element(item[0], item[1], item[2], item[3]));
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



//example
// ["13:00-1400, 5-Aside, Free", "Whitfield Pl, Kings Cross, London W1T 5JX", "https://www.openplay.co.uk/uploads/Cv6mBb44YbRSpaSA-500x_.jpg", "51.524850, -0.132202"],
// ["16:00-17:30, 11-Aside, £5", "Corams Fields, 93 Guilford St, London WC1N 1DN", "https://www.openplay.co.uk/uploads/356_538f7d4165ba1-500x_.jpg", "51.524281, -0.119884"]


let today_data_generator = []
let today_data = generate_card(today_data_generator);
