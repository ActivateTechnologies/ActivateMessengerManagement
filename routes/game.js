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
      res.render('game', {gid: req.query.gid, gameName: result[0].name});
    } else {
      res.render('game', {gid: req.query.gid, gameName: "Kickabout Game"})
    }
  })
})

module.exports = router
