'use strict'

const request = require('request')
const config = require('./config')('kickabout')
const M = require('./models/kickabout')
const send = require('./send.js')('kickabout')
const fs = require('fs')

// let now = new Date();
// let Tue = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 22);
// console.log(Tue.toString());
// let Wed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3);
// console.log(Wed.toString());
//
// M.User.find({"signedUpDate":{$gt:Tue, $lt: Wed}}, function(err, results){
//   if(err) console.log(err);
//   let line = 1;
//   console.log(results.length);
//   results.forEach((user)=>{
//     if(line % 4 === 0){
//       fs.appendFile('./users.txt', user.mid + ", \n", (err)=>{if(err) console.log(err);})
//     }
//     else {
//       fs.appendFile('./users.txt', user.mid + ", ", (err)=>{if(err) console.log(err);})
//     }
//     line++;
//   })
// })


/*
users = [
] */


// For testing, delete it after testing
// Anirudh
let users = [1009426142504870]

// Put here the text you want to send
//let textToSend = "Topical is tonight, get your discounted ticket now! 🎉 🎶😈"

users.forEach((mid)=>{
  M.User.findOne({mid:mid}, function(err, result){
    if(err) {
      console.log(err);
    }
    if(result){
      let uid = {
        _id: result._id,
        mid: mid,
        firstName: result.firstName,
        lastName: result.lastName
      }

      send.allEvents(uid, "Hey, the weather's great isn't it? Why not find some games to join?");
      console.log("sent to:", mid);
    }
    else {
      console.log("Invalid userId", mid);
    }
  })
})
