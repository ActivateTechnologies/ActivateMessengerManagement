'use strict'

const express = require('express');
const router = express.Router();
const _ = require('underscore')

/*
  Sends given message to user, with events if type is
  "upcomingEvents" */
router.post('/message.:code', (req, res) => {

  const code = req.params.code
  const S = require('./../strings')(code);
  const M = require('./../models/' + code);
  const Send = require('./../send.js')(code);


  let type = req.query.type;

  if (type == "message") {
    let message = decodeURIComponent(req.query.message);

    // if to send to choosen ids
    if(req.query.ids){
      let ids = req.query.ids;
      ids = ids.split(',')
      _.each(ids, (id)=>{
        Send.text(uid, message);
      })
      res.send("People reached:", ids.length);
    }

    // else send to everyone
    else {
      M.User.find({}, (err, result) => {
        _.each(result, (item)=>{
          let uid = {
            _id: item.id,
            mid: item.mid
          }
          if (item.notifications !== "off"){
            Send.text(uid, message);
          }
        })
        res.send("People reached: " + result.length)
      })
    }
  }

  else if (type == "upcomingEvents") {
    M.User.find({}, (err, result) => {
      _.each(result, (item)=>{
        let uid = {
          _id: item.id,
          mid: item.mid
        }
        if (item.notifications !== "off"){
          Send.allEvents(uid);
        }
      })
      res.send("People reached: " + counter)
    })
  }

});


router.get('/message.:code', isLoggedIn, (req, res) => {
  const S = require('./../strings')(req.params.code);
  res.render('broadcast/message', {
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
  // if they aren't redirect them to login
  res.redirect('/login');
}

module.exports = router
