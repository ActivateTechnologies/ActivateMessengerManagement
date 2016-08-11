'use strict'

const M = require('./../server/schemas.js')
const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
// const stripe = require("stripe")("sk_live_VmcnYw9pEBlxDKGddvKvL8Hu")
const Send = require('./../server/send.js');
const Config = require('./../config');
const H = require('./../server/helperFunctions');
const Twilio = require('./../server/twilio.js');

function processGetEvent(req, res) {
  M.Event.find({_id:req.query.eid}, (err, results) => {
    if (err) {
      console.log('Error finding event with eid "' + req.query.eid + '":', err);
      res.send('The event you are looking for does not exist.');
    } else if (results.length > 0) {
      res.render('event', {
        eid: req.query.eid,
        event: results[0],
        config: {
          FACEBOOK_APP_ID: Config.FACEBOOK_APP_ID,
          FACEBOOK_PAGE_ID: Config.FACEBOOK_PAGE_ID,
          ROOT_URL: Config.ROOT_URL
        }
      });
    } else {
      console.log('No events with eid "' + req.query.eid + '" found.');
      res.send('The event you are looking for does not exist.');
    }
  });
}

function processGetPayment(req, res) {
  let eventId = req.query.eid;
  let pn = req.query.pn;
  let eventPrice = req.query.eventPrice;

  if (eventId && pn && eventPrice) {
    M.User.find({phoneNumber: '+44' + pn}, (err, users) => {
      if (err || !users.length) {
        console.log('/payment: Error finding users:', (err) ? err : 'No users found');
        sendPaymentPageWithMessage(res, 'The event you are looking for does not exist', null, pn, false);
      } else {
        let userAlreadyAttending = false;
        for (let i = 0; i < users[0].events.length && !userAlreadyAttending; i++) {
          userAlreadyAttending = users[0].events[i].eid == eventId;
        }
        if (userAlreadyAttending) {
          sendPaymentPageWithMessage(res, 'You are already attending this event.', null, pn, false);
        } else {
          M.Event.find({_id: eventId}, (err, events) => {
            if (err || events.length == 0) {
              console.log('Error getting event with id "' + eventId + '":'
                + ((events.length != 0) ? JSON.stringify(err) : 'No events found'));
              sendPaymentPageWithMessage(res, 'The event you are looking for does not exist', null, pn, false);
            } else {
              res.render('payment', {
                eid: eventId,
                eventPrice: eventPrice,
                pn: pn,
                event: events[0]
              });
            }
          });
        }
      }
    });
  } else {
    console.log('/payment did not receive all required details:',
      eventId, pn, eventPrice);
    sendPaymentPageWithMessage('The event you are looking for does not exist', null, pn, false);
  }
}

function sendPaymentPageWithMessage(res, message, event, pn, showPayment) {
  let paymentDivDisplay = (showPayment) ? '' : 'none';
  let objectToSend = {
    pn: pn,
    message: message,
    paymentDivDisplay: paymentDivDisplay
  }
  if (event) {
    objectToSend.event = event;
  }
  res.render('payment_complete', objectToSend);
}

