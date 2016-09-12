'use strict'

const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const fs = require('fs')
const multer = require('multer');
const upload = multer({dest:'uploads/'});


/*
  renders the /events page */
router.get('/events.:code', (req, res) => {

  const code = req.params.code;
  const S = require('./../strings')('kickabout');
  const config = require('./../config')('kickabout');

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
  const S = require('./../strings')(code);
  const M = require('./../schemas.js')(code);
  const config = require('./../config')(code);

  AWS.config.update({
    accessKeyId: config.AWSaccessKeyId,
    secretAccessKey: config.AWSsecretAccessKey
  });

  let s3 = new AWS.S3();

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
      } else {
        console.log("Successfully uploaded data to myBucket/myKey");
        let urlParams = {Bucket: 'kickabout-messenger', Key: imagename, Expires: 30000000};
        let image_url = s3.getSignedUrl('getObject', urlParams);

        let data = {
          name: req.body.title,
          strapline: req.body.strapline,
          image_url: image_url,
          image_name: imagename,
          latlong: req.body.latlong.replace(/\s+/g, ''),
          desc: req.body.desc,
          when: req.body.when,
          capacity: req.body.capacity,
          non_members_attending: req.body.non_members_attending,
          price: parseFloat(req.body.price)
        };

        if (req.body.id) {
          //console.log("Editing event with image");
          M.Event.findOneAndUpdate({_id:req.body.id}, data, (err) => {
            if (err) {
              console.log(err);
            }
            res.render('events/events', {
              config: {
                ROOT_URL: config.ROOT_URL
              }, s: {
                company: S.s.company
              }
            });
          })
        } else {
          //console.log("Adding event with image");
          let event = M.Event(data);
          event.save((err) => {
            if (err) {
              console.log(err);
            }
            res.render('events/events', {
              config: {
                ROOT_URL: config.ROOT_URL
              }, s: {
                company: S.s.company
              }
            });
          })
        }
      }
    });
  }
  //if no image uploaded then updating the event or saving depending on presence of id
  else {
    let data = {
      name: req.body.title,
      strapline: req.body.strapline,
      image_url: req.body.image_url,
      latlong: req.body.latlong.replace(/\s+/g, ''),
      desc: req.body.desc,
      when: req.body.when,
      capacity: req.body.capacity,
      non_members_attending: req.body.non_members_attending,
      price: parseFloat(req.body.price)
    };
    if (req.body.id) {
      //console.log("Editing event without image");
      M.Event.findOneAndUpdate({_id:req.body.id}, data, (err) => {
        if (err) {
          console.log('Error editing event:', err);
        }
        res.render('events/events', {
          config: {
            ROOT_URL: config.ROOT_URL
          }, s: {
            company: S.s.company
          }
        });
      })
    } else {
      //console.log("Adding event without image");
      let event = M.Event(data);
      event.save((err) => {
        if (err) {
          console.log('Error adding event:', err);
          res.send('Error saving event');
        } else {
          res.render('events/events', {
            config: {
              ROOT_URL: config.ROOT_URL
            }, s: {
              company: S.s.company
            }
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
  const M = require('./../schemas.js')(code);

  M.Event.findOneAndRemove({_id:req.query.eid}, (err) => {
    if (err) {
      console.log('Error deleting event:', err);
      res.send('There was an error deleting event');
    }
    else {
      res.render('events/events', {
        config: {
          ROOT_URL: config.ROOT_URL
        }, s: {
          company: S.s.company
        }
      });
    }
  });

});


/*
  returns all the currentEvents to display on /events */
router.get('/currentEvents.:code', (req, res) => {

  const M = require('./../schemas.js')(req.params.code);

  let now = new Date();
  let date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  M.Event.find({when:{$gt: date}}).sort('when').exec((err, result) => {
    if (err) {
      console.log('Error finding events for soon:', err);
    } else {
      res.send(result);
    }
  });

});


/*
  returns old events to display on /events */
router.get('/pastEvents.:code', (req, res) => {

  const M = require('./../schemas.js')(req.params.code);

  M.Event.find({when:{$lt: new Date()}}).sort('when').exec((err, result) => {
    if (err) {
      console.log('Error finding events for soon:', err);
    }
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
