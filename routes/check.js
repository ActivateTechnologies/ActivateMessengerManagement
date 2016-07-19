'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')

router.get('/check', function(req, res){
  M.User.find({facebookID:req.query.fbid}, function(err, result){

    if(err){
      console.log(err);
    }

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://limitless-sierra-68694.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

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
