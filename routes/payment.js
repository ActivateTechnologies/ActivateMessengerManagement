'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')
const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")

router.get('/payment', function(req, res){
  let gameId = req.query.gid;
  let userId = req.query.mid;
  console.log(gameId);
  M.Game.find({_id:gameId}, function(err, result){
    if(err){
      console.log(err);
    }
    console.log(result);
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

router.post('/charge', function(req, res) {

	var stripeToken = req.body.stripeToken;
  console.log(req.body.mid);
  console.log(req.body.gid);
	// var charge = stripe.charges.create({
	// 	amount: 1000, // amount in cents, again
	// 	currency: "gbp",
	// 	card: stripeToken,
	// 	description: "payinguser@example.com",
  //   metadata: {userId:111234324, gameId: 12341234}
	// }, function(err, charge) {
	// 	if (err && err.type === 'StripeCardError') {
	// 		// The card has been declined
	// 	} else {
	// 		//Render a thank you page called "Charge"
	// 		res.render('charge');
	// 	}
	// });

});

module.exports = router
