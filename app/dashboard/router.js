'use strict'

const express = require('express');
const router = express.Router();


router.get('/dashboard/:code', isLoggedIn, (req, res) => {

  const code = req.params.code;
  const S = require('./../strings')(code);
  const Analytics = require('./analytics.js')(code);

  console.log("rendering dashboard");
  res.send("hi")
  Analytics.getDashboardStats((data, error) => {
    if (error) {
      console.log(error);
      res.send('There was an error retrieving data.');
    }
    else {
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

});

router.get('/dashboardData/:code', (req, res) => {

  const code = req.params.code;
  const S = require('./../strings')(code);
  const Analytics = require('./analytics.js')(code);

  let requiredData = req.query.requiredData;
  if (requiredData == 'getTicketsSoldOverTime') {
    Analytics.getTicketsSoldOverTime((data, error) => {
      if (error) {
        console.log(error);
        res.send('Error');
      }
      else {
        res.send(data);
      }
    })
  }

  else if (requiredData == 'getNewMembersOverTime') {
    Analytics.getNewMembersOverTime((data, error) => {
      if (error) {
        console.log(error);
        res.send('Error');
      } else {
        res.send(data);
      }
    })
  }

  else if (requiredData == 'getButtonHitsOverTime') {
    Analytics.getButtonHitsOverTime((data, error) => {
      if (error) {
        console.log(error);
        res.send('Error');
      }
      else {
        res.send(data);
      }
    })
  }

});

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to login
  res.redirect('/login');
}

module.exports = router
