'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')
const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
// const stripe = require("stripe")("sk_live_VmcnYw9pEBlxDKGddvKvL8Hu")
const send = require('./../server/send.js')
const twilio = require('./../server/twilio.js')

router.get('/game', function(req, res){
  let gameId = req.query.gid;
  let pn = req.query.pn;

  M.Game.find({_id:gameId}, function(err, result){
    if (err) {
      console.log('Error looking for game', err);
    }
    if(result.length > 0){
      let gameprice = result[0].price;
      if(pn){
        res.render('game', {
          pn: pn,
          gid: gameId,
          gameprice: gameprice,
          gameName: result[0].name,
          gameAddress: result[0].address,
          gameDescription: result[0].desc,
          imageLink: result[0].image_url
        });
      }
      else {
        res.render('game', {
          gid: gameId,
          gameprice: gameprice,
          gameName: result[0].name,
          gameAddress: result[0].address,
          gameDescription: result[0].desc,
          imageLink: result[0].image_url
        });
      }
    }
    else {
      console.log("Can't find game with gid = '" + gameId + "'");
      res.send('Game not found');
    }
  })
})


router.get('/payment', function(req, res){
  let gameId = req.query.gid;
  let pn = req.query.pn;
  let gameprice = req.query.gp;

  res.render('payment', {
    gid: gameId,
    gameprice: gameprice,
    pn: pn
  })
})

router.post('/charge', function(req, res) {

  let phoneNumber = '+44' + req.query.pn;
  let gameId = req.query.gid;
  let price = parseFloat(req.query.gameprice) / 100;

  console.log("price: " + price);
  console.log("phoneNumber: " + phoneNumber);

  M.User.find({phoneNumber: phoneNumber}, function(err, results){
    if(err) console.log(err);

    //if existing user
    if (results.length > 0) {
      let uid = {
        _id: results[0]._id
      }
      if (results[0].userId) {
        uid.mid = results[0].userId;
      }
      if (results[0].phoneNumber) {
        uid.phoneNumber = results[0].phoneNumber;
      }

      //if free game
      if(price === 0){
        console.log("free game");
        M.Game.findOneAndUpdate({_id:gameId}, 
          {$push: {joined: {_id: results[0]._id}}}, (err, doc) => {
          //need to add game details to message
          console.log("send to " + uid.mid);
          send.text(uid, "Thanks for booking", (error) => {
            if (error) {
              console.log('User not found on db or via fb linked phonenumber,'
                + ' sending sms.');
              sendSmsMessage(uid, results[0], true, false);
            }
          });
        });
      }
      //else make him pay
      else {
        console.log("paid game");
        makeCharge(req.query.gameprice, req.body.stripeToken, uid, gameId, () => {
          M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {uid: uid._id}}}, 
           (err3, d) => {
            send.booked(uid, results[0].firstname + ' ' + results[0].lastname,
             price, d.name, d.address, d.image_url, req.body.stripeToken, (error) => {
              if (error) {
                console.log('User not found on db or via fb linked phonenumber,'
                  + ' sending sms.');
                sendSmsMessage(uid, results[0], true, true);
              }
             });
          });
        });
      }
      res.send("sent message")
    }

    // if new user
    else {
      console.log("new user");
      //create new user
      let user = M.User({
        phoneNumber: phoneNumber
      })
      user.save(function(e, doc){
        let uid = {
          _id: doc._id,
          phoneNumber: phoneNumber
        }
        if(e) console.log(e);
        else {
          //free game
          if(price === 0){
            console.log("free game");
            M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {_id: doc._id}}}, 
             (err, doc) => {
              // try sending message on messenger
              send.text_with_phoneNumber(phoneNumber, "Thanks for booking.")
              .then(()=>{res.send("text")})
              .catch((e2)=>{
                console.log('User not found on db or via fb linked phonenumber,'
                  + ' sending sms.');
                sendSmsMessage(uid, results[0], false, false);
              })

            });
          }

          // if paid game
          else {
            console.log("paid game");
            //make him pay

            makeCharge(req.query.gameprice, req.body.stripeToken, uid, gameId, () => {
              console.log("made charge");
              M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {uid: doc._id}}}, 
               (err3, d) => {
                console.log("sending game detail using phoneNumber");
                //send him details of game for confirmation
                send.booked_with_phoneNumber(phoneNumber, phoneNumber, price, d.name, 
                  d.address, d.image_url, req.body.stripeToken)
                //if success
                .then(()=>{res.send('sent message');})
                //else send him text message
                .catch((e2)=>{
                  console.log('User not found on db or via fb linked phonenumber,'
                    + ' sending sms.');
                  sendSmsMessage(uid, results[0], false, true);
                })
              });
            });
          }
        }
      })

    }
  })
});

router.get('/custompayment', function(req, res){
  res.render('custom_payment');
})

router.post('/custompayment', function(req, res){
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
})

function makeCharge(gameprice, stripeToken, uid, gameId, callback){
  let price = parseFloat(gameprice) / 100;
  let charge = stripe.charges.create({
    amount: gameprice, // amount in cents, again
    currency: "gbp",
    card: stripeToken,
    description: "",
    metadata: {_id:(uid._id + ""), gameId: gameId}
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      res.send("Your payment wasn't processed");
    }
    else {
      M.Game.find({_id:gameId}, function(err, result){
        if(result.length > 0){
          M.Analytics.update({name:"Payments"},{$push: {
            activity: {
              uid: uid._id + 'one',
              time: new Date(),
              gid: gameId,
              amount: price
            }
          }}, {upsert: true}, (e, results) => {
            if (e) {
              console.log('Error logging payments analytics: ', e, results);
            }
          });
        }
      })
      callback();
    }
  });
}

function sendSmsMessage(uid, game, existingUser, paidGame) {
  if (paidGame) {
    twilio.sendSms(phoneNumber, "Payment Confirmed! Here's your game details:/n", () => {
      console.log('Sms sent');
    });
  } else {
    twilio.sendSms(phoneNumber, "Thanks for booking", () => {
      console.log('Sms sent');
    });
  }
}

module.exports = router;
