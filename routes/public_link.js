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

// function validatePhoneNumber(number){
//   number.replace(/\D/gm, '');
// }

router.post('/check', function(req, res){
  console.log("Reached check");
  let phoneNumber = req.query.pn;
  let gameId = req.query.gid;

  phoneNumber = "+44" + phoneNumber

  console.log(phoneNumber);

  M.User.find({phoneNumber:phoneNumber}, function(err, result){
    if(result.length > 0){
      send.game(result[0].userId, gameId)
      res.send("Cool")
    }
    else {
      let user = M.User({
        phoneNumber: phoneNumber,
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

  let phoneNumber = req.query.pn;
  let mid = req.query.mid;
  phoneNumber = "+44" + phoneNumber;

  M.User.find({userId:mid}, function(err, result){
    if(err){
      console.log(err);
      res.send("Not Cool")
    }

    //if exiting user then update his document
    if(result.length > 0){
      M.User.update({userId: mid}, {phoneNumber: phoneNumber}, function(e, r){
        if(e){
          console.log(e);
          res.send("Not Cool")
        }
        else {
          send.text(mid, "Successfully logged in");
          res.send("Cool")
        }
      })
    }

    //if new user
    else {
      //fetch data
      var get_url = "https://graph.facebook.com/v2.6/" + mid + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=" + VERIFICATION_TOKEN;
      request(get_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          let data = {
            userId: mid,
            phoneNumber: phoneNumber,
            firstname: body.first_name,
            lastname: body.last_name,
            profile_pic: body.profile_pic,
            locale: body.locale,
            gender: body.gender
          }
          let user = M.User(data)

          M.User.find({phoneNumber: phoneNumber}, function(e, r){
            if(e){
              console.log(e);
              res.send("Not Cool")
            }

            // if visited publicLink
            if(r.length > 0){
              //add fetched data to document
              M.User.update({phoneNumber: phoneNumber}, data, function(e2, r2){
                if(e2){
                  console.log(e2);
                  res.send("Not Cool")
                }
                else {
                  send.text_promise(mid, "Successfully logged in")
                  .then(()=>{
                    send.game(mid, r[0].publicLink);
                    res.send("Cool")
                  })
                }
              })
            }

            // not visited link
            else{
              //create new document
              user.save(function(err){
                if(err){
                  console.log(err);
                  res.send("Not Cool")
                }
                else {
                  send.text(mid, "You've successfully logged in");
                  console.log("saved new user");
                  res.send("Cool")
                }
              })
            }
          })
        }
      });

    }
  })

})

module.exports = router
