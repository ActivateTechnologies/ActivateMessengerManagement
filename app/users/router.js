'use strict'

const express = require('express');
const router = express.Router();
const _ = require('underscore')


/*
  this returns data for /users route */
router.get('/userAnalyticsData.:code', (req, res) => {

  const code = req.params.code;
  const M = require('./../models/' + code);

  M.User.find({}).sort({signedUpDate: -1}).exec((err, users) => {
    res.json({'users': users})
  });

});

router.get('/users.:code', isLoggedIn, (req, res) => {

  const code = req.params.code;
  const S = require('./../strings')(code);

  res.render('users/members', {
    s: {company: S.s.company}
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
