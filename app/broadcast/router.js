'use strict'

const express = require('express');
const router = express.Router();

/*
  Sends given message to user, with events if type is
  "upcomingEvents" */
router.post('/message:code', (req, res) => {
  let code = req.params.code
  const S = require('./../strings')(code);
  const M = require('./../schemas.js')(code);
  const Send = require('./../send.js')(code);


  let type = req.query.type;
  let message = decodeURIComponent(req.query.message);
  if (type == "message") {
    M.User.find({}, (err, result) => {
      let counter = 0;
      for(let i = 0; i<result.length; i++){
        if(result[i].notifications !== "off"){
          let uid = {
            _id: result[i].id,
            phoneNumber: result[i].phoneNumber,
          }
          uid.mid = (result[i].mid) ? result[i].mid : null;
          Send.text(uid, message, (error) => {
            if (error) {
              console.log('Error with send via messenger, sending sms');
              Twilio.sendSms(uid.phoneNumber, message, () => {
                console.log('Sms sent');
              });
            }
          });
          counter++;
        }
      }
      res.send("People reached: " + counter)
    })
  }
  else if (type == "upcomingEvents") {
    console.log('5');
    M.User.find({}, (err, result) => {
      let counter =  0;
      for(let i = 0; i<result.length; i++){
        if(result[i].notifications !== "off"){
          let uid = {
            _id: result[i].id,
            phoneNumber: result[i].phoneNumber,
          }
          uid.mid = (result[i].mid) ? result[i].mid : null;
          Send.allEvents(uid, message);
          counter++;
        }
      }
      res.send("People reached: " + counter)
    })
  }
});


router.get('/message:code', isLoggedIn, (req, res) => {
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
