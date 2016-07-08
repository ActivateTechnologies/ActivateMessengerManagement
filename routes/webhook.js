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

      if (event.message && event.message.text) {
        M.User.find({userId: sender}, function(err, result){
          if(result.length > 0){
            console.log("-----------------------------------------------------")
            console.log(JSON.stringify(results.length));
            sendAllGames(sender);
          }
          else {
            send.start(sender);
          }
        })
      }

      else if (event.postback) {
        let text = event.postback.payload;

        if(text.substring(0, 4) == "Book"){

          M.Button.update({name:"Book"},
            {$push: {activity: {userId:sender, time: new Date()}}},
            {upsert: true},
            function(err){
              console.log(err);
            })

          let rest = text.substring(4);
          let arr = rest.split('|');
          let gameId = arr[1];

          M.Game.find({_id:gameId}, function(err, result){
            let check = true;
            if(result.length > 0){
              M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: sender}}}, function(){
                send.booked(sender);
              });
            }
          })
        }

        else if(text.substring(0, 9) == "More Info"){
          M.Button.update({name:"More Info"},
            {$push: {activity: {userId:sender, time: new Date()}}},
            {upsert: true},
            function(err){
              console.log(err);
            })

          let rest = text.substring(9);

          let arr = rest.split('|');
          let name = arr[1];
          let address = arr[2];
          let latlong = arr[3];
          let gameId = arr[4];
          let description = arr[5];
          let price = arr[6];

          send.directions(sender, name, address, latlong)
          .then(function(success){
            send.cards(sender, send.generate_card_for_booking(sender, gameId, description, price));
          })
          .catch(function(err){
            console.log(err);
          })
        }

        else {
          switch(text.toLowerCase()){

            case('start'):
            send.start(sender);
            break;

            case("yep"):
            yep(sender);
            break;

            default:
            // send.play(sender);
            sendAllGames(sender);

          }
        }
      }

    })

    res.sendStatus(200)
})

function sendAllGames(sender){
  let now = new Date();

  M.Game.find({when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)}}, function(err, result){

    let today_data = [];
    result.forEach(function(item){
      let booked = false;
      let join = item.joined;

      join.forEach(function(i){
        if(i.userId === sender){
          booked = true;
        }
      });
      today_data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked, item.desc, item.when, item.price]);
    })

    today_data = send.generate_card(today_data);
    send.cards(sender, today_data, "today");
  })
}

function yep(sender){
  M.Button.update({name:"Yep"},
    {$push: {activity: {userId:sender, time: new Date()}}},
    {upsert: true},
    function(err){
      console.log(err);
    })

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
            sendAllGames(sender);
            console.log("saved it!");
          }
        })
      }
  });
}

module.exports = router
