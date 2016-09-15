'use strict'

const status = 'production'; //'production' or 'test'

// PRODUCTION | Kickabout | heroku git:remote -a limitless-sierra-68694
// TEST | Monty Messenger | heroku git:remote -a kickabouttest

module.exports = function(code){

	let STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, VERIFICATION_TOKEN,
	 ROOT_URL;


	if(code === 'kickabout'){
		VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD";
		ROOT_URL = "http://www.kickabout.football";
	}
	else if(code === 'uwe'){
		VERIFICATION_TOKEN = "EAAW8z3Llta8BAPXlubWU8t1aQyLUi00ANNBaiorYExsOZAOT63bRMhEXZCrdxQctJvzEyVV4NfgESKA0mjsQLpsVkNyePaZBDvalW4pzAcxIvkaZCpePB62bO7ttzkKayR5tiZBoocAbqVYgWS3QguUQqmASIJNH7dvJx6zNLKgZDZD";
		//VERIFICATION_TOKEN = "EAAIL6dc0iLsBALpD2ZBiLskvxJjtB12xukUvLevmJE0S5BAHuFPgPY38h3fgX2UqxX54rRvzhMyiFFgydT9t3xilFAjZB4TVBFjV2ANzHtnnn19erpmfgcyv3SSA07nsYmZCjT4h47B2LkbB0iH0nGFrbCPnMCIo4wpQmrDqwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}
	else if(code === 'ucl'){
		VERIFICATION_TOKEN = "EAAIL6dc0iLsBALpD2ZBiLskvxJjtB12xukUvLevmJE0S5BAHuFPgPY38h3fgX2UqxX54rRvzhMyiFFgydT9t3xilFAjZB4TVBFjV2ANzHtnnn19erpmfgcyv3SSA07nsYmZCjT4h47B2LkbB0iH0nGFrbCPnMCIo4wpQmrDqwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	// else if (code === 'test') {
	// 	VERIFICATION_TOKEN = "EAACQ34o5sQ0BANnKbZCduf6FkAZCjaXufTqIsja5YuPVq5ZADHD9u9Q3fGikMBzSRNkzLiwXVzTFUHzZB1eUziYRYIdu6mfvdRzIriHqwVFvrtstBI5vsMcBTQi8eSjV6b8ZAqIsJZCmsabrc9utJFH3J6ZATZAmUaLCiwPMuiRV7QZDZD";
	// 	ROOT_URL = "https://kickabouttest.herokuapp.com";
	// }

	else if (code == 'ani') {
		VERIFICATION_TOKEN = "EAAIL6dc0iLsBALpD2ZBiLskvxJjtB12xukUvLevmJE0S5BAHuFPgPY38h3fgX2UqxX54rRvzhMyiFFgydT9t3xilFAjZB4TVBFjV2ANzHtnnn19erpmfgcyv3SSA07nsYmZCjT4h47B2LkbB0iH0nGFrbCPnMCIo4wpQmrDqwZDZD";
		ROOT_URL = "https://9a46004d.ngrok.io";
	}
	else {
		console.log("CODE not provided in config.js");
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
		ROOT_URL: ROOT_URL
	}

}


// For setting up Persistent Menu

// curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type" : "call_to_actions",
//   "thread_state" : "existing_thread",
//   "call_to_actions":[
//     {
//       "type":"postback",
//       "title":"Show Events",
//       "payload":"play"
//     },
//     {
//       "type":"postback",
//       "title":"My Events",
//       "payload":"my events"
//     },
// 		{
//       "type":"postback",
//       "title":"Notifications",
//       "payload":"notifications"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAIL6dc0iLsBABYhZB3KsNv8N3uARJ7mqLDHPdSL2bEAqms3uuGRQMy4jXv9ZB2vLTIbR2xS3IuFZBatM20NVYtQyjKH3wZAMWzd2pRnB3tYHXHzwgxPMfdIiYSZBlhK9ZAOZBBtaSSeefdgjHTTDc3HaTzdB29sWY3f1KNyNF5nAZDZD

// For setting up Get Started Button

// curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type":"call_to_actions",
//   "thread_state":"new_thread",
//   "call_to_actions":[
//     {
//       "payload":"yep"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAQmEkmfekUBAD8bq0HX9x88drq8YxBOmGSGCynWJaQK6yZA28cuURx54GjgZBm5NALa3mvfxNFrJYingqlYgkSfLNUPyINyZBCoE2E8PkzsZAThe4zMKgS13llcP1mkItozytvmvyVOOfoKZBJXvURBDpowRYZCTsGkgJQYTQNgZDZD"
