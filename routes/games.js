'use strict'

const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const AWS = require('aws-sdk');
const M = require('./../server/schemas.js')
const config = require('./../config')
const send = require('./../server/send.js')

const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;

AWS.config.update({
    accessKeyId: config.AWSaccessKeyId,
    secretAccessKey: config.AWSsecretAccessKey
});

let s3 = new AWS.S3();
let upload = multer({dest:'uploads/'});

router.get('/input', function(req, res){
  res.render('input');
})

router.post('/input', upload.single('image'), function(req, res){

  if(req.file){
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
        res.send(perr);
      }
      else {
        console.log("Successfully uploaded data to myBucket/myKey");
        let urlParams = {Bucket: 'kickabout-messenger', Key: imagename, Expires: 30000000};
        let image_url = s3.getSignedUrl('getObject', urlParams);

        let data = {
          name: req.body.title,
          address: req.body.address,
          image_url: image_url,
          image_name: imagename,
          latlong: req.body.latlong,
          desc: req.body.desc,
          when: req.body.when,
          capacity: req.body.capacity,
          non_members_attending: req.body.non_members_attending,
          price: parseFloat(req.body.price)
        };

        if(req.body.id){
          console.log("Editing game");

          M.Game.findOneAndUpdate({_id:req.body.id}, data, function(err){
            if(err){
              console.log(err);
            }
            res.render('input');
          })
        }

        else {
          console.log("Adding game");
          let game = M.Game(data);

          game.save(function(err){
            if(err){
              console.log(err);
            }
            res.render('input');
          })
        }
      }

    });
  }

  else {
    let data = {
      name: req.body.title,
      address: req.body.address,
      latlong: req.body.latlong,
      desc: req.body.desc,
      when: req.body.when,
      capacity: req.body.capacity,
      non_members_attending: req.body.non_members_attending,
      price: parseFloat(req.body.price)
    };

    M.Game.findOneAndUpdate({_id:req.body.id}, data, function(err){
      if(err){
        console.log(err);
      }
      res.render('input');
    })
  }
});

router.delete('/input', function(req, res){
  M.Game.findOneAndRemove({_id:req.query.gid}, function(err){
    if(err){
      console.log(err);
    }
    console.log("deleted game");
    res.send("deleted game")
  })
});

router.get('/game', function(req, res){
  M.Game.find({_id:req.query.gid}, function(err, result){
    if(err){
      console.log(err);
    }
    if(result.length > 0){
      res.render('game', {
        gid: req.query.gid,
        gameName: result[0].name,
        gameAddress: result[0].address,
        imageLink: result[0].image_url
      });
    } else {
      res.render('game', {
        gid: req.query.gid,
        gameName: "Kickabout Game",
        gameAddress: "",
        imageLink: "http://limitless-sierra-68694.herokuapp.com/img/testimage.png"
      })
    }
  })
});

router.post('/check', function(req, res){
  console.log("Reached check");
  let fbid = req.query.fbid;
  let gameId = req.query.gid;

  M.User.find({facebookID: fbid}, function(err, result){
    if(result.length > 0){
      send.game(result[0].userId, gameId)
      res.send("Cool")
    }
    else {
      let user = M.User({
        facebookID: fbid,
        publicLink: gameId
      })
      user.save(function(err){
        if(err){
          console.log(err);
        } else {
          console.log("saved user");
          res.send("Cool")
        }
      })
    }
  })
})

router.get('/register', function(req, res){
  res.render('register')
})

router.post('/register', function(req, res){

  console.log("Reached register");
  let fbid = req.query.fbid;
  let mid = req.query.mid;

  M.User.find({facebookID: fbid}, function(err, result){
    if(result.length > 0){

        var get_url = "https://graph.facebook.com/v2.6/" + sender + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;
        request(get_url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              body = JSON.parse(body);

              let user = M.User({
                userId: sender,
                facebookID: fbid,
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
                  console.log("saved new user");
                }
              })
            }
        });

    }

    else {

      var get_url = "https://graph.facebook.com/v2.6/" + mid + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;
      request(get_url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

            let user = M.User({
              userId: mid,
              facebookID: fbid,
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
                console.log("saved new user");
              }
            })
          }
      });

    }
  })
  res.send("Cool")
})


router.get('/players', function(req, res){
  M.Game.find({_id:req.query.gid}, function(err, games){
    if(err){
      res.send([]);
    }
    else if (games[0].joined && games[0].joined.length) {
      var playerIds = [];
      games[0].joined.forEach(function(player, i) {
        playerIds.push(player._id);
      });
      M.User.find({_id:{ $in : playerIds}}, function(err, users){
        if(err){
          console.log(err);
        }
        res.send(users)
      })
    } else {
      res.send([]);
    }
  });
});

router.get('/today', function(req, res){
  let now = new Date();
  M.Game.find({when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1)}}, function(err, result){
    if(err){
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

router.get('/tomorrow', function(req, res){
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

router.get('/soon', function(req, res){
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

module.exports = router
