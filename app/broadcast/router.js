'use strict'

const express = require('express');
const router = express.Router();
const _ = require('underscore')

/*
  Sends given message to user, with events if type is
  "upcomingEvents" */
router.post('/message.:code', (req, res) => {
  console.log("posted something");

  const code = req.params.code
  const S = require('./../strings')(code);
  const M = require('./../models/' + code);
  const Send = require('./../send.js')(code);


  let type = req.body.formType;
  let fn;

  if (type === "message"){
    let message = req.body.message;
    fn = function(uid){
      Send.text(uid, message);
    }
  }

  else if (type === "events"){
    fn = Send.allEvents
  }

  else if (type === "featured"){
    let eid = req.body.eid;
    let subtitle = req.body.subtitle;
    fn = function(uid){
      Send.eventBroadcast(uid, eid, subtitle);
    }
  }


  // if to send to choosen ids
  if(req.body.ids){
    let ids = req.body.ids.trim().split(',')
    console.log(ids);
    _.each(ids, (id)=>{
      M.User.findOneAndUpdate(
        {_id:id},
        {receivedTime: (new Date())},
        function(err, user){
        if(err) console.log(err);
          if(user){
            let uid = {
              _id: id,
              mid: user.mid
            }
            fn(uid)
          }
          else {
            console.log("user not found invalid id");
          }
        })
    })
    res.send("People reached: " + ids.length);
  }

  // else send to everyone
  else {
    M.User.find({}, (err, result) => {
      _.each(result, (item)=>{
        let uid = {
          _id: item.id,
          mid: item.mid
        }
        item.receivedTime = new Date();
        item.save();
        if (item.notifications !== "off"){
          fn(uid);
        }
      })
      res.send("People reached: " + result.length)
    })
  }

});


router.get('/message.:code', isLoggedIn, (req, res) => {
  const S = require('./../strings')(req.params.code);
  const M = require('./../models/' + req.params.code);

  let now = new Date();
  let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  M.Event.find({when:{$gt: date}}, (err, results)=>{
    if(err) console.log(err);
    res.render('broadcast/message', {
      s: {company: S.s.company},
      events: results
    });
  })
});

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to login
  res.redirect('/');
}

module.exports = router
