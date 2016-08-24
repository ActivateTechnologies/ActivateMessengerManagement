'use strict'

const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.render('site/home')
})

router.get('/policy', function(req, res){
  res.render('site/policy');
})

module.exports = router
