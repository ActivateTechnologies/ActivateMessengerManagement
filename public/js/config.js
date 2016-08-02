'use strict'

var status = 'production'; //'produciton' or 'test' or 'avi'

//PRODUCTION - heroku git:remote -a limitless-sierra-68694
var PRODUCTION_VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD"
var PRODUCTION_FACEBOOK_APP_ID = "144481079297226"
var PRODUCTION_FACEBOOK_APP_SECRET = "177f41bf5495e3673481700e4ec6995d"
var PRODUCTION_MONGODB_URI = 'mongodb://anirudh:kickabout@ds013664.mlab.com:13664/bot'
var PRODUCTION_MESSENGER_URL = "http://m.me/kickaboutapp"
var PRODUCTION_WIT_TOKEN = "KEGDQB5O6BMVEPWVO33VVLUOPQ6EPUVN";
var PRODUCTION_ROOT_URL = "https://limitless-sierra-68694.herokuapp.com"

//TEST - heroku git:remote -a kickabouttest
var TEST_VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD";
var TEST_MESSENGER_URL = "http://m.me/245261069180348";
var TEST_FACEBOOK_APP_ID = "159289771143437";
var TEST_FACEBOOK_APP_SECRET = "56cabb5a4f98662b998e4849d01bb826";
var TEST_MONGODB_URI = 'mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest';
var TEST_WIT_TOKEN = "KEGDQB5O6BMVEPWVO33VVLUOPQ6EPUVN";
var TEST_MS_BOT_PASSWORD = "KnOUo3FUkR1eupbaoJO1qMk";
var TEST_MS_BOT_APP_ID = "9e8a1b04-9a93-441c-9d94-aad81df5e294"; //App name: Kickabout Test
var TEST_LUIS_ID = "0a8ae437-0ff1-44c4-af7c-cc94fd0baf11";
var TEST_LUIS_SUBSCRIPTION_KEY = "a87263ffb22f4feb9a89aea610608ca7";
var TEST_ROOT_URL = "https://kickabouttest.herokuapp.com"

//AVI MESSENGER PAGE - localhost
var AVI_VERIFICATION_TOKEN = "EAANkfNpMGO4BAB33jQHaexONb3ZAoSd9aZCavOZCM7Xa84WMEYELbJRY2qZB7KWlI2M4DTXUTtlkwA12x4Ms2gK2LYy4r3fh18cs2tI2vSbvZBcJ70RXOdM3ZBmZCHw8iDKXOMJKw5TZBwLLI0FZCRFbISh2LE6q7CBQW0m17ZBZAcwyQZDZD";
var AVI_MESSENGER_URL = "http://m.me/631474433673481";
var AVI_FACEBOOK_APP_ID = "954912331274478";
var AVI_FACEBOOK_APP_SECRET = "17da92fb8241cc4946689e284e64ce60";
var AVI_MONGODB_URI = 'mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest';
var AVI_WIT_TOKEN = "KEGDQB5O6BMVEPWVO33VVLUOPQ6EPUVN";
var AVI_MS_BOT_PASSWORD = "KnOUo3FUkR1eupbaoJO1qMk";
var AVI_MS_BOT_APP_ID = "9e8a1b04-9a93-441c-9d94-aad81df5e294"; //App name: Kickabout Test
var AVI_LUIS_ID = "0a8ae437-0ff1-44c4-af7c-cc94fd0baf11";
var AVI_LUIS_SUBSCRIPTION_KEY = "a87263ffb22f4feb9a89aea610608ca7";
var AVI_ROOT_URL = "https://df901940.ngrok.io";

if (status == 'production') {
	var VERIFICATION_TOKEN = PRODUCTION_VERIFICATION_TOKEN;
	var FACEBOOK_APP_ID = PRODUCTION_FACEBOOK_APP_ID;
	var FACEBOOK_APP_SECRET = PRODUCTION_FACEBOOK_APP_SECRET;
	var MONGODB_URI = PRODUCTION_MONGODB_URI;
	var WIT_TOKEN = PRODUCTION_WIT_TOKEN;
	var ROOT_URL = PRODUCTION_ROOT_URL;
} else if (status == 'test') {
	var VERIFICATION_TOKEN = TEST_VERIFICATION_TOKEN;
	var FACEBOOK_APP_ID = TEST_FACEBOOK_APP_ID;
	var FACEBOOK_APP_SECRET = TEST_FACEBOOK_APP_SECRET;
	var MONGODB_URI = TEST_MONGODB_URI;
	var WIT_TOKEN = TEST_WIT_TOKEN;
	var MS_BOT_APP_ID = TEST_MS_BOT_APP_ID;
	var MS_BOT_PASSWORD = TEST_MS_BOT_PASSWORD;
	var LUIS_ID = TEST_LUIS_ID;
	var LUIS_SUBSCRIPTION_KEY = TEST_LUIS_SUBSCRIPTION_KEY;
	var ROOT_URL = TEST_ROOT_URL
} else if (status == 'avi') {
	var VERIFICATION_TOKEN = AVI_VERIFICATION_TOKEN;
	var FACEBOOK_APP_ID = AVI_FACEBOOK_APP_ID;
	var FACEBOOK_APP_SECRET = AVI_FACEBOOK_APP_SECRET;
	var MONGODB_URI = AVI_MONGODB_URI;
	var WIT_TOKEN = AVI_WIT_TOKEN;
	var MS_BOT_APP_ID = AVI_MS_BOT_APP_ID;
	var MS_BOT_PASSWORD = AVI_MS_BOT_PASSWORD;
	var LUIS_ID = AVI_LUIS_ID;
	var LUIS_SUBSCRIPTION_KEY = AVI_LUIS_SUBSCRIPTION_KEY;
	var ROOT_URL = AVI_ROOT_URL;
}

var DEVELOPMENT_STATUS = status;

//AWS S3 keys
var AWSaccessKeyId =  "AKIAIAQYS6UTUGDGOUPA";
var AWSsecretAccessKey = "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";

// CHANGE REMOTE ON HEROKU ACCORDINGLY BEFORE DEPLOYING
//PAGE ID
//MONTY MESSENGER 245261069180348
//KICKABOUT 1625739117677522

//still need to change
//redirect link in payment.js
//booking link generator in send.js inside generate_card_for_booking
//need to change app id and page id in game.ejs
// > also need to change cors request on /check


//Alex's real account
// 10153573553662304


// LOCAL TUNNEL Reference https://github.com/localtunnel/localtunnel


// For setting up Persistent Menu

// curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type" : "call_to_actions",
//   "thread_state" : "existing_thread",
//   "call_to_actions":[
//     {
//       "type":"postback",
//       "title":"Show Games",
//       "payload":"play"
//     },
//     {
//       "type":"postback",
//       "title":"My Games",
//       "payload":"my games"
//     },
// 		{
//       "type":"postback",
//       "title":"Notifications",
//       "payload":"notifications"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD"
