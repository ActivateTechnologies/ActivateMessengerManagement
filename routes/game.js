'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')

router.get('/game', function(req, res){
  res.render('game', {gid: req.query.gid})
})

module.exports = router
