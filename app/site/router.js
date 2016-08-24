'use strict'

const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.render('home')
})

router.get('/policy', function(req, res){
  res.render('policy');
})

module.exports = router
