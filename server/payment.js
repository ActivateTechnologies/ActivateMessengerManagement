'use strict'

const M = require('./../server/schemas.js')
//const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
const stripe = require("stripe")("sk_live_VmcnYw9pEBlxDKGddvKvL8Hu")
const Send = require('./../server/send.js');
const Config = require('./../config');
const Strs = require('./../strings');
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
  let eid = req.query.eid;
  let phoneNumber = '+44' + req.query.pn;
  let eventObject, price;
  if (eid && phoneNumber) {
    M.Event.find({_id: eid}).exec().catch((error) => {
      console.log('Error quering for event with id ' + eid + ':', error);
    }).then((events) => {
      eventObject = events[0];
      price = eventObject.price;
      return M.User.find({phoneNumber: phoneNumber}).exec();
    }).catch((error) => {
      console.log('Error querying for user with phoneNumber ' + phoneNumber + ':',
       error);
      renderPage(res, 'The event you are looking for does not exist',
       null, phoneNumber, false);
    }).then((users) => {
      if (users.length == 0) {
        console.log('No users found');
        /*renderPage(res, 'The event you are looking for does not exist',
         null, phoneNumber, false);*/
        if (price > 0) {
          res.render('payment', {
            eid: eid,
            pn: req.query.pn,
            event: eventObject,
            STRIPE_PUBLIC_KEY: Config.STRIPE_PUBLIC_KEY
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
          renderPage(res, 'You are already attending this event.',
           null, phoneNumber, false);
        } else if (price > 0) {
          res.render('payment', {
            eid: eid,
            pn: req.query.pn,
            event: eventObject,
            STRIPE_PUBLIC_KEY: Config.STRIPE_PUBLIC_KEY
          });
        } else {
          processGetCharge(req, res, {
            pn: req.query.pn,
            eid: req.query.eid
          });
        }
      }
    });
  } else {
    console.log('/payment did not receive all required details:',
     eid, phoneNumber);
    renderPage(res, 'The event you are looking for does not exist',
     null, phoneNumber, false);
  }
}

function processGetCharge(req, res, params) {
  let phoneNumber = (params) ? '+44' + params.pn : '+44' + req.query.pn;
  let eid = (params) ? params.eid : req.query.eid;
  let eventObject;
  let price;
  let pageRendered = false;

  M.Event.find({_id: eid}).exec().catch((error) => {
    console.log('Error quering for event with id ' + eid + ':', error);
  }).then((events) => {
    eventObject = events[0];
    price = eventObject.price;
    return M.User.find({phoneNumber: phoneNumber}).exec();
  }).catch((error) => {
    console.log('Error querying for user with phoneNumber ' + phoneNumber + ':',
     error);
  }).then((users) => {
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
        H.updateUserEventAnalytics(uid, eid, price, req.body.stripeToken)
        .catch((error) => {
        }).then((event) => {
          /*return Send.textPromise(uid,
           "Booking successful! Thank you for booking :)");*/
          return Send.bookedPromise(uid, users[0].firstName + ' ' 
           + users[0].lastName, price, event.name, event.strapline, event.image_url,
           uid._id + '-' + event._id, Math.round((new Date()).getTime()/1000));
        }).catch((error) => {
          console.log('User not found on db or via fb linked pn, using sms.');
          sendSmsMessage(uid, eventObject, true, false);
          renderPage(res, 'Booking successful! We\'ve sent you a confirmation text'
            + ' to ' + uid.phoneNumber + '.', eventObject, phoneNumber, false);
          pageRendered = true;
        }).then(() => {
          if (!pageRendered) {
            renderPage(res, 'Booking successful! You should get a confirmation in'
             + ' your Facebook Messenger shortly.', eventObject, phoneNumber, false);
          }
        });
      } else { //PAID GAME
        console.log("Paid Event");
        makeCharge(res, req.query.eventPrice, req.body.stripeToken, uid, eid)
        .catch(() => {
        }).then(() => {
          return H.updateUserEventAnalytics(uid, eid, price, req.body.stripeToken);
        }).catch((error) => {
        }).then((event) => {
          return Send.bookedPromise(uid, users[0].firstName + ' ' 
           + users[0].lastName, price, event.name, event.strapline, event.image_url,
           req.body.stripeToken, Math.round((new Date()).getTime()/1000));
        }).catch((error) => {
          console.log('User not found on db or via fb linked pn, using sms.');
          sendSmsMessage(uid, eventObject, true, true);
          renderPage(res, 'Your payment has gone through. We\'ve sent you a '
           + 'receipt to ' + uid.phoneNumber + '.', eventObject, phoneNumber, false);
          pageRendered = true;
        }).then(() => {
          console.log('Existing, paid, message sent');
          if (!pageRendered) {
            renderPage(res, 'Your payment has gone through. You should get a'
             + ' receipt in your Facebook Messenger shortly.', eventObject,
             phoneNumber, false);
          }
        });
      }
    } else { //NEW USER
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
        } else if (price === 0) { //FREE GAME
          console.log("Free Event");
          let eventObject;
          H.updateUserEventAnalytics(uid, eid, price, req.body.stripeToken)
          .catch((error) => {
          }).then((event) => {
            eventObject = event;
            /*return Send.textWithPhoneNumber(uid.phoneNumber, 'Booking successful!'
             + ' Thank you for booking :)');*/
            return Send.bookedPromise(uid, phoneNumber, price, event.name,
             event.strapline, event.image_url, uid._id + '-' + event._id,
             Math.round((new Date()).getTime()/1000));
          }).catch((error)=>{
            console.log('User not found on db or via fb linked pn, using sms.');
            sendSmsMessage(uid, eventObject, false, false);
            renderPage(res, 'Booking successful! We\'ve sent you a confirmation'
             + ' text to ' + uid.phoneNumber + '.', eventObject, phoneNumber, false);
            pageRendered = true;
          }).then(() => {
            if (!pageRendered) {
              renderPage(res, 'Booking successful! You should get a receipt in your'
               + ' Facebook messenger shortly.', eventObject, phoneNumber, false);
            }
          })
        } else { //PAID GAME
          console.log("Paid Event");
          let eventObject;
          makeCharge(res, req.query.eventPrice, req.body.stripeToken, uid, eid)
          .catch((error) => {
          }).then(() => {
            return H.updateUserEventAnalytics(uid, eid, price, req.body.stripeToken);
          }).catch((error) => {
          }).then((event) => {
            eventObject = event;
            return Send.bookedPromise(uid, phoneNumber, price,event.name,
              event.strapline, event.image_url, req.body.stripeToken);
          }).catch((error)=>{
            console.log('User not found on db or via fb linked pn, using sms.');
            sendSmsMessage(uid, eventObject, false, true);
            renderPage(res, 'Your payment has gone through. We\'ve sent you a'
             + ' receipt to ' + uid.phoneNumber + '.', eventObject,
             phoneNumber, false);
            pageRendered = true;
          }).then(() => {
            if (!pageRendered) {
              renderPage(res, 'Your payment has gone through. '
               + 'You should get a receipt in your Facebook messenger shortly.',
               eventObject, phoneNumber, false);
            }
          });
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
    STRIPE_PUBLIC_KEY: Config.STRIPE_PUBLIC_KEY
  }
  if (event) {
    objectToSend.event = event;
    objectToSend.event.priceString = event.price.toFixed(2);
  } else {
    console.log('Rendering page with no event object');
  }
  res.render('payment_complete', objectToSend);
}

function processPostCustomPayment(req, res) {
  var stripeToken = req.body.stripeToken;
  var charge = stripe.charges.create({
    amount: (parseFloat(req.body.amount)) * 100, // amount in cents, again
    currency: "gbp",
    source: stripeToken,
    description: req.body.reference + ', User Name: ' + req.body.name
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

function makeCharge(res, eventPrice, stripeToken, uid, eid) {
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
        renderPage(res, 'Your payment did not go through, '
         + 'please try again.', null, uid.phoneNumber, true);
        reject();
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
    let textString = Strs.s.sms.paidEventConfirmation;
    textString = textString.replace(Strs.h + 'name', event.name)
     .replace(Strs.h + 'strapline', event.strapline)
     .replace(Strs.h + 'mapsUrl', directionUrl)
     .replace(Strs.h + 'messengerUrl', Config.MESSENGER_URL);
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
    let textString = Strs.s.sms.freeEventConfirmation;
    textString = textString.replace(Strs.h + 'name', event.name)
     .replace(Strs.h + 'strapline', event.strapline)
     .replace(Strs.h + 'mapsUrl', directionUrl)
     .replace(Strs.h + 'messengerUrl', Config.MESSENGER_URL);
    Twilio.sendSms(uid.phoneNumber, textString, (error) => {
      if (error) {
        console.log('Error sending sms:', error);
      } else {
        console.log('Sms sent');
      }
    });
  }
}

module.exports = {
  processGetEvent: processGetEvent,
  processGetPayment: processGetPayment,
  processGetCharge: processGetCharge,
  processPostCustomPayment: processPostCustomPayment
};