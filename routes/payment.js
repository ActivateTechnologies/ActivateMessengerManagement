'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')
// const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
const stripe = require("stripe")("sk_live_VmcnYw9pEBlxDKGddvKvL8Hu")
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

  M.Game.find({_id:gameId}, function(err, result){
    if(err){
      console.log(err);
    }
    if(result.length > 0){
      let gameprice = result[0].price;
      res.render('payment', {
        mid:userId,
        gid: gameId,
        gameprice: gameprice,
        gameName: result[0].name,
        gameAddress: result[0].address,
        gameDescription: result[0].desc,
        imageLink: result[0].image_url
      });
    }
    else {
      console.log("Can't find game");
    }
  })
})

router.post('/charge', function(req, res) {

  let phoneNumber = req.body.pn;
  let gameId = req.query.gid;
  let price = parseFloat(req.query.gameprice) / 100;

  M.User.find({phoneNumber: phoneNumber}, function(err, results){
    if(err) console.log(err);

    //if existing user
    if(results[0].length > 0){
      //if free game
      if(req.body.type){
        M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {_id: results[0]._id}}}, function(err, doc){
          // send thanks for booking and details
        });
      }
      //else make him pay
      else {
        let stripeToken = req.body.stripeToken;

        let charge = stripe.charges.create({
          amount: req.query.gameprice, // amount in cents, again
          currency: "gbp",
          card: stripeToken,
          description: "",
          metadata: {_id:results[0]._id, gameId: gameId}
        }, function(err, charge) {
          if (err && err.type === 'StripeCardError') {
            res.send("Your payment wasn't processed");
          }
          else {

            M.Game.find({_id:gameId}, function(err2, result2){
              if(result2.length > 0){
                M.Analytics.update({name:"Payments"},{$push: {
                  activity: {
                    userId: results[0]._id,
                    time: new Date(),
                    gid: gameId,
                    amount: price
                  }
                }}, {upsert: true}, (err) => {console.log(err);});

                M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: sender}}}, function(err3, d){
                  send.booked(sender, results[0].firstname + " " + results[0].lastname, price, d.name, d.address, d.image_url, stripeToken);
                });
              }
            })

          }
        });
      }
    }

    // if new user
    else {
      //create new user
      let user = M.User({
        phoneNumber: phoneNumber
      })

      user.save(function(e, doc){
        if(e) console.log(e);
        else {
          //free game
          if(req.body.type){
            M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {_id: doc._id}}}, function(err, doc){
              // try sending message on messenger
              send.booked_with_phoneNumber()

              //if success then send him receipt

              //else send him text message
            });
          }

          // if paid game
          else {
            //make him pay
            let stripeToken = req.body.stripeToken;

          	let charge = stripe.charges.create({
          		amount: req.query.gameprice, // amount in cents, again
          		currency: "gbp",
          		card: stripeToken,
          		description: "",
              metadata: {_id:doc._id, gameId: gameId}
          	}, function(err, charge) {
          		if (err && err.type === 'StripeCardError') {
                res.send("Your payment wasn't processed");
          		}
              else {

                M.Game.find({_id:gameId}, function(err, result){
                    M.Analytics.update({name:"Payments"},{$push: {
                      activity: {
                        userId: doc._id,
                        time: new Date(),
                        gid: gameId,
                        amount: price
                      }
                    }}, {upsert: true}, (err) => {console.log(err);});
                    M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: doc._id}}}, function(err3, d){
                      //send him details of game for confirmation

                    });
                })

          		}
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
      console.log(err);
    } else {
      res.send("Success")
    }
  });
})

module.exports = router
