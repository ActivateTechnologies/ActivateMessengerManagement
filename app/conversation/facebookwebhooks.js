'use strict'

const request = require('request');

module.exports = function(code){

  const M = require('./../models/' + code);
  const Send = require('./../send.js')(code);
  const Conversation = require('./conversation.js')(code);
  const Config = require('./../config')(code);
  const S = require('./../strings')(code);

  function processGetWebhook(req, res) {
    if (req.query['hub.verify_token'] === 'verify_me') {
      res.send(req.query['hub.challenge']);
    }
    else {
      res.send('Error, wrong validation token');
    }
  }

  function processPostWebhook(req, res) {
    let messaging_events = req.body.entry[0].messaging;
    messaging_events.forEach((event) => {
      if ((!event.message || !event.message.is_echo)
       && !event.read && !event.delivery) {
        let uid = { mid: event.sender.id };

        M.User.findOneAndUpdate(
            {mid: uid.mid},
            {interactionTime: (new Date())},
            function(error, user){
              if(error) console.log(error);

              // found user
              if(user){
                uid._id = user._id;
                uid.firstName = user.firstName;
                uid.lastName = user.lastName;
                let convo = user.conversationLocation;
                let inConversation = (convo && convo.conversationName);

                if (!Conversation.consumeWebhookEvent(event, uid, user)) {
                  if (event.message && event.message.text && event.message.quick_reply) {
                    processQuickReply(event, uid);
                  }
                  else if (event.message && event.message.text && !event.message.quick_reply) {
                    // Send.allEvents(uid, S.s.bot.allEventsDefault);
                  }
                  else if (event.message && event.message.attachments){
                    processAttachment(event, uid);
                  }
                  else if (event.postback) {
                    processPostback(event, uid);
                  }
                }
              }

              // new user
              else {

                console.log("New User");

                var get_url = "https://graph.facebook.com/v2.6/" + uid.mid
                 + "?fields=first_name,last_name,profile_pic,locale,timezone,gender"
                 + "&access_token=" + Config.VERIFICATION_TOKEN;

                request(get_url, (err, response, body) => {

                  if (!err && response.statusCode == 200) {

                    body = JSON.parse(body);
                    let user = M.User({
                      mid: uid.mid,
                      firstName: body.first_name,
                      lastName: body.last_name,
                      profilePic: body.profile_pic,
                      locale: body.locale,
                      gender: body.gender,
                      events: [],
                      interactionTime: new Date(),
                      notifications: "on",
                      signedUpDate: new Date()
                    });

                    user.save((err) => {
                      if (err) console.log(err);

                      M.Analytics.update({name:"NewUsers"},
                        {$push: {activity: {uid:user._id, time: new Date()}}},
                        {upsert: true},
                        (err)=>{if(err) console.log(err);});

                      Conversation.startConversation(uid, "onboarding");
                    });

                  }

                });

              }
            })

      }
    });
    res.sendStatus(200);
  }

  function processQuickReply(event, uid) {
    let payload = event.message.quick_reply.payload;
    if (payload.substring(0, 16) == "conversationName") {
      Conversation.handleQuickReply(uid, payload);
    }
    else {
      switch(payload.toLowerCase()){

        case("notifications"):
        Send.notifications(uid);
        break;

        case("my events"):
        Send.myEvents(uid);
        break;

        case("my games"):
        Send.myEvents(uid);
        break;

        case("notifications on"):
        Send.notificationsChange(uid, "on");
        break;

        case("notifications off"):
        Send.notificationsChange(uid, "off");
        break;

        default:
        Send.allEvents(uid, S.s.bot.allEventsDefault);
      }
    }
  }

  function processAttachment(event, uid) {
    //Handling like button
    if (event.message.attachments[0].payload.url
      === "https://scontent.xx.fbcdn.net/t39.1997-6/"
      + "851557_369239266556155_759568595_n.png?_nc_ad=z-m"){
      Send.menu(uid);
    }
  }

  function processPostback(event, uid) {
    let text = event.postback.payload;
    if (text.substring(0, 4) == "Book") {
      console.log("Caught book");
      Send.book(uid, text);
    }
    else if(text.substring(0, 6) == "Cancel") {
      Send.cancelBooking(uid, text.split('|')[1]);
    }
    else if(text.substring(0, 5) == "Share") {
      Send.shareEvent(uid, text);
    }
    else if(text.substring(0, 9) == "More Info") {
      Send.moreInfo(uid, text.split('|')[1]);
    }
    else {
      switch(text.toLowerCase()) {

        case("my events"):
        Send.myEvents(uid);
        break;

        case("my games"):
        Send.myEvents(uid);
        break;

        case("notifications"):
        Send.notifications(uid);
        break;

        default:
        Send.allEvents(uid, S.s.bot.allEventsDefault);
      }
    }
  }

  return {
    processPostWebhook: processPostWebhook,
    processGetWebhook: processGetWebhook
  }
}
