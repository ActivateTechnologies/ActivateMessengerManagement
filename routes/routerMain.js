'use strict'

const express = require('express');
const router = express.Router();
const multer = require('multer');
const M = require('./../server/schemas.js');
const FacebookWebhooks = require('./../server/facebookwebhooks.js');
const Broadcast = require('./../server/broadcast.js');
const Payment = require('./../server/payment.js');
const Dashboard = require('./../server/dashboard.js');

let upload = multer({dest:'uploads/'});

// FACEBOOKWEBHOOKS
router.get('/webhook', (req, res) => {
  FacebookWebhooks.processGetWebhook(req, res);
});

router.post('/webhook/', (req, res) => {
  FacebookWebhooks.processPostWebhook(req, res);
});

// BROADCAST
router.post('/message', (req, res) => {
  Broadcast.processMessage(req, res);
});

router.get('/broadcast', isLoggedIn, (req, res) => {
  res.render('broadcast');
});

// PAYMENT
router.get('/event', (req, res) => {
  Payment.processGetEvent(req, res);
})

router.get('/payment', function(req, res){
  Payment.processGetPayment(req, res)
});

router.post('/charge', function(req, res) {
  Payment.processPostCharge(req, res);
});

router.post('/custompayment', function(req, res){
  Payment.processPostCustomPayment(req, res);
});

router.get('/message', function(req, res){
  res.render('message');
});

router.get('/custompayment', function(req, res){
  res.render('custom_payment');
});

//DASHBOARD
router.get('/input', (req, res) => {
  res.render('input');
})

router.get('/users', (req, res) => {
  res.render('users');
});

router.get('/past', (req, res) => {
  res.render('past');
});

router.get('/events', (req, res) => {
  res.render('events');
});

router.get('/dashboard', (req, res) => {
  Dashboard.processGetDashboard(req, res);
});

router.get('/dashboardData', (req, res) => {
  Dashboard.processGetDashboardData(req, res);
});

router.post('/events', upload.single('image'), (req, res) => {
  Dashboard.processPostEvents(req, res);
});

router.delete('/events', (req, res) => {
  Dashboard.processDeleteEvents(req, res);
});

router.get('/players', (req, res) => {
  Dashboard.processGetPlayers(req, res);
});

router.get('/currentEvents', (req, res) => {
  Dashboard.processGetCurrentEvents(req, res);
});

router.get('/pastEvents', (req, res) => {
  Dashboard.processGetPastEvents(req, res);
});

router.get('/usersData', (req, res) => {
  Dashboard.processGetUsersData(req, res);
});

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/login');
}

module.exports = router
