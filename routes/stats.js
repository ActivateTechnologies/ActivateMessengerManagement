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

function gamesAttendedByUser(userId){
  return new Promise((resolve, reject)=>{
    M.Game.find({}, (err, results) => {
      if(err){
        reject(err)
      }
      let gamesAttended = 0
      _.each(results, (i) => {
        if(i.joined.indexOf({userId: userId}) != -1){
          gamesAttended++
        }
      })
      resolve(gamesAttended)
    })
  })
}

function createTableDate(){
  return new Promise((resolve, reject) => {
    M.User.find({}, (err, results) => {
      if(err){
        reject(err)
      }
      let ret = []
      _.each(results, (item) => {
        let temp = {}
        temp['name'] = item.firstname + " " + item.lastname;
        gamesAttendedByUser(item.userId)
        .then((gamesAttended) => {
          console.log(temp['name']);
          temp['gamesAttended'] = gamesAttended
          ret.push(temp)
        })
        .catch((e)=>{
          console.log(e);
        })
        console.log(temp);
      })
      resolve(ret);
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
