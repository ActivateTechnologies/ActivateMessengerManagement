'use strict'


const AWS = require('aws-sdk');
const M = require('./../schemas.js');
const config = require('./../config');
const S = require('./../strings');

AWS.config.update({
  accessKeyId: config.AWSaccessKeyId,
  secretAccessKey: config.AWSsecretAccessKey
});

let s3 = new AWS.S3();

function processGetEvents(req, res) {
  res.render('events', {
    config: {
      ROOT_URL: config.ROOT_URL
    }, s: {
      company: S.s.company
    }
  });
}

function processPostEvents(req, res) {
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
            res.render('events', {
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
            res.render('events', {
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
        res.render('events', {
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
          res.render('events', {
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
}

function processDeleteEvents(req, res) {
  M.Event.findOneAndRemove({_id:req.query.eid}, (err) => {
    if (err) {
      console.log('Error deleting event:', err);
      res.send('There was an error deleting event');
    } else {
      //console.log("deleted event");
      res.render('events', {
        config: {
          ROOT_URL: config.ROOT_URL
        }, s: {
          company: S.s.company
        }
      });
    }
  });
}

function processGetPlayers(req, res) {
  M.Event.find({_id:req.query.eid}, (err, events) => {
    if (err) {
      res.send([]);
    } else if (events[0].joined && events[0].joined.length) {
      var playerIds = [];
      events[0].joined.forEach((player, i) => {
        playerIds.push(player._id);
      });
      M.User.find({_id:{ $in : playerIds}}, (err, users) => {
        if (err) {
          console.log(err);
        }
        res.send(users)
      })
    } else {
      res.send([]);
    }
  });
}

function processGetCurrentEvents(req, res) {
  let now = new Date();
  let date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  M.Event.find({when:{$gt: date}}).sort('when').exec((err, result) => {
    if (err) {
      console.log('Error finding events for soon:', err);
    } else {
      res.send(result);
    }
  });
}

function processGetPastEvents(req, res) {
  M.Event.find({when:{$lt: new Date()}}).sort('when').exec((err, result) => {
    if (err) {
      console.log('Error finding events for soon:', err);
    } else {
      res.send(result);
    }
  });
}

function processGetUsersData(req, res) {
  M.User.find({}, (err, result) => {
    if (err) {
      console.log('Error finding events for soon:', err);
    } else {
      res.send(result);
    }
  });
}

module.exports = {
  processGetEvents: processGetEvents,
  processPostEvents: processPostEvents,
  processDeleteEvents: processDeleteEvents,
  processGetPlayers: processGetPlayers,
  processGetCurrentEvents: processGetCurrentEvents,
  processGetPastEvents: processGetPastEvents,
  processGetUsersData: processGetUsersData
}
