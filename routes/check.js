'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')

router.get('/check', function(req, res){
  M.User.find({facebookID:req.query.fbid}, function(err, result){
    if(err){
      console.log(err);
    }
    if(result.length > 0){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ check: true}));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ check: false }));
    }
  })
})

module.exports = router
