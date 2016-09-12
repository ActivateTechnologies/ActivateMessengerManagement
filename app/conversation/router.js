'use strict'

const express = require('express');
const router = express.Router();
const FacebookWebhooks = require('./facebookwebhooks.js');

// FACEBOOKWEBHOOKS
router.get('/webhook.:code', (req, res) => {
  FacebookWebhooks('kickabout').processGetWebhook(req, res);
});

router.post('/webhook.:code', (req, res) => {
  FacebookWebhooks(req.params.code).processPostWebhook(req, res);
});

module.exports = router
