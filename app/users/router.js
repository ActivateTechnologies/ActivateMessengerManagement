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

router.post('/addGroup.:code', (req, res) => {

  const code = req.params.code;
  const M = require('./../models/' + code);

  let name = req.query.name;
  let list = req.query.list;

  list = list.split(',')

  M.Group.findOne({"name":name}, (err, result)=>{
    if (err) console.log(err);

    if (result){
      res.json({status: "error"})
    }

    else {
      let group = M.Group({
        name: name,
        list: list
      })

      group.save((er)=>{
        if (er){
          res.json({status: "error"})
        }
        else {
          res.json({status: "success"})
        }
      })
    }
  })

});


router.get('/getGroups.:code', (req, res) => {

  const code = req.params.code;
  const M = require('./../models/' + code);

  M.Group.find({}, function(err, result){
    if (err) console.log(err);
    res.send(result)
  })

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
