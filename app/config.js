'use strict'

const status = 'production'; //'production' or 'test'

// PRODUCTION | Kickabout | heroku git:remote -a limitless-sierra-68694
// TEST | Monty Messenger | heroku git:remote -a kickabouttest

// Bot 8 - Monty Messener
// Bot 9 - Wembley FC
// Bot 10 - Avi Messenger



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

	else if(code === 'sheffieldHallam'){
		VERIFICATION_TOKEN = "EAAPmFZANQPNMBAN12jyRTW1TxU6ZBZAwfZBbpf3SajLYsqrAuz3MVtieZCZALbLxOpaE0PcXJYeVZAIK6ldiCeP0FHQlVhZBwdn1ivujTRhntJVwgM47kUiSCTNKa4HKPJVUdTHV766dTLa9ZAal6DOzrC0AErTs0AotXeCVZBbKjIAwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'kings'){
		VERIFICATION_TOKEN = "EAAJeEFl2kxMBAIgZAQQi68JyqN4miZA4NzijZAVuQndzI2zFMyNZCCZBMu3L70Qw5I392eNRxiVGS2lDwnqOVEZBwTYr95WwRLfcnpPKT6S9VgLQgg7kyUAYmbB9t6dZAnzhB04wQvffDovVAK4mSEBZCMsp9a5rdUbjc7lDBckUOgZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'salford'){
		VERIFICATION_TOKEN = "EAARHSh9eMe8BABbl3nPn0N0aBJYYKExOE082c8mSqw58vyLvFxYvewyllUKMlh1zbL1dMeZB5drc9GUosw72vhI76nVeQvJdo6E36ZBNRwgvRWFpsYzbVZBEgWvSZCJf6atopFpzIT1LbSiyLZA7HkNQIZA3JtDX8gIadZAZAb8AlwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'liverpool'){
		VERIFICATION_TOKEN = "EAAPOshDiARgBANOQD6uwU7LVXvWUvRWpTRuUCVyDbXZB3ZBrxHqWTttGPxKRWwo4AEcf4cAQz8bUHv9j3Urzjv9zZCHOGz3b6TRyzYKNzQ3CcRAbcfZAG1RP23o8aXb1jw9f5tJ7o0oJ9ZCueFJ6x2BWSwmu4ugWGlhiegrkWugZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'roehampton'){
		VERIFICATION_TOKEN = "EAAPXiDbQxgwBAEBfCokuJ7ZAmwJPb2BZBWBxqPiuZABdMtcTFEKCg5N6rCvzLphaHZAANhzL1NVi2NZAP3nXOxcwOGDgNZBwT3dFNjPPhhiELdyX6Tk0CLHPXFn3HSxVME1Y5MmYyLVfPDIeDTRF42aPiXNqqMVGeWMBz1UF8T6gZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot8'){
		VERIFICATION_TOKEN = "EAAHsfEZAJkVYBAOMiU57ZCf7lT4iaEipMpO4FC00vdG2bn42UJF0Y9qMZBAGgV79l73ypCk4nZA95TAuiLPzyYWuQ1fdJEReaqEcZC26gdoSUG1koWXAR0waeZCrMoZAXU96nY2PjcxsUAX9Px6QsoPxeKeirIL7CKEP2yPZA7HXawZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot9'){
		VERIFICATION_TOKEN = "EAAW9W8MJa2kBANybJfxAwJMxXsvhZC2T1rfB0rEJwDSkbkZB2UeZB7ROQhevnfJiMxw8hkBsql8gnIax8tE42B108phOltAQRbOZAyd2AlbBrxrMZCiclZCn79lCUam9OgTF6cVQpG8CXZChjjxIqwlQv0qEsWPhYaF8qJzZCP0NxAZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot10'){
		VERIFICATION_TOKEN = "EAAEd51HpEZCwBAA2Hp8mKndoguUBh3myZCZAIwmGSR3EYHWUJkF4OGckjYmZC3xT1AQ7CM8A6JzIVYZB7g1o0VsdFYNxhcrFWWfBkAEZAiGSFJU7oi379ty2vjKIgXrzYN82jDO8yOhaZAsVqFMeZARr7bE1hOq2ZAZBCmy3xXsAOk5QZDZD";
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
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAPXiDbQxgwBAEBfCokuJ7ZAmwJPb2BZBWBxqPiuZABdMtcTFEKCg5N6rCvzLphaHZAANhzL1NVi2NZAP3nXOxcwOGDgNZBwT3dFNjPPhhiELdyX6Tk0CLHPXFn3HSxVME1Y5MmYyLVfPDIeDTRF42aPiXNqqMVGeWMBz1UF8T6gZDZD"

// For setting up Get Started Button

// curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type":"call_to_actions",
//   "thread_state":"new_thread",
//   "call_to_actions":[
//     {
//       "payload":"yep"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAPXiDbQxgwBAEBfCokuJ7ZAmwJPb2BZBWBxqPiuZABdMtcTFEKCg5N6rCvzLphaHZAANhzL1NVi2NZAP3nXOxcwOGDgNZBwT3dFNjPPhhiELdyX6Tk0CLHPXFn3HSxVME1Y5MmYyLVfPDIeDTRF42aPiXNqqMVGeWMBz1UF8T6gZDZD"
