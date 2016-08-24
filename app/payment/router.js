'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../schemas.js')
const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
// const stripe = require("stripe")("sk_live_VmcnYw9pEBlxDKGddvKvL8Hu")
const Send = require('./../send.js');
const Config = require('./../config');
const S = require('./../strings');
const H = require('./../helperFunctions');
const Twilio = require('./../twilio.js');

/*
  handles the /event route */
function processGetEvent(req, res) {
  M.Event.find({_id:req.query.eid}, (err, results) => {
    if (err) {
      console.log('Error finding event with eid "' + req.query.eid + '":', err);
      res.send(S.s.payment.eventNotFound);
    } else if (results.length > 0) {
      res.render('payment/event', {
        eid: req.query.eid,
        event: results[0],
        eventStraplineEmojiFree: H.removeEmojis(results[0].strapline),
        config: {
          FACEBOOK_APP_ID: Config.FACEBOOK_APP_ID,
          FACEBOOK_PAGE_ID: Config.FACEBOOK_PAGE_ID,
          FACEBOOK_PAGE_URL: Config.FACEBOOK_PAGE_URL,
          ROOT_URL: Config.ROOT_URL
        }, s: {
          company: S.s.company
        }
      });
    } else {
      console.log('No events with eid "' + req.query.eid + '" found.');
      res.send(S.s.payment.eventNotFound);
    }
  });
}

function processGetPayment(req, res) {
  let eid = req.query.eid;
  let phoneNumber = '+44' + req.query.pn;
  let eventObject, price;
  if (eid && phoneNumber) {
    M.Event.find({_id: eid}).exec().catch((error) => {
      console.log('Error quering for event with id ' + eid + ':', error);
    })
    .then((events) => {
      eventObject = events[0];
      price = eventObject.price;
      return M.User.find({phoneNumber: phoneNumber}).exec();
    })
    .catch((error) => {
      console.log('Error querying for user with phoneNumber ' + phoneNumber + ':',
       error);
      renderPage(res, S.s.payment.eventNotFound,
       null, phoneNumber, false);
    })
    .then((users) => {
      if (users.length == 0) {
        if (price > 0) {
          res.render('payment/payment', {
            eid: eid,
            pn: req.query.pn,
            event: eventObject,
            STRIPE_PUBLIC_KEY: Config.STRIPE_PUBLIC_KEY, s: {
              company: S.s.company
            }
          });
        } else {
          processGetCharge(req, res, {
            pn: req.query.pn,
            eid: req.query.eid
          });
        }
      } else {
        let userAlreadyAttending = false;
        for (let i = 0; i < users[0].events.length && !userAlreadyAttending; i++) {
          userAlreadyAttending = users[0].events[i].eid == eid;
          if (userAlreadyAttending) {
            break;
          }
        }
        if (userAlreadyAttending) {
          renderPage(res, S.s.payment.alreadyAttending,
           null, phoneNumber, false);
        } else if (price > 0) {
          res.render('payment/payment', {
            eid: eid,
            pn: req.query.pn,
            event: eventObject,
            STRIPE_PUBLIC_KEY: Config.STRIPE_PUBLIC_KEY, s: {
              company: S.s.company
            }
          });
        } else {
          processGetCharge(req, res, {
            pn: req.query.pn,
            eid: req.query.eid
          });
        }
      }
    });
  }
  else {
    console.log('/payment did not receive all required details:',
     eid, phoneNumber);
    renderPage(res, S.s.payment.eventNotFound, null, phoneNumber, false);
  }
}

function handleExistingUserFree(res, req, uid, eid, price, users, eventObject, phoneNumber){
  H.updateUserEventAnalytics(uid, eid, price, req.body.stripeToken)
  .catch((error) => {})
  .then((event) => {
    return Send.bookedPromise(uid, users[0].firstName + ' '
     + users[0].lastName, price, event.name, event.strapline, event.image_url,
     uid._id + '-' + event._id, Math.round((new Date()).getTime()/1000));
  })
  .catch((error) => {
    console.log('User not found on db or via fb linked pn, using sms.');
    sendSmsMessage(uid, eventObject, true, false);
    renderPage(res, S.s.payment.bookingSuccessFreeSms.replace(S.h
      + 'phoneNumber', uid.phoneNumber), eventObject, phoneNumber, false);
    pageRendered = true;
  })
  .then(() => {
    if (!pageRendered) {
      renderPage(res, S.s.payment.bookingSuccessFreeMessenger,
       eventObject, phoneNumber, false);
    }
  });
}

