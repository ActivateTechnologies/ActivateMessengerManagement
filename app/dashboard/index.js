'use strict'

const express = require('express');
const router = express.Router();
const S = require('./../strings');
const Dashboard = require('./dashboard.js')

//DASHBOARD

router.get('/dashboard', isLoggedIn, (req, res) => {
  Dashboard.processGetDashboard(req, res);
});

router.get('/dashboardData', (req, res) => {
  Dashboard.processGetDashboardData(req, res);
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
