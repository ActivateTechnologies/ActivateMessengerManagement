const status = 'test'; //'produciton' or 'test' or 'avi'

//PRODUCTION - heroku git:remote -a limitless-sierra-68694
const PRODUCTION_VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD"
const PRODUCTION_FACEBOOK_APP_ID = "144481079297226"
const PRODUCTION_FACEBOOK_APP_SECRET = "177f41bf5495e3673481700e4ec6995d"
const PRODUCTION_MONGODB_URI = 'mongodb://anirudh:kickabout@ds013664.mlab.com:13664/bot'
const PRODUCTION_MESSENGER_URL = "http://m.me/kickaboutapp"
const PRODUCTION_WIT_TOKEN = "KEGDQB5O6BMVEPWVO33VVLUOPQ6EPUVN";

//TEST - heroku git:remote -a kickabouttest
const TEST_VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD";
const TEST_MESSENGER_URL = "http://m.me/245261069180348";
const TEST_FACEBOOK_APP_ID = "159289771143437";
const TEST_FACEBOOK_APP_SECRET = "56cabb5a4f98662b998e4849d01bb826";
const TEST_MONGODB_URI = 'mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest';
const TEST_WIT_TOKEN = "KEGDQB5O6BMVEPWVO33VVLUOPQ6EPUVN";

//AVI MESSENGER PAGE - localhost
const AVI_VERIFICATION_TOKEN = "EAANkfNpMGO4BAB33jQHaexONb3ZAoSd9aZCavOZCM7Xa84WMEYELbJRY2qZB7KWlI2M4DTXUTtlkwA12x4Ms2gK2LYy4r3fh18cs2tI2vSbvZBcJ70RXOdM3ZBmZCHw8iDKXOMJKw5TZBwLLI0FZCRFbISh2LE6q7CBQW0m17ZBZAcwyQZDZD";
const AVI_MESSENGER_URL = "http://m.me/631474433673481";
const AVI_FACEBOOK_APP_ID = "159289771143437";
const AVI_FACEBOOK_APP_SECRET = "56cabb5a4f98662b998e4849d01bb826";
const AVI_MONGODB_URI = 'mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest';
const AVI_WIT_TOKEN = "KEGDQB5O6BMVEPWVO33VVLUOPQ6EPUVN";
const AVI_MS_BOT_PASSWORD = "KnOUo3FUkR1eupbaoJO1qMk";
const AVI_MS_BOT_APP_ID = "9e8a1b04-9a93-441c-9d94-aad81df5e294"; //App name: Kickabout Test
const AVI_LUIS_ID = "0a8ae437-0ff1-44c4-af7c-cc94fd0baf11";
const AVI_LUIS_SUBSCRIPTION_KEY = "a87263ffb22f4feb9a89aea610608ca7";

if (status == 'production') {
	exports.VERIFICATION_TOKEN = PRODUCTION_VERIFICATION_TOKEN;
	exports.FACEBOOK_APP_ID = PRODUCTION_FACEBOOK_APP_ID;
	exports.FACEBOOK_APP_SECRET = PRODUCTION_FACEBOOK_APP_SECRET;
	exports.MONGODB_URI = PRODUCTION_MONGODB_URI;
	exports.WIT_TOKEN = PRODUCTION_WIT_TOKEN;
} else if (status == 'test') {
	exports.VERIFICATION_TOKEN = TEST_VERIFICATION_TOKEN;
	exports.FACEBOOK_APP_ID = TEST_FACEBOOK_APP_ID;
	exports.FACEBOOK_APP_SECRET = TEST_FACEBOOK_APP_SECRET;
	exports.MONGODB_URI = TEST_MONGODB_URI;
	exports.WIT_TOKEN = TEST_WIT_TOKEN;
} else if (status == 'avi') {
	exports.VERIFICATION_TOKEN = AVI_VERIFICATION_TOKEN;
	exports.FACEBOOK_APP_ID = AVI_FACEBOOK_APP_ID;
	exports.FACEBOOK_APP_SECRET = AVI_FACEBOOK_APP_SECRET;
	exports.MONGODB_URI = AVI_MONGODB_URI;
	exports.WIT_TOKEN = AVI_WIT_TOKEN;
	exports.MS_BOT_APP_ID = AVI_MS_BOT_APP_ID;
	exports.MS_BOT_PASSWORD = AVI_MS_BOT_PASSWORD;
	exports.LUIS_ID = AVI_LUIS_ID;
	exports.LUIS_SUBSCRIPTION_KEY = AVI_LUIS_SUBSCRIPTION_KEY;
}

//AWS S3 keys
exports.AWSaccessKeyId =  "AKIAIAQYS6UTUGDGOUPA";
exports.AWSsecretAccessKey = "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";

// CHANGE REMOTE ON HEROKU ACCORDINGLY BEFORE DEPLOYING
//PAGE ID
//MONTY MESSENGER 245261069180348
//KICKABOUT 1625739117677522

//still need to change
//redirect link in payment.js
//booking link generator in send.js inside generate_card_for_booking
//need to change app id and page id in game.ejs


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
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD"
