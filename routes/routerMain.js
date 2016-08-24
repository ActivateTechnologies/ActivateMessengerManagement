'use strict'

const express = require('express');
const router = express.Router();
const multer = require('multer');
const M = require('./../server/schemas.js');
const FacebookWebhooks = require('./../server/facebookwebhooks.js');
const Payment = require('./../server/payment.js');
const Dashboard = require('./../server/dashboard.js');
const Tools = require('./../server/tools.js');
const S = require('./../strings');

let upload = multer({dest:'uploads/'});

// FACEBOOKWEBHOOKS
router.get('/webhook', (req, res) => {
  FacebookWebhooks.processGetWebhook(req, res);
});

router.post('/webhook/', (req, res) => {
  FacebookWebhooks.processPostWebhook(req, res);
});

// PAYMENT
router.get('/event', (req, res) => {
  Payment.processGetEvent(req, res);
})

router.get('/payment', (req, res) => {
  Payment.processGetPayment(req, res);
});

router.get('/charge', (req, res) => {
  Payment.processGetCharge(req, res);
});

router.post('/charge', (req, res) => {
  Payment.processGetCharge(req, res);
});

router.post('/custompayment', (req, res) => {
  Payment.processPostCustomPayment(req, res);
});

router.get('/userFromPhoneNumber', (req, res) => {
  Payment.processGetUserFromPhoneNumber(req, res);
});

router.get('/custompayment', (req, res) => {
  res.render('custom_payment', {
    s: {
      company: S.s.company
    }
  });
});

/*// TOOLS
router.get('/tools-uid-mid', (req, res) => {
  Tools.duplicateUseridToMid(req, res);
});*/

module.exports = router