function handleExistingUserPaid(res, req, uid, eid, price, users, eventObject, phoneNumber){
  makeCharge(res, price, req.body.stripeToken, uid, eid)
  .catch((err) => {
    console.log(err);
    renderPage(res, S.s.payment.paymentError, eventObject, phoneNumber, false);
  })
  .then(() => {
    return H.updateUserEventAnalytics(uid, eid, price, req.body.stripeToken);
  })
  .catch((error) => {})
  .then((event) => {
    return Send.bookedPromise(uid, users[0].firstName + ' '
     + users[0].lastName, price, event.name, event.strapline, event.image_url,
     req.body.stripeToken, Math.round((new Date()).getTime()/1000));
  })
  .catch((error) => {
    console.log('User not found on db or via fb linked pn, using sms.');
    sendSmsMessage(uid, eventObject, true, true);
    renderPage(res, S.s.payment.bookingSuccessPaidSms.replace(S.h
      + 'phoneNumber', uid.phoneNumber), eventObject, phoneNumber, false);
  })
  .then(() => {
    console.log('Existing, paid, message sent');
    renderPage(res, S.s.payment.bookingSuccessPaidMessenger,eventObject, phoneNumber, false);
  });
}


function handleNewUserFree(res, req, uid, eid, price, phoneNumber){
  let eventObject;
  H.updateUserEventAnalytics(uid, eid, price, req.body.stripeToken)
  .catch((error) => {})
  .then((event) => {
    eventObject = event;
    return Send.bookedPromise(uid, phoneNumber, price, event.name,
     event.strapline, event.image_url, uid._id + '-' + event._id,
     Math.round((new Date()).getTime()/1000));
  })
  .catch((error)=>{
    console.log('User not found on db or via fb linked pn, using sms.');
    sendSmsMessage(uid, eventObject, false, false);
    renderPage(res, S.s.payment.bookingSuccessFreeSms.replace(S.h
     + 'phoneNumber', uid.phoneNumber), eventObject, phoneNumber, false);
  })
  .then(() => {
    renderPage(res, S.s.payment.bookingSuccessFreeMessenger, eventObject, phoneNumber, false);
  })
}

function handleNewUserPaid(res, req, uid, eid, price, phoneNumber){
  let eventObject;
  makeCharge(res, price, req.body.stripeToken, uid, eid)
  .catch((error) => {
    renderPage(res, S.s.payment.paymentError, eventObject, phoneNumber, false);
  })
  .then(() => {
    return H.updateUserEventAnalytics(uid, eid, price, req.body.stripeToken);
  })
  .catch((error) => {
  })
  .then((event) => {
    eventObject = event;
    return Send.bookedPromise(uid, phoneNumber, price,event.name,
      event.strapline, event.image_url, req.body.stripeToken);
  })
  .catch((error)=>{
    console.log('User not found on db or via fb linked pn, using sms.');
    sendSmsMessage(uid, eventObject, false, true);
    renderPage(res, S.s.payment.bookingSuccessPaidSms.replace(S.h
     + 'phoneNumber', uid.phoneNumber), eventObject, phoneNumber, false);
  })
  .then(() => {
    renderPage(res, S.s.payment.bookingSuccessPaidMessenger, eventObject, phoneNumber, false);
  });
}

/*
  this function will receive phoneNumber and eid as params
  it will then use these to complete the payment*/
function processGetCharge(req, res, params) {
  let phoneNumber = (params) ? '+44' + params.pn : '+44' + req.query.pn;
  let eid = (params) ? params.eid : req.query.eid;
  let eventObject;
  let price;
  let pageRendered = false;

  //get event details
  M.Event.find({_id: eid}).exec().catch((error) => {
    console.log('Error quering for event with id ' + eid + ':', error);
  })
  .then((events) => {
    eventObject = events[0];
    price = eventObject.price;
    //now get user details
    return M.User.find({phoneNumber: phoneNumber}).exec();
  })
  .catch((error) => {
    console.log('Error querying for user with phoneNumber ' + phoneNumber + ':',
     error);
  })
  //got user details
  .then((users) => {
    if (users.length > 0) { //EXISTING USER
      console.log('Existing User');
      let uid = {
        _id: users[0]._id,
        phoneNumber: users[0].phoneNumber
      }
      if (users[0].mid) {
        uid.mid = users[0].mid;
      }
      if (price === 0) { //FREE GAME
        console.log('Free Event');
        handleExistingUserFree(res, req, uid, eid, price, users, eventObject, phoneNumber)
      }
      else { //PAID GAME
        console.log("Paid Event");
        handleExistingUserPaid(res, req, uid, eid, price, users, eventObject, phoneNumber)
      }
    }
    else { //NEW USER
      console.log('New User');
      let user = M.User({
        phoneNumber: phoneNumber,
        signedUpDate: new Date()
      })
      user.save((error, user) => {
        let uid = {
          _id: user._id,
          phoneNumber: phoneNumber
        }
        if (!error) {
          M.Analytics.update({name:"NewUsers"},
          {$push: {activity: {uid:user._id, time: new Date()}}},
          {upsert: true}, (err) => {
            if (err) {
              console.log('Error saving analytics for "NewUsers":', err);
            }
          });
        }
        if (error) {
          console.log('Error saving user\'s phone number:', error);
        }
        else if (price === 0) { //FREE GAME
          console.log("Free Event");
          handleNewUserFree(res, req, uid, eid, price, phoneNumber);
        }
        else { //PAID GAME
          console.log("Paid Game");
          handleNewUserPaid(res, req, uid, eid, price, phoneNumber);
        }
      });
    }
  });
}

