'use strict'

const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login/login')
})

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res){
    console.log(req.user);
    res.redirect('/dashboard.' + req.user.code)
})

module.exports = router
