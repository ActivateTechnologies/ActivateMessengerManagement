'use strict'

const express = require('express')
const router = express.Router()
const M = require('./../server/schemas.js')
const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
// const stripe = require("stripe")("sk_live_VmcnYw9pEBlxDKGddvKvL8Hu")
const send = require('./../server/send.js')
const twilio = require('./../server/twilio.js')

router.get('/payment', function(req, res){
  let gameId = req.query.gid;
  let pn = req.query.pn;

  M.Game.find({_id:gameId}, function(err, result){
    if (err) {
      console.log('Error looking for game', err);
    }
    if(result.length > 0){
      let gameprice = result[0].price;
      if(pn){
        res.render('payment', {
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
        res.render('payment', {
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
      console.log("Can't find game");
      res.send('Game not found');
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
    if(results.length > 0){
      //if free game
      if(req.body.type){
        M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {_id: results[0]._id}}}, function(err, doc){
          //need to add game details to message
          send.text(results[0].userId, "Thanks for booking");
        });
      }
      //else make him pay
      else {
        makeCharge(req.query.gameprice, req.body.stripeToken, results[0]._id, gameId, function(){
          M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: userId}}}, function(err3, d){
            send.booked(results[0].userId, results[0].name, price, d.name, d.address, d.image_url, stripeToken);
          });
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
              send.text_with_phoneNumber(phoneNumber, "Thanks for booking.")
              .then(()=>{res.send("text")})
              .catch((e2)=>{
                //function for sending text (need to add game details)
                twilio.sendSms(phoneNumber, "Thanks for booking", function(){
                  res.send("sent text")
                })
              })

            });
          }

          // if paid game
          else {
            //make him pay
            makeCharge(req.query.gameprice, req.body.stripeToken, doc._id, gameId, function(){
              M.Game.findOneAndUpdate({_id:gameId}, {$push: {joined: {userId: doc._id}}}, function(err3, d){
                //send him details of game for confirmation
                send.booked_with_phoneNumber(phoneNumber, phoneNumber, price, d.name, d.address, d.image_url, stripeToken)
                //if success
                .then(()=>{res.send('sent message');})
                //else send him text message
                .catch((e2)=>{
                  //need to add game details
                  twilio.sendSms(phoneNumber, "Thanks for booking paid game", function(){
                    res.send("sent text")
                  })
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

function makeCharge(gameprice, stripeToken, userId, gameId, callback){
  let price = parseFloat(gameprice) / 100;
  let charge = stripe.charges.create({
    amount: gameprice, // amount in cents, again
    currency: "gbp",
    card: stripeToken,
    description: "",
    metadata: {_id:userId, gameId: gameId}
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      res.send("Your payment wasn't processed");
    }
    else {
      M.Game.find({_id:gameId}, function(err2, result2){
        if(result2.length > 0){
          M.Analytics.update({name:"Payments"},{$push: {
            activity: {
              userId: userId,
              time: new Date(),
              gid: gameId,
              amount: price
            }
          }}, {upsert: true}, (err) => {console.log(err);});

          callback();
        }
      })
    }
  });
}

module.exports = router;
