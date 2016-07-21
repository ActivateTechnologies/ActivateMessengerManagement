'use strict'

const express = require('express');
const router = express.Router();
const A = require('./../server/analytics.js')

router.get('/analytics', function(req, res){
  Promise.all([A.getNewUsers(), A.getNewBookHits(), A.getNewTodayHits(), A.getNewTomorrowHits(), A.getNewSoonHits()])
  .then(function(answers){
    res.render('analytics', {
      users: answers[0],
      book: answers[1],
      today: answers[2],
      tomorrow: answers[3],
      soon: answers[4]
    })
  })
  .catch(function(err){
    console.log(err);
  })
})

router.get('/visualize', function (req, res) {
  let now = new Date();
  let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  Promise.all([A.getNewUsersWeekly(currentDate), A.getButtonHitsWeekly(currentDate), A.getNewUsersMonthly(currentDate), A.getButtonHitsMonthly(currentDate)])
  .then(function(answers){
    res.render('visualize', {
      newUsersWeekly: answers[0],
      buttonHitsWeekly: answers[1],
      newUsersMonthly: answers[2],
      buttonHitsMonthly: answers[3]
    });
  })
  .catch(function(err){
    console.log(err);
  })
})

module.exports = router
