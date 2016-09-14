'use strict'

const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs')
const multer = require('multer');
const upload = multer({dest:'uploads/'});


/*
  renders the /events page */
router.get('/events.:code', isLoggedIn, (req, res) => {

  const code = req.params.code;
  const S = require('./../strings')(code);
  const config = require('./../config')(code);

  res.render('events/events', {
    config: {
      ROOT_URL: config.ROOT_URL
    },
    s: {
      company: S.s.company
    }
  });

});


/*
  handles creating a new event */
router.post('/events.:code', upload.single('image'), (req, res) => {

  const code = req.params.code;
  console.log("code in events:", code);
  const S = require('./../strings')(code);
  const M = require('./../models/' + code);
  const config = require('./../config')(code);

  AWS.config.update({
    accessKeyId: config.AWSaccessKeyId,
    secretAccessKey: config.AWSsecretAccessKey
  });

  let s3 = new AWS.S3();

  let data = {
    name: req.body.title,
    strapline: req.body.strapline,
    latlong: req.body.latlong.replace(/\s+/g, ''),
    desc: req.body.desc,
    when: req.body.when,
    capacity: req.body.capacity,
    non_members_attending: req.body.non_members_attending,
    price: parseFloat(req.body.price)
  };

  //if file is uploaded then updating the event or changing depending on id
  if (req.file) {
    let file = req.file
    let imagename = file.filename;

    var params = {
      Bucket: 'kickabout-messenger',
      Key: imagename,
      Body: fs.readFileSync(file.path)
    };

    s3.putObject(params, function (perr, pres) {
      if (perr) {
        console.log("Error uploading data: ", perr);
        res.send(perr);
      }
      else {
        let urlParams = {Bucket: 'kickabout-messenger', Key: imagename, Expires: 30000000};
        let image_url = s3.getSignedUrl('getObject', urlParams);

        data.image_name = imagename;
        data.image_url = image_url

        // Editing event with image
        if (req.body.id) {
          M.Event.findOneAndUpdate({_id:req.body.id}, data, (err) => {
            if (err) console.log(err);
            res.render('events/events', {
              config: {ROOT_URL: config.ROOT_URL},
              s: {company: S.s.company}
            });
          })
        }

        // Adding event with image
        else {
          let event = M.Event(data);
          event.save((err) => {
            if (err) console.log(err);
            res.render('events/events', {
              config: {ROOT_URL: config.ROOT_URL},
              s: {company: S.s.company}
            });
          })
        }
      }
    });
  }

  //if no image uploaded then updating the event or saving depending on presence of id
  else {
    data.image_url = req.body.image_url;
    data.image_name = req.body.image_name;

    // Editing event without image
    if (req.body.id) {
      M.Event.findOneAndUpdate({_id:req.body.id}, data, (err) => {
        if (err) console.log(err);
        res.render('events/events', {
          config: {ROOT_URL: config.ROOT_URL},
          s: {company: S.s.company}
        });
      })
    }

    // Adding event without image
    else {
      let event = M.Event(data);
      event.save((err) => {
        if (err) {
          console.log(err);
          res.send('Error saving event');
        }
        else {
          res.render('events/events', {
            config: {ROOT_URL: config.ROOT_URL},
            s: {company: S.s.company}
          });
        }
      })
    }
  }

});


/*
  handles deleting an event */
router.delete('/events.:code', (req, res) => {

  let code = req.params.code;
  const S = require('./../strings')(code);
  const M = require('./../models/' + code);
  const config = require('./../config')(code);

  M.Event.findOneAndRemove({_id:req.query.eid}, (err) => {
    if (err) {
      console.log(err);
      res.send('There was an error deleting event');
    }
    else {
      res.render('events/events', {
        config: {
          ROOT_URL: config.ROOT_URL
        },
        s: {
          company: S.s.company
        }
      });
    }
  });

});


/*
  returns all the currentEvents to display on /events */
router.get('/currentEvents.:code', (req, res) => {

  let code = req.params.code;
  console.log("code in currentEvents:", code);
  const M = require('./../models/' + code);

  let now = new Date();
  let date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  M.Event.find({when:{$gt: date}}).sort('when').exec((err, result) => {
    if (err) console.log(err)
    else {
      res.send(result);
    }
  });

});


/*
  returns old events to display on /events */
router.get('/pastEvents.:code', (req, res) => {

  let code = req.params.code;
  console.log("code in currentEvents:", code);
  const M = require('./../models/' + code);

  M.Event.find({when:{$lt: new Date()}}).sort('when').exec((err, result) => {
    if (err) console.log(err);
    else {
      res.send(result);
    }
  });

});


/*
  middleware that checks if the user is logged in */
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/login');
}

module.exports = router
