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
        imageLink result[0].image_url
      });
    } else {
      res.render('game', {
        gid: req.query.gid,
        gameName: "Kickabout Game",
        imageLink: "http://limitless-sierra-68694.herokuapp.com/img/testimage.png"
      })
    }
  })
})

module.exports = router
