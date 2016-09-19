'use strict'

const express = require('express');
const router = express.Router();
const _ = require('underscore')

/*
  returns json data about users which can be imported in excel for querying*/
router.get('/userdata.:code', (req, res) => {

  const code = req.params.code;
  const M = require('./../models/' + code);

  M.User.find({}, (err, users) => {
    if(err) res.send(err);
    let data = "Name,Gender,Phone Number,Email,Preferred Position,Backup Position,Level,New/Returning,Events Attended,Sign Up Date,Messenger Id";

    _.each(users, (user)=>{
      data += "\r\n";
      data += (user.firstName + " " + user.lastName) + ","
            + user.gender + ","
      try {
        data += (user.extras[1].phoneNumber + ',')
      }
      catch (e) {
        data += "NA" + ','
      }
      try {
        data += (user.extras[2].email + ',')
      }
      catch (e) {
        data += ("NA" + ',')
      }
      try {
        data += (user.extras[3].preferredPosition + ',')
      }
      catch (e) {
        data += ("NA" + ',')
      }
      try {
        data += (user.extras[4].backup + ',')
      }
      catch (e) {
        data += ("NA" + ',')
      }
      try {
        data += (user.extras[5].level + ',')
      }
      catch (e) {
        data += ("NA" + ',')
      }
      try {
        data += ((user.extras[6])['type'] + ',')
      }
      catch (e) {
        data += ("NA" + ',')
      }
      try {
        data += (user.events.length + ',')
      }
      catch (e) {
        data += 0 + ','
      }
      data += user.signedUpDate + ","
      data += '"' + user.mid + '"'

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
  const M = require('./../models/' + code);

  M.User.find({}).sort({signedUpDate: -1}).exec((err, users) => {
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
