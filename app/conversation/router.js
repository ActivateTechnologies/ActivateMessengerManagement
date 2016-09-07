'use strict'

const express = require('express');
const router = express.Router();
const FacebookWebhooks = require('./facebookwebhooks.js');

// FACEBOOKWEBHOOKS
router.get('/webhook', (req, res) => {
  FacebookWebhooks('kickabout').processGetWebhook(req, res);
});

router.post('/webhook/kickabout', (req, res) => {
  FacebookWebhooks('kickabout').processPostWebhook(req, res);
});

module.exports = router
