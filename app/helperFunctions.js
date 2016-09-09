'use strict'

const request = require('request');
const M = require('./schemas.js');
const config = require('./config');

let controller = (function(code){

  /*
    Does three things:
    Updates user's events array with specified event
    Updates event's joined array with joined user
    Updates Payments analytics document
    TO DO: WARNING: currently doesn't return any errors*/
  function updateUserEventAnalytics(uid, eid, price, bookingReference) {
    return new Promise((resolve, reject) => {
      M.Analytics.update({name:"Payments"}, {
        $push: {
          activity: {
            uid: uid._id,
            time: new Date(),
            eid: eid,
            amount: price
          }
        },
        $inc: {
          total: price
        }
      }, {upsert: true}, (err, results) => {
        if (err) {
          console.log('Error logging payments analytics: ', err);
        }
        if (bookingReference == undefined || bookingReference == null) {
          bookingReference = uid._id + '-' + eid;
        }
        M.User.findOneAndUpdate({_id:uid._id}, {$push: {events: {
          eid: eid,
          bookingReference: bookingReference,
          joinDate: new Date()
        }}}, (err, user) => {
          if (err) {
            console.log('Error pushing eid to users\'s events:', err);
          }
          M.Event.findOneAndUpdate({_id:eid},
            {$push: {joined: {
              uid: uid._id,
              joinDate: new Date()
            }}}, (err, event) => {
            if (err) {
              console.log('Error pushing uid to users\'s events:', err);
            }
            resolve(event);
          });
        });
      });
    });
  }

  function removeEmojis(text) {
    let regex = /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g;
    return text.replace(regex, '');
  }

  return {
    updateUserEventAnalytics: updateUserEventAnalytics,
    removeEmojis: removeEmojis
  }

})(code)

module.exports = controller
