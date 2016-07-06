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
const AWS = require('aws-sdk');

// For main Activate Messenger App
const VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD"
const FACEBOOK_APP_ID = "144481079297226"
const FACEBOOK_APP_SECRET = "177f41bf5495e3673481700e4ec6995d"

//for Kicabout messenger page and test app
// const VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD"
// const FACEBOOK_APP_ID = "159289771143437"
// const FACEBOOK_APP_SECRET = "56cabb5a4f98662b998e4849d01bb826"

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

//home
app.use(require('./routes/analytics'))
app.use(require('./routes/visualize'))
app.use(require('./routes/games'))

// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     profileFields: ['id', 'displayName', 'email', 'birthday']
//   },
//   function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function(){
//       console.log(req.query);
//       var birthday = new Date(profile._json.birthday);
//       var now = new Date();
//
//       if(now.getFullYear() - birthday.getFullYear() > 16){
//         M.User.find({facebookID: profile.id}, function(e, result){
//           if(e)
//             console.log(e);
//
//           if(result.length < 1){
//             let user = M.User({
//               facebookID: profile.id,
//               name: profile.displayName,
//               email: profile.emails[0].value
//             })
//
//             user.save(function(err){
//               if(err){
//                 console.log(err);
//                 done(err);
//               } else {
//                 console.log("saved");
//                 done(null, user);
//               }
//             })
//           }
//           else {
//             done(null, profile);
//           }
//         })
//
//       }
//       else {
//         console.log("not old enough to use the app");
//         done(null, profile);
//       }
//     })
//   }
// ));

// app.get('/facebook', function(req, res, next){
//   passport.authenticate('facebook',{
//     callbackURL: (req.query.redirect_uri),
//     session: false,
//     scope: ['email', 'user_birthday']
//   })(req, res, next);
// })

// app.get('/callback', function(req, res, next){
//   passport.authenticate('facebook', {
//     session: false,
//     successRedirect: '/profile',
//     failureRedirect: '/analytics'
//   })(req, res, next);
// })
//
// app.get('/profile', function(req, res){
//   res.send(req.user)
// })

// app.get('/pay:gameId', function(req, res){
//   res.render('/payment', {
//     gameId: req.params.version
//   });
// })
//
// app.post('/pay', function(req, res){
//   let gameId = req.body.gameId;
// })

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


let server = app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'));
})

module.exports = server;

// heroku git:remote -a limitless-sierra-68694
