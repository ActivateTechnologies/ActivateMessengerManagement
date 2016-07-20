//PRODUCTION
// heroku git:remote -a limitless-sierra-68694

// const VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD"
// const FACEBOOK_APP_ID = "144481079297226"
// const FACEBOOK_APP_SECRET = "177f41bf5495e3673481700e4ec6995d"
// const MONGODB_URI = 'mongodb://anirudh:kickabout@ds013664.mlab.com:13664/bot'
// const MESSENGER_URL = "http://m.me/kickaboutapp"
// const WIT_TOKEN = "KEGDQB5O6BMVEPWVO33VVLUOPQ6EPUVN";

//TEST
// heroku git:remote -a kickabouttest
// Avi Messenger webhook url: http://kickabouthegiu2389t3g034gg3433ghnod.localtunnel.me/
const VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD";
const FACEBOOK_APP_ID = "159289771143437";
const FACEBOOK_APP_SECRET = "56cabb5a4f98662b998e4849d01bb826";
const MONGODB_URI = 'mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest';
const MESSENGER_URL = "http://m.me/245261069180348";
const WIT_TOKEN = "KEGDQB5O6BMVEPWVO33VVLUOPQ6EPUVN";

//COMMON TO PRODUCTION AND TEST
exports.VERIFICATION_TOKEN = VERIFICATION_TOKEN;
exports.FACEBOOK_APP_ID = FACEBOOK_APP_ID;
exports.FACEBOOK_APP_SECRET = FACEBOOK_APP_SECRET;
exports.MONGODB_URI = MONGODB_URI;
exports.WIT_TOKEN = WIT_TOKEN;

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