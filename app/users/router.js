'use strict'

const express = require('express');
const router = express.Router();
const _ = require('underscore')

/*
  returns json data about users which can be imported in excel for querying*/
router.get('/userdata.:code', (req, res) => {

  const code = req.params.code;
  const M = require('./../schemas')(code);

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
router.get('/userAnalyticsData.:code', (req, res) => {

  const code = req.params.code;
  const M = require('./../schemas')(code);

  M.User.find({}, (err, users) => {
    res.json({'users': users})
  });

});

router.get('/users.:code', isLoggedIn, (req, res) => {

  const code = req.params.code;
  const S = require('./../strings')(code);

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
