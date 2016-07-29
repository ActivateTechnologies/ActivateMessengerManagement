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

router.get('/table', (req, res) => {
  res.render('table')
})

router.get('/tabledata', (req, res) => {
  getUsers()
  .then((users)=>{
    let arr = _.map(users, (tup)=>{
      return tup[0];
    })

    Promise.all([getGamesAttendedByUsers(arr), getButtonHitsByUsers(arr)])
    .then((values) => {
      let data = [];
      for(let i = 0; i<values[0].length; i++){
        data.push({
          userId: arr[i],
          name: users[i][1],
          gamesAttended: values[0][i],
          buttonHits: values[1][i]
        })
      }

      console.log(data);
      res.json({'data': data})
    })
  })
  .catch((e)=>{
    res.render('table', {'data': "You should not be seeing this"})
  })
})

function getUsers(){
  return new Promise((resolve, reject) => {
    M.User.find({}, function(err, results){
      let ret = [];
      _.each(results, (i) => {
        ret.push([i.userId, i.firstname + " " + i.lastname]);
      })
      resolve(ret)
    })
  })
}

function getGamesAttendedByUsers(userIds){
  return new Promise((resolve, reject)=>{
    let ret = [];

    //prefilling ret
    for(let i = 0; i<userIds.length; i++){
      ret.push(0);
    }

    //filling ret
    M.Game.find({}, function(err, results){
      _.each(results, (item)=>{
        _.each(item.joined, (joiner)=>{
          let ind = userIds.indexOf(joiner.userId);
          if(ind != -1){
            ret[ind] += 1;
          }
        })
      })
      resolve(ret);
    })
  })
}

function getButtonHitsByUsers(userIds){
  return new Promise((resolve, reject)=>{
    let ret = [];

    //prefilling ret
    for(let i = 0; i<userIds.length; i++){
      ret.push(0);
    }

    //filling ret
    M.Button.find({}, function(err, results){
      _.each(results, (item)=>{
        _.each(item.activity, (hitter)=>{
          let ind = userIds.indexOf(hitter.userId);
          if(ind != -1){
            ret[ind] += 1;
          }
        })
      })
      resolve(ret);
    })
  })
}

module.exports = router
