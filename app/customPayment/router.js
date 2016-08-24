'use strict'

const express = require('express');
const router = express.Router();
const stripe = require("stripe")("sk_test_Lspvreo5c3SnUK7EzaX7Ns1E")
// const stripe = require("stripe")("sk_live_VmcnYw9pEBlxDKGddvKvL8Hu")

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

router.get('/custompayment', (req, res) => {
  res.render('customPayment/custom_payment', {
    s: {
      company: S.s.company
    }
  });
});

router.post('/custompayment', (req, res) => {
  processPostCustomPayment(req, res);
});
