'use strict'

const express = require('express');
const router = express.Router();


/*
  Renders payment_complete view to show message */
function renderPage(S, res, message) {
  let objectToSend = {
    message: message,
    s: {company: S.s.company}
  }
  res.render('payment/payment_complete', objectToSend);
}


/*
  handles the /payment route used to pay for games
  it will receive eventId and user's mid as params*/
router.get('/payment.:code', (req, res) => {

  let code = req.params.code;
  const M = require('./../schemas.js')(code);
  const Send = require('./../send.js')(code);
  const Config = require('./../config')(code);
  const S = require('./../strings')(code);
  const H = require('./../helperFunctions')(code);
  const stripe = require("stripe")(Config.STRIPE_SECRET_KEY)

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
        renderPage(S, res, S.s.payment.eventNotFound);
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
          renderPage(S, res, S.s.payment.alreadyAttending);
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
          renderPage(S, res, S.s.payment.eventNotFound);
        }
      }
    }, console.log);
  }
  else {
    console.log('/payment did not receive all required details:');
    renderPage(S, res, S.s.payment.eventNotFound);
  }
});


/*
  it will complete the payment*/
router.post('/charge.:code', (req, res) => {

  let code = req.params.code;
  const M = require('./../schemas.js')(code);
  const Send = require('./../send.js')(code);
  const Config = require('./../config')(code);
  const S = require('./../strings')(code);
  const H = require('./../helperFunctions')(code);
  const stripe = require("stripe")(Config.STRIPE_SECRET_KEY)

  let mid = req.query.mid;
  let eid = req.query.eid;
  let stripeToken = req.body.stripeToken;

  M.Event.findOne({_id: eid}, function(err, event){
    if(err) console.log(err);
    if(!event){
      console.log("Event not found");
      renderPage(S, res, S.s.payment.paymentError);
    }
    // Event Exists
    else {
      M.User.findOne({mid: mid}, function(e, user){
        if(e) console.log(e);
        if(!user){
          console.log("User not found");
          renderPage(S, res, S.s.payment.paymentError);
        }
        // Found User
        else {
          let uid = {_id: user._id}

          // FREE EVENT
          if (event.price === 0) {renderPage(S, res, "This is a free event");}

          // PAID EVENT
          else {
            let price = parseFloat(event.price) * 100;
            let charge = stripe.charges.create({
              amount: price, // amount in cents, again
              currency: "gbp",
              card: stripeToken,
              description: "",
              metadata: {_id:(uid._id + ""), eid: eid}
            },
            (err, charge) => {
              if (err && err.type === 'StripeCardError') {
                renderPage(S, res, S.s.payment.paymentError);
              }

              // PAYMENT Successful
              else {
                // Update Analytics
                M.Analytics.update({name:"Payments"},
                  {$push: {
                      activity: {
                        uid: uid._id,
                        time: new Date(),
                        eid: eid,
                        amount: price
                      }
                    },
                    $inc: {total: price}},
                  {upsert: true},
                console.log);

                // update user record
                M.User.findOneAndUpdate({_id:uid._id},
                  {$push: {events: {
                    eid: eid,
                    bookingReference: stripeToken,
                    joinDate: new Date()
                  }}},
                console.log);

                // update event rec
                M.Event.findOneAndUpdate({_id:eid},
                  {$push: {joined: {
                    uid: uid._id,
                    joinDate: new Date()
                  }}},
                console.log);

                // SEND RECEIPT to user
                Send.booked(uid, user.firstName + ' ' + user.lastName,
                   event.price, event.name, event.strapline, event.image_url,
                   stripeToken, Math.round((new Date()).getTime()/1000))
                renderPage(S, res, S.s.payment.bookingSuccessPaidMessenger);
              }
            });
          }
        }
      });
    }
  });
});

module.exports = router
