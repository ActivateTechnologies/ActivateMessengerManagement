'use strict'

const request = require('request')
const M = require('./schemas.js')
const Config = require('./../config')
const Send = require('./send.js');

/*
  Retrieves specified conversation from database and starts executing by
  calling executeTreeNode() with the first node */
function duplicateUseridToMid(req, res) {
  M.User.find({}, (error, users) => {
    if (error) {
      console.log('Error getting users: ', error);
    } else if (users.length == 0) {
      console.log('No users found.');
    } else {
      let errorCount = 0;
      let successCount = 0;
      users.forEach((user) => {
        ((user) => {
          if (user.userId) {
            M.User.update({_id:user._id}, {$set:{mid: user.userId}}, (err, user) => {
              if (err) {
                console.log('Error updating user with _id ' + user._id + ':', err);
                errorCount++;
              } else {
                successCount++;
              }
              postSuccess(users.length, successCount, errorCount);
            });
          } else {
            errorCount++;
            postSuccess(users.length, successCount, errorCount);
          }
        })(user)
      });
    }
  });

  function postSuccess(total, successCount, errorCount) {
    if ((successCount + errorCount) == total) {
      console.log('User updated completed. Successfully processed '
       + successCount + '/' + total + ' users.');
      res.status(200).send('User updated completed. Successfully processed '
       + successCount + '/' + total + ' users.');
    }
  }
}

module.exports = {
  duplicateUseridToMid: duplicateUseridToMid
}