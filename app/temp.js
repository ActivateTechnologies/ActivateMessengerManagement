'use strict'

let M = require('./models/kickabout');
let _ = require('underscore')

let total = 0;

M.Analytics.findOne({name: 'Payments'}, (err, result)=>{
  if(err) console.log(err);
  console.log(result.activity.length);
  _.each(result.activity, (item)=>{
    console.log(item.amount);
    total += item.amount
  })
  console.log(total);
})
