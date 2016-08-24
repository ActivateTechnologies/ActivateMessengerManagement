'use strict'

const express = require('express');
const router = express.Router();
const A = require('./../server/analytics.js')
const M = require('./../server/schemas.js')
const _ = require('underscore')

router.get('/analytics', function(req, res){
  Promise.all([
    A.getNewUsers(),
    A.getNewBookHits(),
    A.getNewTodayHits(),
    A.getNewTomorrowHits(),
    A.getNewSoonHits()
  ]).then(function(answers){
    res.render('analytics', {
      users: answers[0],
      book: answers[1],
      today: answers[2],
      tomorrow: answers[3],
      soon: answers[4]
    })
  }).catch(function(err){
    console.log(err);
  });
})


router.get('/tabledata', (req, res) => {
  getUsers()
  .then((users)=>{
    //console.log('Getting analytics for users: ', users);
    //creating array of userids
    let arr = _.map(users, (tup)=>{
      return tup[0];
    })

    Promise.all([getEventsAttendedByUsers(arr), getButtonHitsByUsers(arr),
     getPaymentsByUsers(arr)])
    .then((values) => {
      let data = [];
      for(let i = 0; i<values[0].length; i++){
        data.push({
          mid: arr[i],
          name: users[i][1],
          eventsAttended: values[0][i],
          buttonHits: values[1][i],
          payments: values[2][i]
        })
      }
      //console.log(data);
      res.json({'data': data})
    })
  })
  .catch((e)=>{
    res.render('table', {'data': "You should not be seeing this"})
  })
})

router.get('/tablecsv', (req, res) => {
  getUsers()
  .then((users)=>{

    //creating array of userids
    let arr = _.map(users, (tup)=>{
      return tup[0];
    })

    Promise.all([getEventsAttendedByUsers(arr), getButtonHitsByUsers(arr),
     getPaymentsByUsers(arr)]).then((values) => {
      let data = "User Id,Name,Events Attended,Button Hits,Payments";
      for(let i = 0; i < values[0].length; i++){
        data += "\r\n" + arr[i] + "," + users[i][1] + ","
          + values[0][i] + "," + values[1][i] + "," + values[2][i];
      }
      res.setHeader('Content-disposition',
        'attachment; filename=KickaboutAnalytics.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(data);
    })
  })
  .catch((e)=>{
    res.render('table', {'data': "You should not be seeing this"})
  })
});

function getUsers(){
  return new Promise((resolve, reject) => {
    M.User.find({}, function(err, results){
      let ret = [];
      _.each(results, (i) => {
        ret.push([i.mid, i.firstName + " " + i.lastName]);
      })
      resolve(ret)
    })
  })
}

function getEventsAttendedByUsers(mids){
  return new Promise((resolve, reject)=>{
    let ret = [];

    //prefilling ret
    for(let i = 0; i<mids.length; i++){
      ret.push(0);
    }

    //filling ret
    M.Event.find({}, function(err, results){
      _.each(results, (item)=>{
        _.each(item.joined, (joiner)=>{
          let ind = mids.indexOf(joiner.mid);
          if(ind != -1){
            ret[ind] += 1;
          }
        })
      })
      resolve(ret);
    })
  })
}

function getButtonHitsByUsers(mids){
  return new Promise((resolve, reject)=>{
    let ret = [];

    //prefilling ret
    for(let i = 0; i<mids.length; i++){
      ret.push(0);
    }

    //filling ret
    M.Button.find({}, function(err, results){
      _.each(results, (item)=>{
        _.each(item.activity, (hitter)=>{
          let ind = mids.indexOf(hitter.mid);
          if(ind != -1){
            ret[ind] += 1;
          }
        })
      })
      resolve(ret);
    })
  })
}

function getPaymentsByUsers(mids){
  return new Promise((resolve, reject) => {
    let ret = [];

    //prefilling ret
    for(let i = 0; i < mids.length; i++){
      ret.push(0);
    }

    //filling ret
    M.Analytics.find({}, function(err, results) {
      if (err) {
        console.log('Error finding payments: ', err);
      }
      let payments = results[0];
      _.each(payments.activity, (payment)=>{
        let index = mids.indexOf(payment.mid);
        if(index != -1){
          ret[index] += payment.amount;
        }
      })
      resolve(ret);
    })
  })
}

module.exports = router
