'use strict'

const express = require('express');
const router = express.Router();
const S = require('./../strings');
const User = require('./users.js');


router.get('/users', isLoggedIn, (req, res) => {
  res.render('./users', {
    s: {
      company: S.s.company
    }
  });
});

router.get('/usersData', (req, res) => {
  Dashboard.processGetUsersData(req, res);
});

router.get('/players', isLoggedIn, (req, res) => {
  Dashboard.processGetPlayers(req, res);
});


function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/login');
}

module.exports = router
