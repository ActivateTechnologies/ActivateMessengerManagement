'use strict'

const express = require('express');
const router = express.Router();
const M = require('./../schemas.js')
const Send = require('./../send.js');
const Config = require('./../config');
const S = require('./../strings');
const H = require('./../helperFunctions');
const Twilio = require('./../twilio.js');
const stripe = require("stripe")(Config.STRIPE_SECRET_KEY)

/*
  handles the /payment route used to pay for games
  it will receive eventId and user's mid as params*/
function processGetPayment(req, res) {
  let eid = req.query.eid;
  let mid = req.query.mid;
  let eventObject;
  if (eid && mid) {
    M.Event.find({_id: eid}).exec().catch(console.log)
    .then((events) => {
      eventObject = events[0];
      return M.User.find({mid: mid}).exec();
    })
    .then((users) => {
      if (users.length == 0) {
        renderPage(res, S.s.payment.eventNotFound);
      }
      else {
        let userAlreadyAttending = false;
        for (let i = 0; i < users[0].events.length && !userAlreadyAttending; i++) {
          userAlreadyAttending = users[0].events[i].eid == eid;
          if (userAlreadyAttending) {
            break;
          }
        }
        if (userAlreadyAttending) {
          renderPage(res, S.s.payment.alreadyAttending);
        }
        else if (eventObject.price > 0) {
          res.render('payment/payment', {
            eid: eid,
            mid: users[0].mid,
            event: eventObject,
            STRIPE_PUBLIC_KEY: Config.STRIPE_PUBLIC_KEY,
            s: {
              company: S.s.company
            }
          });
        } else {
          renderPage(res, S.s.payment.eventNotFound);
        }
      }
    }, console.log);
  }
  else {
    console.log('/payment did not receive all required details:');
    renderPage(res, S.s.payment.eventNotFound);
  }
}

/*
  it will complete the payment*/
function processGetCharge(req, res) {
  let mid = req.query.mid;
  let eid = req.query.eid;
  let eventObject;

  M.Event.find({_id: eid}).exec().catch(console.log)
  .then((events) => {
    eventObject = events[0];
    return M.User.find({mid: mid}).exec();
  }, console.log)
  .then((users) => {

    //EXISTING USER
    if (users.length > 0) {
      let uid = {
        _id: users[0]._id
      }
      if (users[0].mid) {
        uid.mid = mid;
      }
      if (eventObject.price === 0) { //FREE GAME
        renderPage(res, "This is a free event");
      }
      else { //PAID GAME
        makeCharge(res, eventObject.price, req.body.stripeToken, uid, eid)
        .then(()=>{
          return H.updateUserEventAnalytics(uid, eid, eventObject.price, req.body.stripeToken);
        }, (err) => {
          console.log(err);
          renderPage(res, S.s.payment.paymentError);
          return Promise.reject(err);
        })
        .then((event) => {
          // Send User Receipt
          Send.booked(uid, users[0].firstName + ' '
           + users[0].lastName, eventObject.price, event.name, event.strapline, event.image_url,
           req.body.stripeToken, Math.round((new Date()).getTime()/1000))
          renderPage(res, S.s.payment.bookingSuccessPaidMessenger);
        })
      }
    }

    //NEW USER
    else {
      renderPage(res, "You aren't a registerd user.");
    }
  });
}

/*
  Render the custom_payment view with given message and other
  options. */
function renderPage(res, message) {
  let objectToSend = {
    message: message,
    s: {
      company: S.s.company
    }
  }
  res.render('payment/payment_complete', objectToSend);
}

function makeCharge(res, eventPrice, stripeToken, uid, eid) {
  return new Promise((resolve, reject) => {
    let price = parseFloat(eventPrice) * 100;
    let charge = stripe.charges.create({
      amount: price, // amount in cents, again
      currency: "gbp",
      card: stripeToken,
      description: "",
      metadata: {_id:(uid._id + ""), eid: eid}
    }, (err, charge) => {
      if (err && err.type === 'StripeCardError') {
        renderPage(res, S.s.payment.paymentError);
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}



// PAYMENT

router.get('/payment', (req, res) => {
  processGetPayment(req, res);
});

router.post('/charge', (req, res) => {
  processGetCharge(req, res);
});

module.exports = router
