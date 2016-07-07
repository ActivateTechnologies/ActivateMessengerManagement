'use strict'

const express = require('express');
const router = express.Router();

router.get('/payment', function(req, res){
  res.send("Stripe Here")
  let gameId = req.query.gid;
  let userId = req.query.mid
  console.log(gameId, userId);
})

module.exports = router
