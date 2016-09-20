'use strict'

const status = 'production'; //'production' or 'test'

// PRODUCTION | Kickabout | heroku git:remote -a limitless-sierra-68694
// TEST | Monty Messenger | heroku git:remote -a kickabouttest

// Bot 5 - Monty Messener
// Bot 6 - Wembley FC
// Bot 7 - Avi Messenger



module.exports = function(code){

	let STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, VERIFICATION_TOKEN,
	 ROOT_URL;


	if(code === 'kickabout'){
		VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD";
		ROOT_URL = "http://www.kickabout.football";
	}

	else if(code === 'uwe'){
		VERIFICATION_TOKEN = "EAAW8z3Llta8BAPXlubWU8t1aQyLUi00ANNBaiorYExsOZAOT63bRMhEXZCrdxQctJvzEyVV4NfgESKA0mjsQLpsVkNyePaZBDvalW4pzAcxIvkaZCpePB62bO7ttzkKayR5tiZBoocAbqVYgWS3QguUQqmASIJNH7dvJx6zNLKgZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'ucl'){
		// attached to wembley fc using the wickedstudentnightsapp
		VERIFICATION_TOKEN = "EAAQmEkmfekUBAKdoF4WKdMi6q3mNI4mPyND6tV5BnrY0OIdFH8UnHmZCVUZBZA1JshTwsw45V6pSLUFPbMB5cWkLdGkC90P72AWQBoKaGGRJatLJIyGDaAfucKKygG9wqSo3vXbXCnrK8dy4D35zmUUp4owMOd7ZBFBdZCxtKfAZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'sheffieldHallam'){
		VERIFICATION_TOKEN = "EAAPmFZANQPNMBAN12jyRTW1TxU6ZBZAwfZBbpf3SajLYsqrAuz3MVtieZCZALbLxOpaE0PcXJYeVZAIK6ldiCeP0FHQlVhZBwdn1ivujTRhntJVwgM47kUiSCTNKa4HKPJVUdTHV766dTLa9ZAal6DOzrC0AErTs0AotXeCVZBbKjIAwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'kings'){
		VERIFICATION_TOKEN = "EAAPmFZANQPNMBAN12jyRTW1TxU6ZBZAwfZBbpf3SajLYsqrAuz3MVtieZCZALbLxOpaE0PcXJYeVZAIK6ldiCeP0FHQlVhZBwdn1ivujTRhntJVwgM47kUiSCTNKa4HKPJVUdTHV766dTLa9ZAal6DOzrC0AErTs0AotXeCVZBbKjIAwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'salford'){
		VERIFICATION_TOKEN = "EAARHSh9eMe8BABbl3nPn0N0aBJYYKExOE082c8mSqw58vyLvFxYvewyllUKMlh1zbL1dMeZB5drc9GUosw72vhI76nVeQvJdo6E36ZBNRwgvRWFpsYzbVZBEgWvSZCJf6atopFpzIT1LbSiyLZA7HkNQIZA3JtDX8gIadZAZAb8AlwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot5'){
		VERIFICATION_TOKEN = "EAAPXiDbQxgwBAHvLWwuz1L4Qn22JNbNNrPpfadAYfeUL3E0Wt2L2Tyc6Yvk7AyVVV1TaaZCM7KVwgGFFzuSiMNaxTqKrTfDPyoJqMQFjUpz0CZBWs7kNwGx1ifWgHSw7RSR7rKpL1v2x2jLoVN4C7mhlXFTMSZAsmKqOn0AjAZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot6'){
		VERIFICATION_TOKEN = "EAAYvJrXVU1sBAKxvcvZAY6ZBp44xBe6nFX0KaULy4g9dJXTzZBDe4eMxNkn8j2InJl9TSZAlZCsQCIUjhzIPrOGxeIE1NP7MK1g18LKaMsV5iDdEovN17ZA6LUpfEnAnqY7ZBZBCaa1I92PSxEiQOuL32aNpPQuq1IYg47XJsORfpQZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot7'){
		VERIFICATION_TOKEN = "EAAOmcqjs0c0BAAZBQSZBpPfU6gFZCwqbWLiipYfwOefnxAfPF8UZBdfmNZCblOZB6I6FoVHmknDdHw19V2rZBeVY7GwPb2qruUOcZCZBMe1bygm15RHxfesOgpEqPJuq7CMjTZCO1l6PwnYVcg2Cnfj6ZBAZAC4OeZCGlarfQCSN3WBOBjAZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if (code == 'ani') {
		VERIFICATION_TOKEN = "EAAIL6dc0iLsBAGZCZAl7lUMfe6X70T1Nvoj9g5ioMZAVDivJDZCZBM1aWYZBjNLjBWWlQxafiU4TU3IIHYaoh8zEHFlqdSMrDLdx1adySu9Qdfsa7Wy1BUOIdpNpUAZAsUNBhZCEKKyAI0vRqVWx1oSn4WyAhl5H7PZBIrZAx8uZArECwZDZD";
		ROOT_URL = "https://75e17495.ngrok.io";
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
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAARHSh9eMe8BABbl3nPn0N0aBJYYKExOE082c8mSqw58vyLvFxYvewyllUKMlh1zbL1dMeZB5drc9GUosw72vhI76nVeQvJdo6E36ZBNRwgvRWFpsYzbVZBEgWvSZCJf6atopFpzIT1LbSiyLZA7HkNQIZA3JtDX8gIadZAZAb8AlwZDZD"

// For setting up Get Started Button

// curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type":"call_to_actions",
//   "thread_state":"new_thread",
//   "call_to_actions":[
//     {
//       "payload":"yep"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAARHSh9eMe8BABbl3nPn0N0aBJYYKExOE082c8mSqw58vyLvFxYvewyllUKMlh1zbL1dMeZB5drc9GUosw72vhI76nVeQvJdo6E36ZBNRwgvRWFpsYzbVZBEgWvSZCJf6atopFpzIT1LbSiyLZA7HkNQIZA3JtDX8gIadZAZAb8AlwZDZD"
