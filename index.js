'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const request = require('request')
const multer = require('multer')
const fs = require('fs')
const app = express()


const M = require('./server/schemas.js')
const A = require('./server/analytics.js')
const send = require('./server/send.js')
const AWS = require('aws-sdk');
const VERIFICATION_TOKEN = "EAACDZA59ohMoBABJdOkXYV0Q7MYE7ZA2U6eXbpCiOZBWytmh66xQ8Sg2yD8hcj61FtqQO4AnsFsZBRZCgXdE1a7eFKQ44v2OjCZC9JYXVbWhuosM5OGdEiZBT4FcdGfd9VZClBljY42ByWbiRxEH0y52RvPVeAo6c4JZBzJDVXcHQoAZDZD"
const accessKeyId =  "AKIAIAQYS6UTUGDGOUPA";
const secretAccessKey = "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";

AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

let s3 = new AWS.S3();
let upload = multer({dest:'uploads/'});

app.set('port', (process.env.PORT || 3000))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.send("Hi, I'm the Kickabout chat bot")
})

app.get('/visualize', function (req, res) {
  let now = new Date();
  let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  Promise.all([A.getNewUsersWeekly(currentDate), A.getButtonHitsWeekly(currentDate), A.getNewUsersMonthly(currentDate), A.getButtonHitsMonthly(currentDate)])
  .then(function(answers){
    res.render('visualize', {
      newUsersWeekly: answers[0].join(),
      buttonHitsWeekly: answers[1].join(),
      newUsersMonthly: answers[2].join(),
      buttonHitsMonthly: answers[3].join()
    });
  })
  .catch(function(err){
    console.log(err);
  })
})

app.get('/analytics', function(req, res){
  Promise.all([A.getNewUsers(), A.getNewBookHits(), A.getNewTodayHits(), A.getNewTomorrowHits(), A.getNewSoonHits()])
  .then(function(answers){
    res.render('analytics', {
      users: answers[0],
      book: answers[1],
      today: answers[2],
      tomorrow: answers[3],
      soon: answers[4]
    })
  })
  .catch(function(err){
    console.log(err);
  })
})

app.get('/input', function(req, res){
  res.render('input');
})

app.post('/input', upload.single('image'), function(req, res){

  console.log(req.file);

  let file = req.file
  let imagename = file.filename;

  var params = {
    Bucket: 'kickabout-messenger',
    Key: imagename,
    Body: fs.readFileSync(file.path)
  };

  s3.putObject(params, function (perr, pres) {
    if (perr) {
      console.log("Error uploading data: ", perr);
    }
    else {
      console.log("Successfully uploaded data to myBucket/myKey");
      let urlParams = {Bucket: 'kickabout-messenger', Key: imagename, Expires: 30000000};
      let image_url = s3.getSignedUrl('getObject', urlParams);

      console.log(image_url);

      let data = {
        name: req.body.title,
        address: req.body.address,
        image_url: image_url,
        image_name: imagename,
        latlong: req.body.latlong,
        when: req.body.when,
        capacity: req.body.capacity
      };

      if(req.body.id){
        M.Game.findOneAndUpdate({_id:req.body.id}, data, function(err){
          if(err){
            console.log(err);
          }
        })
      }

      else {
        let game = M.Game(data);

        game.save(function(err){
          if(err){
            console.log(err);
          }
        })
      }
    }
  });

  res.render('input');
});


