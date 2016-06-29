'use strict'

const M = require('./schemas.js')

function getNewUsers(){

  let now = new Date();

  return new Promise(function(resolve, reject){
    M.Button.find({name:"Yep"}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      if(result.length > 0){
        result[0].activity.forEach(function(item){
          if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
            count++;
          }
        })
        resolve(count);
      }
      else {
        resolve(0);
      }
    })
  })
}

function getNewUsersWeekly(currentDate){

  return new Promise(function(resolve, reject){
    M.Button.find({name:"Yep"}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      let weekArray = []
      if(result.length < 1){
        resolve(0);
      }
      for(let i = 0; i < 7; i++){
        result[0].activity.forEach(function(item){
          if(item.time > new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i) &&
              item.time < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i + 1)){
            count++;
          }
        })
        weekArray.push(count);
        count = 0;
      }
      resolve(weekArray.reverse());
    })
  })
}

function getNewUsersMonthly(currentDate){

  return new Promise(function(resolve, reject){
    M.Button.find({name:"Yep"}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      let weekArray = []
      console.log(new Date(currentDate.getFullYear(), currentDate.getMonth()));
      if(result.length < 1){
        resolve(0);
      }
      for(let i = 0; i < 12; i++){
        result[0].activity.forEach(function(item){
          if(item.time > new Date(currentDate.getFullYear(), currentDate.getMonth() - i) &&
              item.time < new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1)){
            count++;
          }
        })
        weekArray.push(count);
        count = 0;
      }
      resolve(weekArray.reverse());
    })
  })
}

function getButtonHitsWeekly(currentDate){

  return new Promise(function(resolve, reject){
    M.Button.find({}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      let weekArray = []
      for(let i = 0; i < 7; i++){
        result.forEach(function(button){
          button.activity.forEach(function(item){
            if(item.time > new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i) &&
                item.time < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i + 1)){
              count++;
            }
          })
        })

        weekArray.push(count);
        count = 0;
      }
      resolve(weekArray.reverse());
    })
  })
}

function getButtonHitsMonthly(currentDate){

  return new Promise(function(resolve, reject){
    M.Button.find({}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      let weekArray = []
      for(let i = 0; i < 12; i++){

        result.forEach(function(button){
          button.activity.forEach(function(item){
            if(item.time > new Date(currentDate.getFullYear(), currentDate.getMonth() - i) &&
                item.time < new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1)){
              count++;
            }
          })
        })

        weekArray.push(count);
        count = 0;
      }
      resolve(weekArray.reverse());
    })
  })
}

function getNewBookHits(){

  let now = new Date();

  return new Promise(function(resolve, reject){
    M.Button.find({name:"Book"}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      if(result.length > 0){
        result[0].activity.forEach(function(item){
          if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
            count++;
          }
        })
        resolve(count);
      }
      else {
        resolve(0);
      }
    })
  })
}

function getNewTodayHits(){

  let now = new Date();

  return new Promise(function(resolve, reject){
    M.Button.find({name:"Today"}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      if(result.length > 0){
        result[0].activity.forEach(function(item){
          if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
            count++;
          }
        })
        resolve(count);
      }
      else {
        resolve(0);
      }
    })
  })
}

function getNewTomorrowHits(){

  let now = new Date();

  return new Promise(function(resolve, reject){
    M.Button.find({name:"Tomorrow"}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      if(result.length > 0){
        result[0].activity.forEach(function(item){
          if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
            count++;
          }
        })
        resolve(count);
      }
      else {
        resolve(0);
      }
    })
  })
}

function getNewSoonHits(){

  let now = new Date();

  return new Promise(function(resolve, reject){
    M.Button.find({name:"Soon"}, function(err, result){
      if(err){
        reject(err);
      }
      let count = 0;
      if(result.length > 0){
        result[0].activity.forEach(function(item){
          if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
            count++;
          }
        })
        resolve(count);
      }
      else {
        resolve(0);
      }
    })
  })
}



module.exports = {
  getNewUsers: getNewUsers,
  getNewBookHits: getNewBookHits,
  getNewTodayHits: getNewTodayHits,
  getNewTomorrowHits: getNewTomorrowHits,
  getNewSoonHits: getNewSoonHits,
  getNewUsersWeekly: getNewUsersWeekly,
  getButtonHitsWeekly: getButtonHitsWeekly,
  getNewUsersMonthly: getNewUsersMonthly,
  getButtonHitsMonthly: getButtonHitsMonthly
}
