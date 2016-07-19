'use strict'

const express = require('express');
const router = express.Router();

router.get('/broadcast', function (req, res) {
    res.render('broadcast');
});

module.exports = router
