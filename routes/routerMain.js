'use strict'

const express = require('express');
const router = express.Router();
const multer = require('multer');
const M = require('./../server/schemas.js');
const FacebookWebhooks = require('./../server/facebookwebhooks.js');
const Broadcast = require('./../server/broadcast.js');
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

// BROADCAST
router.post('/message', (req, res) => {
  Broadcast.processMessage(req, res);
});

router.get('/message', isLoggedIn, (req, res) => {
  res.render('message', {
    s: {
      company: S.s.company
    }
  });
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

//DASHBOARD
router.get('/input', isLoggedIn, (req, res) => {
  res.render('input', {
    s: {
      company: S.s.company
    }
  });
})

router.get('/users', isLoggedIn, (req, res) => {
  res.render('users', {
    s: {
      company: S.s.company
    }
  });
});

router.get('/events', isLoggedIn, (req, res) => {
  Dashboard.processGetEvents(req, res);
});

router.get('/dashboard', isLoggedIn, (req, res) => {
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

router.get('/players', isLoggedIn, (req, res) => {
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

/*// TOOLS
router.get('/tools-uid-mid', (req, res) => {
  Tools.duplicateUseridToMid(req, res);
});*/


function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/login');
}

module.exports = router
