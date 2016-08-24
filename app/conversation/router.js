'use strict'

const express = require('express');
const router = express.Router();
const FacebookWebhooks = require('./../server/facebookwebhooks.js');

// FACEBOOKWEBHOOKS
router.get('/webhook', (req, res) => {
  FacebookWebhooks.processGetWebhook(req, res);
});

router.post('/webhook/', (req, res) => {
  FacebookWebhooks.processPostWebhook(req, res);
});

module.exports = router
