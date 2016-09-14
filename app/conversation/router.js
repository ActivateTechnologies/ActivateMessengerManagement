'use strict'

const express = require('express');
const router = express.Router();
const FacebookWebhooks = require('./facebookwebhooks.js');

// FACEBOOKWEBHOOKS
router.get('/webhook.:code', (req, res) => {
  // verifying webhook is same for all right now
  // can change this to use unique passwords for each webhook
  // current password is verify_me
  FacebookWebhooks('kickabout').processGetWebhook(req, res);
});

router.post('/webhook.:code', (req, res) => {
  FacebookWebhooks(req.params.code).processPostWebhook(req, res);
});

module.exports = router
