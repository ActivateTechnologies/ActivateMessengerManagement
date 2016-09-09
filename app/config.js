const status = 'test'; //'production' or 'test' or 'ani'

// PRODUCTION | Kickabout | heroku git:remote -a limitless-sierra-68694
// TEST | Monty Messenger | heroku git:remote -a kickabouttest

module.exports = function(code){

	let FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY,
		FACEBOOK_PAGE_ID, VERIFICATION_TOKEN, FACEBOOK_PAGE_URL, MESSENGER_URL,
		MONGODB_URI, ROOT_URL; CONVERSATION;


	if(code === 'kickabout'){
		CONVERSATION = "onboardingSimple";

		MESSENGER_URL = 'mongodb://anirudh:kickabout@ds013664.mlab.com:13664/bot';
		FACEBOOK_PAGE_ID = "http://m.me/kickaboutapp";
		FACEBOOK_PAGE_URL = "1625739117677522";
		MONGODB_URI = "http://wwww.facebook.com/kickaboutapp";
		VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD";
		ROOT_URL = "http://www.kickabout.football";
	}
	else {
		console.log("CODE not provided");
	}


	if (status === 'test') {
		VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD";
		MESSENGER_URL = "http://m.me/245261069180348";
		FACEBOOK_PAGE_ID = "245261069180348";
		FACEBOOK_PAGE_URL = "tofindout";
		MONGODB_URI = 'mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest';
		ROOT_URL = "https://kickabouttest.herokuapp.com";
	}

	else if (status == 'ani') {
		VERIFICATION_TOKEN = "EAAIL6dc0iLsBALpD2ZBiLskvxJjtB12xukUvLevmJE0S5BAHuFPgPY38h3fgX2UqxX54rRvzhMyiFFgydT9t3xilFAjZB4TVBFjV2ANzHtnnn19erpmfgcyv3SSA07nsYmZCjT4h47B2LkbB0iH0nGFrbCPnMCIo4wpQmrDqwZDZD";
		FACEBOOK_PAGE_ID = "519450361582633";
		FACEBOOK_PAGE_URL = "https://www.facebook.com/Anirudh-Test-519450361582633/";
		MESSENGER_URL = "http://m.me/631474433673481";
		MONGODB_URI = "mongodb://anirudh:kickabout@ds051575.mlab.com:51575/bottest";
		ROOT_URL = "https://3d84b846.ngrok.io";
	}


	// Setting Stripe Keys
	if(status === "production"){
		STRIPE_PUBLIC_KEY = "pk_live_Dey0ulbB4AOL81fmpzWnFKYa";
		STRIPE_SECRET_KEY = "sk_live_VmcnYw9pEBlxDKGddvKvL8Hu";
	}
	else {
		STRIPE_PUBLIC_KEY = "pk_test_p3GX2e0V1P9FteC3qz29z4YK";
		STRIPE_SECRET_KEY = "sk_test_Lspvreo5c3SnUK7EzaX7Ns1E";
	}

	return {
		STRIPE_PUBLIC_KEY: STRIPE_PUBLIC_KEY,
		STRIPE_SECRET_KEY: STRIPE_SECRET_KEY,

		FACEBOOK_PAGE_ID: FACEBOOK_PAGE_ID,
		VERIFICATION_TOKEN: VERIFICATION_TOKEN,
		FACEBOOK_PAGE_URL: FACEBOOK_PAGE_URL,
		MESSENGER_URL: MESSENGER_URL,
		MONGODB_URI: MONGODB_URI,
		ROOT_URL: ROOT_URL,

		// Constants
		AWSaccessKeyId: "AKIAIAQYS6UTUGDGOUPA",
		AWSsecretAccessKe: "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"
	}

}
