'use strict'

const express = require('express');
const router = express.Router();



let codes = ['kickabout', 'uwe', 'sheffieldHallam', 'salford', 'liverpool']

/*
  Searchs Analytics collection for document with name=nameOfdocument,
  returning bucketed analytics in the format:
  {daysArray: array[7], weeksArray: array[12], monthsArray: array[12]}*/
function processAnalyticsDataOverTime(M, nameOfdocument) {

  return new Promise(function(resolve, reject){
    let now = new Date();
    let aYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    M.Analytics.findOne(
     {name:nameOfdocument},
     (err, result) => {
      if (err) console.log(err);

      if(result){

        let dayMs = 86400 * 1000;
        let activity = result.activity
        let noOfDays = 367 + now.getDate();
        let count = 0;
        let startDate = new Date(aYearAgo.getTime() - now.getDate() * dayMs);
        let daysArray = [], weeksArray = [], monthsArray = [];

        //Create daysArray
        for (let i = 0; i < noOfDays; i++) {
          activity.forEach((item) => {
            if (item.time > new Date(startDate.getTime() + i * dayMs) &&
                item.time < new Date(startDate.getTime() + (i + 1) * dayMs)) {
              count ++;
            }
          });
          daysArray.push(count);
          count = 0;
        }

        //Create weeksArray
        count = 0;
        startDate = new Date(now.getTime() - 12 * 7 * dayMs - dayMs);
        let startDayIndex = noOfDays - (12 * 7 + now.getDay());
        for (let i = startDayIndex; i < daysArray.length; i++) {
          count += daysArray[i];
          if ((i - startDayIndex) % 7 == 6) {
            weeksArray.push(count);
            count = 0;
          }
        }
        weeksArray.push(count); //this week

        //Create monthArray
        let dateOfMonth = 0;
        let monthDayCount = ((now.getMonth() > 1 && (now.getFullYear() % 4 == 0))
          || (aYearAgo.getFullYear() % 4 == 0))
          ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] //Leap year
          : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //Non leap year
        count = 0;
        for (let i = 0; i < noOfDays; i++) {
          dateOfMonth++;
          count += daysArray[i];
          if (dateOfMonth
           == monthDayCount[(now.getMonth() + monthsArray.length) % 12]) {
            dateOfMonth = 0;
            monthsArray.push(count);
            count = 0;
          }
        }
        monthsArray.push(count);
        let daysArrayModified = [];
        let day = now.getDay();
        for (let i = 0; i < 7; i++) {
          if (i <= day) {
            daysArrayModified.push(daysArray[daysArray.length - day + i]);
          } else {
            daysArrayModified.push(0);
          }
        }

        resolve({
          daysArray: daysArrayModified,
          weeksArray: weeksArray.slice(-12),
          monthsArray: monthsArray.slice(-12)
        });

      }
    })
  })

}


function getMainStats(M){
  return new Promise(function(resolve, reject){
    M.User.count((err, count) => {
      if (err) console.log(err);
      else {
        M.Analytics.findOne({name:"Payments"}, (err, result) => {
          if (err) console.log(err);

          if (result) {
            resolve({
              totalNoOfMembers: count,
              totalRevenue: result.total,
              totalNoOfTickets: result.activity.length
            });
          }

          else {
            resolve({
              totalNoOfMembers: count,
              totalRevenue: 0,
              totalNoOfTickets: 0
            });
          }
        });
      }
    });
  })
}


/*
  Renders the dashboard page and provides the main data:
  { totalNoOfMembers:number, totalRevenue: number, totalNoOfTickets: number}*/
router.get('/dashboard.:code', isLoggedIn, (req, res) => {

  const code = req.params.code;

  if (code === "master"){
    const S = require('./../strings')(code);

    let all = [];

    for(let i = 0; i<codes.length; i++){
        const M = require('./../models/' + codes[i]);
        all.push(getMainStats(M));
    }

    Promise.all(all)
    .then((values)=>{
        let ret = {
          totalNoOfMembers: 0,
          totalRevenue: 0,
          totalNoOfTickets: 0,
          s: {company: S.s.company}
        }

        for(let i = 0; i<values.length; i++){
          ret.totalNoOfMembers += values[i].totalNoOfMembers;
          ret.totalRevenue += values[i].totalRevenue;
          ret.totalNoOfTickets += values[i].totalNoOfTickets;
        }

        res.render('dashboard/dashboard', ret);
    })
  }

  else {
    const S = require('./../strings')(code);
    const M = require('./../models/' + code);

    getMainStats(M)
    .then((ret)=>{
      ret.s = {company: S.s.company};
      res.render('dashboard/dashboard', ret);
    })
  }
});


/* send all the data to generate the graphs */
router.get('/dashboardData.:code', (req, res) => {

  const code = req.params.code;
  let requiredData = req.query.requiredData;

  if (code === "master"){
      const S = require('./../strings')(code);

      let all = [];

      for(let i = 0; i<codes.length; i++){
        const M = require('./../models/' + codes[i]);
        if (requiredData === 'getTicketsSoldOverTime') {
          all.push(processAnalyticsDataOverTime(M, "Payments"))
        }
        else if (requiredData === 'getNewMembersOverTime') {
          all.push(processAnalyticsDataOverTime(M, "NewUsers"))
        }
        else if (requiredData === 'getButtonHitsOverTime') {
          all.push(processAnalyticsDataOverTime(M, "Button:More Info"))
        }
      }

      console.log(requiredData);
      Promise.all(all)
      .then((values)=>{
        console.log(requiredData, values);
        let dataToReturn = values[0];
        for (let j = 1; j<values.length; j++){
          for (let i = 0; i<7; i++){
            (dataToReturn.daysArray)[i] += (values[j].daysArray)[i];
          }
          for (let i = 0; i<dataToReturn.weeksArray.length; i++){
            (dataToReturn.weeksArray)[i] += (values[j].weeksArray)[i];
          }
          for (let i = 0; i<dataToReturn.monthsArray.length; i++){
            (dataToReturn.monthsArray)[i] += (values[j].monthsArray)[i];
          }
        }
        res.send(dataToReturn);
      })
  }

  else {

      const S = require('./../strings')(code);
      const M = require('./../models/' + code);

      if (requiredData == 'getTicketsSoldOverTime') {
        processAnalyticsDataOverTime(M, "Payments")
        .then((data) => {res.send(data);});
      }

      else if (requiredData == 'getNewMembersOverTime') {
        processAnalyticsDataOverTime(M, "NewUsers")
        .then((data) => {res.send(data);});
      }

      else if (requiredData == 'getButtonHitsOverTime') {
        processAnalyticsDataOverTime(M, "Button:More Info")
        .then((data)=>{res.send(data);});
      }

  }

});


function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to login
  res.redirect('/login');
}

module.exports = router
