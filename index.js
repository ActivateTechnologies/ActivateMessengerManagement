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

  let game = M.Game({
    name: req.body.name,
    address: req.body.address,
    image_url: req.body.image_url,
    latlong: req.body.latlong
  });

  game.save(function(err){
    if(err){
      console.log(err);
    }
    else {
      today_data_generator = []
      M.Game.find({}, function(err, result){
        result.forEach((i) => {
          let temp = [i.name, i.address, i.image_url, i.latlong];
          today_data_generator.push(temp);
        })
        today_data = generate_card(today_data_generator);
      })
    }
  })
});

app.post('/clearall', function(req, res){
  M.Game.remove({}, function(err, result){
    if(err){
      console.log(err);
    }
  })
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
        M.User.find({userId: sender}, function(err, result){
          if(result[0].eligible){
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
          else {
            send_text(sender, "Sorry, you're not old enough to play");
          }
        })
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

            var get_url = "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;

            request(get_url, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                  body = JSON.parse(body);

                  let user = M.User({
                    userId: sender,
                    firstname: body.first_name,
                    lastname: body.last_name,
                    profile_pic: body.profile_pic,
                    locale: body.locale,
                    gender: body.gender
                  })

                  user.save(function(err){
                    if(err){
                      console.log(err);
                    } else {
                      send_age(sender);
                      console.log("saved it!");
                    }
                  })
                }
            });
            break;

            case("over"):
            M.User.update({userId: sender}, {eligible: true}, function(){
              send_text(sender, "set");
            });
            break;

            case("notover"):
            M.User.update({"userId": sender}, {"eligible": false}), function(){
              send_text(sender, "Sorry, not old enough");
            };
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

function send_age(sender){
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "Are you over 16?",
        "buttons": [
          {
            "type": "postback",
            "title": "Yes",
            "payload": "over"
          },
          {
            "type": "postback",
            "title": "No",
            "payload": "notover"
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

function send_location(sender, text){

}


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


// arrays for handling the games

let today_data_generator = []
let today_data = [];
