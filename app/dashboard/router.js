'use strict'

const express = require('express');
const router = express.Router();
const S = require('./../strings');
const fs = require('fs');
const Analytics = require('./../analytics.js');


function processGetDashboard(req, res) {
  Analytics.getDashboardStats((data, error) => {
    if (error) {
      res.send('There was an error retrieving data.');
      console.log('/dashboard error:', error);
    } else {
      res.render('dashboard/dashboard', {
        totalNoOfMembers: data.totalNoOfMembers,
        totalRevenue: data.totalRevenue.toFixed(2),
        totalNoOfTickets: data.totalNoOfTickets,
        s: {
          company: S.s.company
        }
      });
    }
  });
}

function processGetDashboardData(req, res) {
  let requiredData = req.query.requiredData;
  if (requiredData == 'getTicketsSoldOverTime') {
    Analytics.getTicketsSoldOverTime((data, error) => {
      if (error) {
        console.log('/dashboardData error with getTicketsSoldOverTime:', error);
        res.send('Error');
      } else {
        res.send(data);
      }
    })
  } else if (requiredData == 'getNewMembersOverTime') {
    Analytics.getNewMembersOverTime((data, error) => {
      if (error) {
        console.log('/dashboardData error with getNewMembersOverTime:', error);
        res.send('Error');
      } else {
        res.send(data);
      }
    })
  } else if (requiredData == 'getButtonHitsOverTime') {
    Analytics.getButtonHitsOverTime((data, error) => {
      if (error) {
        console.log('/dashboardData error with getButtonHitsOverTime:', error);
        res.send('Error');
      } else {
        res.send(data);
      }
    })
  }
}



router.get('/dashboard', isLoggedIn, (req, res) => {
  processGetDashboard(req, res);
});

router.get('/dashboardData', (req, res) => {
  processGetDashboardData(req, res);
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