function processPostCharge(req, res) {
  let phoneNumber = '+44' + req.query.pn;
  let eventId = req.query.eid;
  let price = parseFloat(req.query.eventPrice) / 100;

  M.User.find({phoneNumber: phoneNumber}, (err, users) => {
    if (err) {
      console.log('Error querying for user with phoneNumber:', err);
    }
    if (users.length > 0) { //EXISTING USER
      let uid = {
        _id: users[0]._id,
        phoneNumber: users[0].phoneNumber
      }
      if (users[0].mid) {
        uid.mid = users[0].mid;
      }
      if (price === 0) { //FREE GAME
        console.log("Free Event");
        H.updateUserEventAnalytics(uid, eventId, price, (event, error) => {
          sendPaymentPageWithMessage(res, 'Your payment has gone through. '
           + 'You should get a receipt in your Facebook messenger shortly.',
           event, phoneNumber, false);
          if (!error) {
            console.log("Send to " + uid.mid);
            Send.text(uid, "Thanks for booking", (error) => {
              if (error) {
                console.log('User not found on db or via fb linked pn, using sms.');
                sendSmsMessage(uid, event, true, false);
              }
            });
          }
        })
      } else { //PAID GAME
        console.log("Paid Event");
        makeCharge(res, req.query.eventPrice, req.body.stripeToken, uid, eventId,
         () => {
          H.updateUserEventAnalytics(uid, eventId, price, (event, error) => {
            sendPaymentPageWithMessage(res, 'Your payment has gone through. '
             + 'You should get a receipt in your Facebook messenger shortly.',
             event, phoneNumber, false);
            if (!error) {
              Send.booked(uid, users[0].firstName + ' ' + users[0].lastName,
               price, event.name, event.address, event.image_url, req.body.stripeToken,
               (error) => {
                if (error) {
                  console.log('User not found on db or via fb linked pn, using sms.');
                  sendSmsMessage(uid, event, true, true);
                }
              });
            }
          });
        });
      }
    } else { //NEW USER
      console.log("New User");
      let user = M.User({
        phoneNumber: phoneNumber
      })
      user.save((error, user) => {
        let uid = {
          _id: user._id,
          phoneNumber: phoneNumber
        }
        if (error) {
          console.log('Error saving user\'s phone number:', error);
        } else {
          if (price === 0) { //FREE GAME
            console.log("Free Event");
            H.updateUserEventAnalytics(uid, eventId, price, (event, error) => {
              sendPaymentPageWithMessage(res, 'Your payment has gone through. '
               + 'You should get a receipt in your Facebook messenger shortly.',
               event, phoneNumber, false);
              if (!error) {
                Send.textWithPhoneNumber(uid.phoneNumber, "Thanks for booking.")
                .then(() => {
                  //res.send("Sent sms.")
                }).catch((e2)=>{
                  console.log('User not found on db or via fb linked pn, using sms.');
                  sendSmsMessage(uid, event, false, false);
                })
              }
            });
          } else { //PAID GAME
            console.log("Paid Event");
            makeCharge(res, req.query.eventPrice, req.body.stripeToken, uid, eventId,
             () => {
              H.updateUserEventAnalytics(uid, eventId, price, (event, error) => {
                sendPaymentPageWithMessage(res, 'Your payment has gone through. '
                 + 'You should get a receipt in your Facebook messenger shortly.',
                 event, phoneNumber, false);
                if (!error) {
                  Send.bookedWithPhoneNumber(phoneNumber, phoneNumber, price, d.name, 
                   d.address, d.image_url, req.body.stripeToken).then(() => {
                    //res.send('Sent Message.');
                  }).catch((e2)=>{
                    console.log('User not found on db or via fb linked pn, using sms.');
                    sendSmsMessage(uid, results[0], false, true);
                  });
                }
              });
            });
          }
        }
      });
    }
  });
}

function processPostCustomPayment(req, res) {
  var stripeToken = req.body.stripeToken;
  var charge = stripe.charges.create({
    amount: (parseFloat(req.body.amount)) * 100, // amount in cents, again
    currency: "gbp",
    source: stripeToken,
    description: req.body.reference
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      res.send(err.message)
      console.log('Error with stripe charge', err);
    } else {
      res.send("Success")
    }
  });
}

function makeCharge(res, eventPrice, stripeToken, uid, eventId, callback){
  let price = parseFloat(eventPrice) / 100;
  let charge = stripe.charges.create({
    amount: eventPrice, // amount in cents, again
    currency: "gbp",
    card: stripeToken,
    description: "",
    metadata: {_id:(uid._id + ""), eventId: eventId}
  }, (err, charge) => {
    if (err && err.type === 'StripeCardError') {
      sendPaymentPageWithMessage(res, 'Your payment did not go through, '
       + 'please try again.', null, uid.phoneNumber, true);
    }
    else {
      callback();
    }
  });
}

function sendSmsMessage(uid, event, existingUser, paidEvent) {
  if (paidEvent) {
    Twilio.sendSms(uid.phoneNumber, "Payment of £" + event.price.toFixed(2)
      + " confirmed! Here're your event details:\n"
      + event.name + "\n"
      + event.address + "\n"
      + event.when.toString().substring(0,10) + "\n", () => {
      console.log('Sms sent');
    });
  } else {
    Twilio.sendSms(uid.phoneNumber, "Thank you for booking with kickabout!"
      + "Here're your event details:\n"
      + event.name + "\n"
      + event.address + "\n"
      + event.when.toString().substring(0,10) + "\n", () => {
      console.log('Sms sent');
    });
  }
}

module.exports = {
  processGetEvent: processGetEvent,
  processGetPayment: processGetPayment,
  processPostCharge: processPostCharge,
  processPostCustomPayment: processPostCustomPayment
};