'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')
// const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
const send = require('./../server/send.js')

router.get('/payment', function(req, res){
  let gameId = req.query.gid;
  let userId = req.query.mid;

  M.Button.update({name:"Book"},
    {$push: {activity: {userId:userId, time: new Date()}}},
    {upsert: true},
    function(err){
      console.log(err);
    })

  console.log(gameId);
  M.Game.find({_id:gameId}, function(err, result){
    if(err){
      console.log(err);
    }
    if(result.length > 0){
      console.log("here");
      let gameprice = result[0].price;
      res.render('payment', {
        mid:userId,
        gid: gameId,
        gameprice: gameprice
      });
    }
    else {
      console.log("not here");
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
      console.log(err);
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

	let charge = stripe.charges.create({
		amount: req.query.gameprice, // amount in cents, again
		currency: "gbp",
		card: stripeToken,
		description: "",
    metadata: {userId:sender, gameId: gameId}
	}, function(err, charge) {
		if (err && err.type === 'StripeCardError') {
      res.send("Your payment wasn't processed");
		} else {
      M.User.find({userId:sender}, function(err, users){
        if(err){
          console.log(err);
        }
        if(users.length > 0){
          M.Game.find({_id:gameId}, function(err, result){
            let check = true;
            if(result.length > 0){
              M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: sender}}}, function(err, doc){
                send.booked(sender, users[0].firstname + " " + users[0].lastname, price, doc.name, doc.address, doc.image_url, stripeToken);
              });
            }
          })
        }
      })
      res.redirect('http://m.me/kickaboutapp');
		}
	});

});

module.exports = router
