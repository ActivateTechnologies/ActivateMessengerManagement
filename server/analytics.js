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
      result[0].activity.forEach(function(item){
        if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
          count++;
        }
      })
      resolve(count);
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
      result[0].activity.forEach(function(item){
        if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
          count++;
        }
      })
      resolve(count);
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
      result[0].activity.forEach(function(item){
        if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
          count++;
        }
      })
      resolve(count);
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
      result[0].activity.forEach(function(item){
        if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
          count++;
        }
      })
      resolve(count);
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
      result[0].activity.forEach(function(item){
        if(item.time > new Date(now.getFullYear(), now.getMonth(), now.getDate())){
          count++;
        }
      })
      resolve(count);
    })
  })
}



module.exports = {
  getNewUsers: getNewUsers,
  getNewBookHits: getNewBookHits,
  getNewTodayHits: getNewTodayHits,
  getNewTomorrowHits: getNewTomorrowHits,
  getNewSoonHits: getNewSoonHits
}
