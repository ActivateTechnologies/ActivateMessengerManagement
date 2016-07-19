'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../server/schemas.js')
const send = require('./../server/send.js')

router.get('/broadcast', function (req, res) {
    res.render('broadcast');
});

router.post('/broadcast', function(req, res){
  let type = req.query.type;
  let message = req.query.txt;

  if(type === "text"){
    M.User.find({}, function(err, result){
      result.forEach(function(item){
        send.text(item.userId, message);
      })
    })
  } else {
    M.User.find({}, function(err, result){
      result.forEach(function(item){
        send.allGames(item.userId);
      })
    })
  }

  res.send("done")
})

module.exports = router
