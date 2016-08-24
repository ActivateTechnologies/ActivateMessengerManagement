'use strict'

const express = require('express');
const router = express.Router();
const S = require('./../strings');
const Events = require('./events.js')

router.get('/events', isLoggedIn, (req, res) => {
  Dashboard.processGetEvents(req, res);
});

router.post('/events', upload.single('image'), (req, res) => {
  Dashboard.processPostEvents(req, res);
});

router.delete('/events', (req, res) => {
  Dashboard.processDeleteEvents(req, res);
});

router.get('/currentEvents', (req, res) => {
  Dashboard.processGetCurrentEvents(req, res);
});

router.get('/pastEvents', (req, res) => {
  Dashboard.processGetPastEvents(req, res);
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
