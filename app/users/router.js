'use strict'

const express = require('express');
const router = express.Router();
const S = require('./../strings');
const M = require('./../schemas');

router.get('/userAnalyticsData', (req, res) => {
  M.User.find({}, (err, users) => {
    res.json({'users': users})
  });
});

router.get('/users', isLoggedIn, (req, res) => {
  res.render('./users', {
    s: {
      company: S.s.company
    }
  });
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
