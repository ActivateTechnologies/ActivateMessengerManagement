'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express()

const M = require('./server/schemas.js')
const AWS = require('aws-sdk');

const config = require('./config')
const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;
const FACEBOOK_APP_ID = config.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = config.FACEBOOK_APP_SECRET;

AWS.config.update({
    accessKeyId: config.AWSaccessKeyId,
    secretAccessKey: config.AWSsecretAccessKey
});

let s3 = new AWS.S3();
let upload = multer({dest:'uploads/'});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("reached");
    if (username === "admin" && password === "letmebroadcast"){
      console.log("correct");
      return done(null, [])
    }
    else {
      console.log("incorrect");
      return done(null, false)
    }
  }
));


app.set('port', (process.env.PORT || 3000))
app.set('view engine', 'ejs')

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes/analytics'))
app.use(require('./routes/visualize'))
app.use(require('./routes/games'))
app.use(require('./routes/webhook'))
app.use(require('./routes/payment'))
app.use(require('./routes/game'))
app.use(require('./routes/check'))
app.use(require('./routes/broadcast'))

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'
                                 })
);

app.get('/', function(req, res){
  res.render('home')
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
        capacity: req.body.capacity,
        price: parseFloat(req.body.price)
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
