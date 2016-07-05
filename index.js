'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const request = require('request')
const multer = require('multer')
const fs = require('fs')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const app = express()


const M = require('./server/schemas.js')
const A = require('./server/analytics.js')
const send = require('./server/send.js')
const AWS = require('aws-sdk');

// For main Activate Messenger App
// const VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD"
// const FACEBOOK_APP_ID = "144481079297226"
// const FACEBOOK_APP_SECRET = "177f41bf5495e3673481700e4ec6995d"

//for Kicabout messenger page
const VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD"
//for the activate messenger test app
const FACEBOOK_APP_ID = "159289771143437"
const FACEBOOK_APP_SECRET = "56cabb5a4f98662b998e4849d01bb826"

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
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://kickabouttest.herokuapp.com/callback",
    profileFields: ['id', 'displayName', 'email', 'birthday']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      var birthday = new Date(profile._json.birthday);
      var now = new Date();

      if(now.getFullYear() - birthday.getFullYear() > 16){
        M.User.find({facebookID: profile.id}, function(e, result){
          if(e)
            console.log(e);

          if(result.length < 1){
            let user = M.User({
              facebookID: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value
            })

            user.save(function(err){
              if(err){
                console.log(err);
                done(err);
              } else {
                console.log("saved");
                done(null, user);
              }
            })
          }
          else {
            done(null, profile);
          }
        })

      }
      else {
        console.log("not old enough to use the app");
        done(null, profile);
      }
    })
  }
));


app.get('/', function (req, res) {
  res.send("Hi, I'm the Kickabout chat bot")
})

app.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email', 'user_birthday'] }));

app.get('/callback', passport.authenticate('facebook', {
  session: false,
  successRedirect: '/profile',
  failureRedirect: '/analytics'
}));

app.get('/profile', function(req, res){
  res.send(req.user)
})

app.get('/pay:gameId', function(req, res){
  res.render('/payment', {
    gameId: req.params.version
  });
})

app.post('/pay', function(req, res){
  let gameId = req.body.gameId;
})

app.get('/visualize', function (req, res) {
  let now = new Date();
  let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  Promise.all([A.getNewUsersWeekly(currentDate), A.getButtonHitsWeekly(currentDate), A.getNewUsersMonthly(currentDate), A.getButtonHitsMonthly(currentDate)])
  .then(function(answers){
    res.render('visualize', {
      newUsersWeekly: answers[0],
      buttonHitsWeekly: answers[1],
      newUsersMonthly: answers[2],
      buttonHitsMonthly: answers[3]
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

app.get('/policy', function(req, res){
  res.render('policy');
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
        desc: req.body.desc,
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

      console.log(JSON.stringify(event));

      let sender = event.sender.id;
      console.log(sender);

      if (event.message && event.message.text) {

        //add check here to find if user exists

        send.text(sender, "Hi, there");
      }

      else if (event.postback) {
        let text = event.postback.payload;

        if(text.substring(0, 4) == "Book"){

          M.Button.update({name:"Book"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
            console.log(err);
          })

          let rest = text.substring(4);
          let arr = rest.split('|');
          let gameId = arr[1];

          M.Game.find({_id:gameId}, function(err, result){
            let check = true;
            if(result.length > 0){
              result[0].joined.forEach(function(i){
                if(i.userId === sender){
                  check = false;
                  send.text(sender, "You've already booked the game.");
                }
              })
              if(check){
                M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: sender}}}, function(){
                  send.booked(sender);
                });
              }
            }
          })
        }

        else if(text.substring(0, 9) == "More Info"){
          M.Button.update({name:"More Info"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
            console.log(err);
          })

          let rest = text.substring(9);
          console.log(rest);

          let arr = rest.split('|');
          let name = arr[1];
          let address = arr[2];
          let latlong = arr[3];
          let gameId = arr[4];
          let description = arr[5];

          console.log(arr);
          console.log("desc");
          console.log(description);

          send.directions(sender, name, address, latlong)
          .then(function(success){
            send.cards(sender, send.generate_card_for_booking(gameId, description));
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

            M.Button.update({name:"Yep"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
              console.log(err);
            })
            send.text(sender, "some text");
            send.link(sender);

            break;

            default:
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
                today_data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked, item.desc, item.when]);
              })

              today_data = send.generate_card(today_data);
              send.cards(sender, today_data, "today");
            })

          }
        }
      }

    })

    res.sendStatus(200)
})


let server = app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'));
})

module.exports = server;
