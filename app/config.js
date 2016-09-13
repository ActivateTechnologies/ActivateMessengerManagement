'use strict'

const status = 'production'; //'production' or 'test' or 'ani'

// PRODUCTION | Kickabout | heroku git:remote -a limitless-sierra-68694
// TEST | Monty Messenger | heroku git:remote -a kickabouttest

module.exports = function(code){

	let STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, VERIFICATION_TOKEN,
	 ROOT_URL, CONVERSATION;


	if(code === 'kickabout'){
		console.log(22222);
		CONVERSATION = "onboardingSimple";
		VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD";
		ROOT_URL = "http://www.kickabout.football";
	}
	else if(code === 'uwe'){
		console.log(11111);
		CONVERSATION = "onboardingSimple";
		VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD";
		ROOT_URL = "http://www.kickabout.football";
	}
	else {
		console.log("CODE not provided in config.js");
	}


	if (status === 'test') {
		VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD";
		ROOT_URL = "https://kickabouttest.herokuapp.com";
	}

	else if (status == 'ani') {
		VERIFICATION_TOKEN = "EAAIL6dc0iLsBALpD2ZBiLskvxJjtB12xukUvLevmJE0S5BAHuFPgPY38h3fgX2UqxX54rRvzhMyiFFgydT9t3xilFAjZB4TVBFjV2ANzHtnnn19erpmfgcyv3SSA07nsYmZCjT4h47B2LkbB0iH0nGFrbCPnMCIo4wpQmrDqwZDZD";
		ROOT_URL = "https://cdfa1c65.ngrok.io";
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
		status: status,

		STRIPE_PUBLIC_KEY: STRIPE_PUBLIC_KEY,
		STRIPE_SECRET_KEY: STRIPE_SECRET_KEY,

		VERIFICATION_TOKEN: VERIFICATION_TOKEN,
		ROOT_URL: ROOT_URL,
		CONVERSATION: CONVERSATION,

		// Constants
		AWSaccessKeyId: "AKIAIAQYS6UTUGDGOUPA",
		AWSsecretAccessKe: "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"
	}

}
