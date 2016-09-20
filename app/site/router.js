'use strict'

const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.render('site/home')
})


router.post('/register', function(req, res){
  
  const M = require('./../models/kickabout');

  let register = M.Register({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    fbPageURL: req.body.fbPageURL,
    desc: req.body.desc
  })

  register.save((err)=>{
    if (err) console.log(err);
    res.send("Thanks, we'll be in touch soon")
  })

})


router.get('/policy', function(req, res){
  res.render('site/policy');
})

module.exports = router