/*
  Render the custom_payment view with given message and other
  options. */
function renderPage(res, message, event, pn, showPayment) {
  let paymentDivDisplay = (showPayment) ? '' : 'none';
  let objectToSend = {
    pn: pn,
    message: message,
    paymentDivDisplay: paymentDivDisplay,
    STRIPE_PUBLIC_KEY: Config.STRIPE_PUBLIC_KEY, s: {
      company: S.s.company
    }
  }
  if (event) {
    objectToSend.event = event;
    objectToSend.event.priceString = event.price.toFixed(2);
  }
  res.render('payment/payment_complete', objectToSend);
}

function processGetUserFromPhoneNumber(req, res) {
  var phoneNumber = req.query.phoneNumber;
  if (!phoneNumber) {
    console.log('processGetUserFromPhoneNumber did not receive phone number');
    res.status(200).send('Error: phoneNumber not sent');
  } else {
    M.User.find({phoneNumber: '+44' + phoneNumber}, (error, users) => {
      if (error) {
        console.log('Error getting user with phoneNumber +44'
          + phoneNumber + ':', error);
        res.status(200).send('Error: Error with db query');
      } else if (users.length == 0) {
        //console.log('No Users found with phoneNumber +44' + phoneNumber);
        res.status(200).send('Error: No users found with given phoneNumber');
      } else {
        res.status(200).send(users[0]);
      }
    });
  }
}

function makeCharge(res, eventPrice, stripeToken, uid, eid) {
  console.log("inside makeCharge");
  return new Promise((resolve, reject) => {
    let price = parseFloat(eventPrice) / 100;
    let charge = stripe.charges.create({
      amount: eventPrice, // amount in cents, again
      currency: "gbp",
      card: stripeToken,
      description: "",
      metadata: {_id:(uid._id + ""), eid: eid}
    }, (err, charge) => {
      if (err && err.type === 'StripeCardError') {
        renderPage(res, S.s.payment.paymentError, null, uid.phoneNumber, true);
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

function sendSmsMessage(uid, event, existingUser, paidEvent) {
  if (paidEvent) {
    let directionUrl = "http://maps.google.com/?q="
     + event.latlong.replace(/\s+/g, '');
    let textString = S.s.sms.paidEventConfirmation;
    textString = textString.replace(S.h + 'name', event.name)
     .replace(S.h + 'strapline', event.strapline)
     .replace(S.h + 'mapsUrl', directionUrl)
     .replace(S.h + 'messengerUrl', Config.MESSENGER_URL);
    Twilio.sendSms(uid.phoneNumber, textString, (error) => {
      if (error) {
        console.log('Error sending sms:', error);
      } else {
        console.log('Sms sent');
      }
    });
  } else {
    let directionUrl = "http://maps.google.com/?q="
     + event.latlong.replace(/\s+/g, '');
    let textString = S.s.sms.freeEventConfirmation;
    textString = textString.replace(S.h + 'name', event.name)
     .replace(S.h + 'strapline', event.strapline)
     .replace(S.h + 'mapsUrl', directionUrl)
     .replace(S.h + 'messengerUrl', Config.MESSENGER_URL);
    Twilio.sendSms(uid.phoneNumber, textString, (error) => {
      if (error) {
        console.log('Error sending sms:', error);
      } else {
        console.log('Sms sent');
      }
    });
  }
}


// PAYMENT
router.get('/event', (req, res) => {
  processGetEvent(req, res);
})

router.get('/payment', (req, res) => {
  processGetPayment(req, res);
});

router.post('/charge', (req, res) => {
  processGetCharge(req, res);
});

router.get('/userFromPhoneNumber', (req, res) => {
  processGetUserFromPhoneNumber(req, res);
});


module.exports = router
