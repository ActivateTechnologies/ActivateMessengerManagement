'use strict'


const AWS = require('aws-sdk');
const M = require('./../schemas.js');
const config = require('./../config');
const S = require('./../strings');

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
  processGetPlayers: processGetPlayers,
  processGetUsersData: processGetUsersData
}
