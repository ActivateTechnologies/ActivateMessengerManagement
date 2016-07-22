'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../server/schemas.js')
const send = require('./../server/send.js')

router.get('/broadcast', isLoggedIn, function (req, res) {
    res.render('broadcast');
});

router.post('/broadcast', function(req, res){
  let type = req.query.typ;
  let message = decodeURIComponent(req.query.message);

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

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

module.exports = router
