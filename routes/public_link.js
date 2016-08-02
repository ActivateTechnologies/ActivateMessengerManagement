'use strict'

const express = require('express')
const router = express.Router()

const request = require('request')
const M = require('./../server/schemas.js')
const send = require('./../server/send.js')

const VERIFICATION_TOKEN = require('./../config').VERIFICATION_TOKEN

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
          res.send("Not Cool")
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
    //if user has facebookID
    if(result.length > 0){
        //if user also has messenger id
        if(result[0].userId){
          send.text(mid, "Successfully logged in")
          res.send("Cool")
        }

        //if user has visited public link
        else if(result[0].publicLink){

          var get_url = "https://graph.facebook.com/v2.6/" + mid + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;
          request(get_url, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                body = JSON.parse(body);

                let user = {
                  userId: mid,
                  firstname: body.first_name,
                  lastname: body.last_name,
                  profile_pic: body.profile_pic,
                  locale: body.locale,
                  gender: body.gender
                }

                M.User.update({facebookID: fbid}, user, function(e, r){
                  if(e){
                    console.log(e);
                    res.send("Not Cool")
                  }
                  else {
                    console.log("saved the user and sending game");
                    send.text_promise(mid, "Successfully logged in")
                    .then(() => {
                      send.game(mid, result[0].publicLink)
                    })

                    res.send("Cool")
                  }
                })
              }
          });

        }

        //otherwise send success
        else {
          send.text(mid, "Successfully logged in")
          res.send("Cool")
        }
    }

    else {

      M.User.find({userId:mid}, function(e, r){
        if(e){
          console.log(e);
        }
        //if exiting user then update his document
        if(r.length > 0){
          M.User.update({userId: mid}, {facebookID: fbid}, function(e, r){
            if(e){
              console.log(e);
              res.send("Not Cool")
            }
            else {
              res.send("Cool")
            }
          })
        }
        //if new user then create new record
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
                    res.send("Not Cool")
                  } else {
                    send.text(mid, "You've successfully logged in");
                    console.log("saved new user");
                    res.send("Cool")
                  }
                })
              }
          });

        }
      })

    }
  })
})

module.exports = router
