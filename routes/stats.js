'use strict'

const express = require('express');
const router = express.Router();
const A = require('./../server/analytics.js')
const M = require('./../server/schemas.js')
const _ = require('underscore')

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

function getUserIds(){
  return new Promise((resolve, reject) => {
    M.User.find({}, function(err, results){
      let ret = [];
      _.each(results, function(i) => {
        ret.push(i.userId);
      })
      resolve(ret)
    })
  })
}

function getGames(userids){
  return new Promise((resolve, reject) => {
    let ret = [];
    _.each(userids, function(i)=>{
      let gamesAttended = 0
      M.Games.find({}, function(err, results){
        let ret = [];
        _.each(results, function(ii)=>{
          if(ii.joined.indexOf({userId:i} != -1)){
            gamesAttended += 1;
          }
        })
        resolve(ret)
      })
    })
  })
}

router.get('/table', (req, res) => {
  createTableDate()
  .then((data)=>{
    console.log(data);
    res.render('table', {'data': data, 'othertext': "lalalala"})
  })
  .catch((e)=>{
    console.log(e);
    res.render('table', {'data': "err", 'othertext': "lalalala"})
  })
})

module.exports = router