app.get('/today', function(req, res){
  let now = new Date();
  M.Game.find({when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1)}}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

app.get('/tomorrow', function(req, res){
  let now2 = new Date();
  now2.setDate(now2.getDate()+1);
  M.Game.find({when:{$gt: new Date(now2.getFullYear(), now2.getMonth(), now2.getDate() - 1), $lt: new Date(now2.getFullYear(), now2.getMonth(), now2.getDate()+1)}}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

app.get('/soon', function(req, res){
  let now3 = new Date();
  now3.setDate(now3.getDate()+2);
  M.Game.find({when:{$gt: new Date(now3.getFullYear(), now3.getMonth(), now3.getDate() - 1)}}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.send(result);
    }
  })
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
            let text = event.message.text;
            send.play(sender);
          }
          else {
            send.text(sender, "Sorry, you're not old enough to play");
          }
        })
      }

      else if (event.postback) {
        let text = event.postback.payload;

        if(text.substring(0, 4) == "Book"){

          M.Button.update({name:"Book"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
            console.log(err);
          })

          let rest = text.substring(4);
          let arr = rest.split('|');
          let gameId = arr[2];

          M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: sender}}}, function(){
            send.directions(sender, rest);
          });
        }

        else {
          switch(text.toLowerCase()){

            case("today"):

            let now = new Date();

            M.Button.update({name:"Today"}, {$push: {activity: {userId:sender, time: now}}}, {upsert: true}, function(err){
              console.log(err);
            })

            M.Game.find({when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1)}}, function(err, result){

              let today_data = [];
              result.forEach(function(item){
                let booked = false;
                let join = item.joined;

                join.forEach(function(i){
                  if(i.userId === sender){
                    booked = true;
                  }
                });
                today_data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked]);
              })

              today_data = generate_card(today_data);
              send.cards(sender, today_data, "today");

              send.text(sender, result);
            })
            break;

            case("tomorrow"):
            let now2 = new Date();
            now2.setDate(now2.getDate()+1);

            M.Button.update({name:"Tomorrow"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
              console.log(err);
            })

            M.Game.find({when:{$gt: new Date(now2.getFullYear(), now2.getMonth(), now2.getDate() - 1), $lt: new Date(now2.getFullYear(), now2.getMonth(), now2.getDate()+1)}}, function(err, result){

              let today_data = [];
              result.forEach(function(item){
                let booked = false;
                let join = item.joined;

                join.forEach(function(i){
                  if(i.userId === sender){
                    booked = true;
                  }
                });
                today_data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked]);
              })

              today_data = generate_card(today_data);
              send.cards(sender, today_data, "today");

              send.text(sender, result);
            })
            break;

            case("soon"):
            let now3 = new Date();
            now3.setDate(now3.getDate()+2);

            M.Button.update({name:"Soon"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
              console.log(err);
            })

            M.Game.find({when:{$gt: new Date(now3.getFullYear(), now3.getMonth(), now3.getDate() - 1)}}, function(err, result){

              let today_data = [];
              result.forEach(function(item){
                let booked = false;
                let join = item.joined;

                join.forEach(function(i){
                  if(i.userId === sender){
                    booked = true;
                  }
                });
                today_data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked]);
              })

              today_data = generate_card(today_data);
              send.cards(sender, today_data, "today");

              send.text(sender, result);
            })
            break;

            case("yep"):

            M.Button.update({name:"Yep"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
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
                      send.age(sender);
                      console.log("saved it!");
                    }
                  })
                }
            });
            break;

            case("over"):
            M.Button.update({name:"Eligible"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
              console.log(err);
            })
            M.User.update({userId: sender}, {eligible: true}, function(){
              send.play(sender);
            });
            break;

            case("notover"):
            M.Button.update({name:"Not Eligible"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
              console.log(err);
            })
            M.User.update({userId: sender}, {eligible: false}, function(){
              send.text(sender, "Sorry, you're not old enough");
            });
            break;

            default:
            send.play(sender);
          }
        }
      }

    })

    res.sendStatus(200)
})


app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'));
})





//////////// Data for sending

function generate_card_element(name, address, image_url, latlong, gameId, attending, capacity, booked){

  let pl = "Book" + address + "|" + latlong + "|" + gameId;

  let directions_link = "http://maps.google.com/?q=" + address;

  if (attending > 0){
    address = address + " (" + attending + " attending)";
  }

  if(attending == capacity || booked){
    if(attending == capacity){
      address = address + " (fully booked)";
    }
    if(booked){
      address = address + " (You're going)";
    }
    let template = {
      "title": name,
      "subtitle": address,
      "image_url": image_url,
      "item_url": directions_link,
    }
    return template;
  }
  else {

    let template = {
      "title": name,
      "subtitle": address,
      "image_url": image_url,
      "item_url": directions_link,
      "buttons": [{
          "type": "postback",
          "title": "Book",
          "payload": pl,
      }],
    }

    return template;
  }
}

function generate_card(array){
  let elements = [];
  array.forEach(function(item){
    //name, address, image_url, latlong, gameId, attending, capacity, booked
    elements.push(generate_card_element(item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]));
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
