// case("today"):
//
// let now = new Date();
//
// M.Button.update({name:"Today"}, {$push: {activity: {userId:sender, time: now}}}, {upsert: true}, function(err){
//   console.log(err);
// })
//
// M.Game.find({when:{$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()+1)}}, function(err, result){
//
//   let today_data = [];
//   result.forEach(function(item){
//     let booked = false;
//     let join = item.joined;
//
//     join.forEach(function(i){
//       if(i.userId === sender){
//         booked = true;
//       }
//     });
//     today_data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked, item.desc, item.when]);
//   })
//
//   today_data = send.generate_card(today_data);
//   send.cards(sender, today_data, "today");
// })
// break;
//
// case("tomorrow"):
// let now2 = new Date();
// now2.setDate(now2.getDate()+1);
//
// M.Button.update({name:"Tomorrow"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
//   console.log(err);
// })
//
// M.Game.find({when:{$gt: new Date(now2.getFullYear(), now2.getMonth(), now2.getDate() - 1), $lt: new Date(now2.getFullYear(), now2.getMonth(), now2.getDate()+1)}}, function(err, result){
//
//   let today_data = [];
//   result.forEach(function(item){
//     let booked = false;
//     let join = item.joined;
//
//     join.forEach(function(i){
//       if(i.userId === sender){
//         booked = true;
//       }
//     });
//     today_data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked, item.desc]);
//   })
//
//   today_data = send.generate_card(today_data);
//   send.cards(sender, today_data, "today");
// })
// break;
//
// case("soon"):
// let now3 = new Date();
// now3.setDate(now3.getDate()+2);
//
// M.Button.update({name:"Soon"}, {$push: {activity: {userId:sender, time: new Date()}}}, {upsert: true}, function(err){
//   console.log(err);
// })
//
// M.Game.find({when:{$gt: new Date(now3.getFullYear(), now3.getMonth(), now3.getDate() - 1)}}, function(err, result){
//
// let today_data = [];
// result.forEach(function(item){
//     let booked = false;
//     let join = item.joined;
//
//     join.forEach(function(i){
//       if(i.userId === sender){
//         booked = true;
//       }
//     });
//     today_data.push([item.name, item.address, item.image_url, item.latlong, item._id, item.joined.length, item.capacity, booked, item.desc]);
//   })
//
//   today_data = send.generate_card(today_data);
//   send.cards(sender, today_data, "today");
// })
// break;









//Facebook OAuth using passport


// const passport = require('passport')
// const FacebookStrategy = require('passport-facebook').Strategy


// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     profileFields: ['id', 'displayName', 'email', 'birthday']
//   },
//   function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function(){
//       console.log(req.query);
//       var birthday = new Date(profile._json.birthday);
//       var now = new Date();
//
//       if(now.getFullYear() - birthday.getFullYear() > 16){
//         M.User.find({facebookID: profile.id}, function(e, result){
//           if(e)
//             console.log(e);
//
//           if(result.length < 1){
//             let user = M.User({
//               facebookID: profile.id,
//               name: profile.displayName,
//               email: profile.emails[0].value
//             })
//
//             user.save(function(err){
//               if(err){
//                 console.log(err);
//                 done(err);
//               } else {
//                 console.log("saved");
//                 done(null, user);
//               }
//             })
//           }
//           else {
//             done(null, profile);
//           }
//         })
//
//       }
//       else {
//         console.log("not old enough to use the app");
//         done(null, profile);
//       }
//     })
//   }
// ));
//
// app.get('/facebook', function(req, res, next){
//   passport.authenticate('facebook',{
//     callbackURL: (req.query.redirect_uri),
//     session: false,
//     scope: ['email', 'user_birthday']
//   })(req, res, next);
// })
//
// app.get('/callback', function(req, res, next){
//   passport.authenticate('facebook', {
//     session: false,
//     successRedirect: '/profile',
//     failureRedirect: '/analytics'
//   })(req, res, next);
// })
//
// app.get('/profile', function(req, res){
//   res.send(req.user)
// })



// account linking function for send.js

// function link(sender){
//   let messageData = {
//     "attachment": {
//       "type": "template",
//       "payload": {
//         "template_type": "generic",
//         "elements": [{
//           "title": "Welcome to Kickabout",
//           "buttons": [{
//             "type": "account_link",
//             "url": "http://kickabouttest.herokuapp.com/facebook"
//           }]
//         }]
//       }
//     }
//   }
//
//   request({
//       url: 'https://graph.facebook.com/v2.6/me/messages',
//       qs: {access_token:VERIFICATION_TOKEN},
//       method: 'POST',
//       json: {
//           recipient: {id:sender},
//           message: messageData,
//       }
//   }, function(error, response, body) {
//       if (error) {
//           console.log('Error sending messages: ', error)
//       } else if (response.body.error) {
//           console.log('Error: ', response.body.error)
//       }
//   })
// }
