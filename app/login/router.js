'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login/login')
})

router.post('/login', passport.authenticate('local', {
	successRedirect: '/dashboard/kickabout',
  failureRedirect: '/login'
}))

module.exports = router
