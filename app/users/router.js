'use strict'

const express = require('express');
const router = express.Router();
const S = require('./../strings');
const M = require('./../schemas');
const _ = require('underscore')

/*
  returns json data about users which can be imported in excel for querying*/
router.get('/userdata', (req, res) => {
  M.User.find({}, (err, users) => {
    if(err) res.send(err);
    let data = "Messenger Id Id,Name,Sign Up Date, Events Attended";
    _.each(users, (user)=>{
      data += "\r\n";
      data += user.mid + ","
            + (user.firstName + " " + user.lastName) + ","
            + user.signedUpDate + ","
            + user.events.length
    })
    res.setHeader('Content-disposition',
      'attachment; filename=usersData.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(data);
  });
});

/*
  this returns data for /users route */
router.get('/userAnalyticsData', (req, res) => {
  M.User.find({}, (err, users) => {
    res.json({'users': users})
  });
});

router.get('/users', isLoggedIn, (req, res) => {
  res.render('users/users', {
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
