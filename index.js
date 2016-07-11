'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const app = express()

const M = require('./server/schemas.js')
const AWS = require('aws-sdk');

// For main Kickabout App
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
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes/analytics'))
app.use(require('./routes/visualize'))
app.use(require('./routes/games'))
app.use(require('./routes/webhook'))
app.use(require('./routes/payment'))
app.use(require('./routes/game'))



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

// heroku git:remote -a limitless-sierra-68694
