'use strict'

module.exports = function(code){

  const M = require('./../schemas.js')(code);

  /*
    Returns the basic dashboard stats, called when the dashboard is rendered.
    Returns data of form:
    { totalNoOfMembers:number, totalRevenue: number, totalNoOfTickets: number}*/
  function getDashboardStats (callback) {
    let returnObject = {};
    let errors = [];
    M.User.count((err, count) => {
      if (err) {
        returnObject.totalNoOfMembers = 0;
        console.log('Er1' + JSON.stringify(err));
        errors.push('Error getting totalNoOfMembers: ' + JSON.stringify(err));
      } else {
        returnObject.totalNoOfMembers = count;
      }
      returnData();
    });

    M.Analytics.find({name:"Payments"}, (err, results) => {
      if (err || results.length == 0) {
        returnObject.totalRevenue = 0;
        returnObject.totalNoOfTickets = 0;
        if (err) {
          errors.push('Error getting totalRevenue & totalNoOfTickets: '
           + JSON.stringify(err));
        }
      } else {
        returnObject.totalRevenue = results[0].total;
        returnObject.totalNoOfTickets = results[0].activity.length;
      }
      returnData();
    });

    function returnData() {
      if (returnObject.totalNoOfMembers != undefined && returnObject.totalRevenue
       != undefined && returnObject.totalNoOfTickets != undefined) {
        if (errors.length) {
          callback(returnObject, {
            message: 'Error(s) in getDashboardStats: ' + errors.join(', ')
          });
        } else {
          callback(returnObject);
        }
      }
    }
  }

  function getNewMembersOverTime (callback) {
    processAnalyticsDataOverTime("NewUsers", callback);
  }

  function getTicketsSoldOverTime (callback) {
    processAnalyticsDataOverTime("Payments", callback);
  }

  function getButtonHitsOverTime (callback) {
    let cancelDataReturned = false, moreInfoDataReurned = false;
    let cancelData, moreInfoData;
    let errors = [];
    let dataToReturn = {
      daysArray: [],
      weeksArray: [],
      monthsArray: []
    }
    processAnalyticsDataOverTime("Button:Cancel", (data, error) => {
      cancelData = data;
      cancelDataReturned = true;
      if (error) {
        errors.push(error);
      }
      if (moreInfoDataReurned) {
        returnData();
      }
    });
    processAnalyticsDataOverTime("Button:More Info", (data, error) => {
      moreInfoData = data;
      moreInfoDataReurned = true;
      if (error) {
        errors.push(error);
      }
      if (cancelDataReturned) {
        returnData();
      }
    });

    function returnData() {
      if (errors.length > 0) {
        callback(null, {message: 'Error retrieving button analytics: '
          + JSON.stringify(errors.join(', '))});
      } else {
        for (let i = 0; i < 7; i++) {
          dataToReturn.daysArray.push(cancelData.daysArray[i] + moreInfoData.daysArray[i]);
        }
        for (let i = 0; i < 12; i++) {
          dataToReturn.weeksArray.push(cancelData.weeksArray[i]
           + moreInfoData.weeksArray[i]);
          dataToReturn.monthsArray.push(cancelData.monthsArray[i]
           + moreInfoData.monthsArray[i]);
        }
        callback(dataToReturn);
      }
    }
  }

  /*
    Searchs Analytics collection for document with name=nameOfdocument,
    returning bucketed analytics in the format:
    {daysArray: array[7], weeksArray: array[12], monthsArray: array[12]}*/
  function processAnalyticsDataOverTime(nameOfdocument, callback) {
    let now = new Date();
    let aYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    M.Analytics.find({name:nameOfdocument, activity:{$elemMatch:{time: {$gt: aYearAgo}}}},
     (err, results) => {
      if (err || !results.length) {
        callback(null, {
          message: ('getNewMembersOverTime error: ' + ((err) ? JSON.stringify(err)
           : 'No NewUsers doc found'))
        });
      } else {
        let dayMs = 86400 * 1000, activity = results[0].activity, now = new Date();
        let noOfDays = 367 + now.getDate(), count = 0;
        let startDate = new Date(aYearAgo.getTime() - now.getDate() * dayMs);
        //Create daysArray
        let daysArray = [], weeksArray = [], monthsArray = [];
        for (let i = 0; i < noOfDays; i++) {
          activity.forEach((item) => {
            if (item.time > new Date(startDate.getTime() + i * dayMs) &&
                item.time < new Date(startDate.getTime() + (i + 1) * dayMs)) {
              count ++;
            }
            //console.log(new Date(startDate.getTime() + i * dayMs));
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
        callback({
          daysArray: daysArrayModified,
          weeksArray: weeksArray.slice(-12),
          monthsArray: monthsArray.slice(-12)
        });
      }
    });
  }

  return {
    getDashboardStats: getDashboardStats,
    getNewMembersOverTime: getNewMembersOverTime,
    getTicketsSoldOverTime: getTicketsSoldOverTime,
    getButtonHitsOverTime: getButtonHitsOverTime
  }
}
