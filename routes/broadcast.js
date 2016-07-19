'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../server/schemas.js')
const send = require('./../server/send.js')

router.get('/broadcast', function (req, res) {
    res.render('broadcast');
});

router.post('/broadcast', function(req, res){
  let type = req.query.typ;
  let message = req.query.message;

  let reached = 0;

  if(type === "message"){
    M.User.find({}, function(err, result){
      reached = result.length;
      result.forEach(function(item){
        send.text(item.userId, message);
      })
    })
  }
  else if(type === "upcomingGames"){
    M.User.find({}, function(err, result){
      reached = result.length;
      result.forEach(function(item){
        send.allGames(item.userId);
      })
    })
  }

  res.send("People reached: " + reached)
})

module.exports = router
