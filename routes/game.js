'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')

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

router.get('/players', function(req, res){
  M.Game.find({_id:req.query.gid}, function(err, games){
    if(err){
      console.log(err);
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

module.exports = router
