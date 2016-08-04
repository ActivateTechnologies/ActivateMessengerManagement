'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')
//const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
const stripe = require("stripe")("sk_live_VmcnYw9pEBlxDKGddvKvL8Hu")
const send = require('./../server/send.js')

router.get('/payment', function(req, res){
  let gameId = req.query.gid;
  let userId = req.query.mid;

  M.Button.update({name:"Book"},
    {$push: {activity: {userId:userId, time: new Date()}}},
    {upsert: true},
    function (error) {
      console.log('Error logging Book analytics:', error);
    })

  M.Game.find({_id:gameId}, function(err, result){
    if (err) {
      console.log('Error looking for game', err);
    }
    if(result.length > 0){
      let gameprice = result[0].price;
      res.render('payment', {
        mid:userId,
        gid: gameId,
        gameprice: gameprice,
        gameName: result[0].name,
        gameAddress: result[0].address,
        imageLink: result[0].image_url
      });
    }
    else {
      console.log("Can't find game");
      res.send('Game not found');
    }
  })
})

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

router.post('/charge', function(req, res) {

	var stripeToken = req.body.stripeToken;
  let sender = req.query.mid;
  let gameId = req.query.gid;
  let price = parseFloat(req.query.gameprice) / 100;

  M.User.find({userId:sender}, function(err, users){
    if (err) {
      console.log('Error finding user:', err);
    } else if (users.length > 0) {
      let uid = {
        _id: users[0]._id,
        mid: sender
      }
      if (users[0].phoneNumber) {
        uid.phoneNumber = users[0].phoneNumber;
      }
      let charge = stripe.charges.create({
        amount: req.query.gameprice, // amount in cents, again
        currency: "gbp",
        card: stripeToken,
        description: "",
        metadata: {uid:uid._id, gameId: gameId}
      }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
          res.send("Your payment wasn't processed");
        } else {
          M.Game.find({_id:gameId}, function(err, result){
            let check = true;
            if(result.length > 0){
              M.Analytics.update({name:"Payments"},{$push: {
                activity: {
                  uid: uid._id, 
                  time: new Date(),
                  gid: gameId,
                  amount: price
                }
              }}, {upsert: true}, (err) => {
                console.log('Error logging Payments analytics', err);
              });
              M.Game.findOneAndUpdate({_id:gameId},
               {$push: {joined: {uid: users[0]._id}}},
               (err, doc) => {
                send.booked(uid, users[0].firstname + " " + users[0].lastname, 
                  price, doc.name, doc.address, doc.image_url, stripeToken);
              });
            }
          })
          res.redirect('http://m.me/kickaboutapp');
        }
      });
    }
  });
});

module.exports = router
