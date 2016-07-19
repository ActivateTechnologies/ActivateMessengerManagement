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

  if(type === "message"){
    M.User.find({}, function(err, result){
      result.forEach(function(item){
        send.text(item.userId, message);
      })
      res.send("People reached: " + result.length)
    })
  }
  else if(type === "upcomingGames"){
    M.User.find({}, function(err, result){
      result.forEach(function(item){
        send.allGames(item.userId, message);
      })
      res.send("People reached: " + result.length)
    })
  }
})

module.exports = router
