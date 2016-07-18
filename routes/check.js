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
      res.send("true");
    } else {
      res.send("false")
    }
  })
})

module.exports = router
