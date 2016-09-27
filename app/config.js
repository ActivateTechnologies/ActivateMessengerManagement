'use strict'

const status = 'production'; //'production' or 'test'

// PRODUCTION | Kickabout | heroku git:remote -a limitless-sierra-68694
// TEST | Monty Messenger | heroku git:remote -a kickabouttest

// Bot 11 - Monty Messener
// Bot 12 - Wembley FC
// Bot 13 - Avi Messenger
// Bot 14 - Anirudh Test



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

	else if(code === 'bedfordshire'){
		VERIFICATION_TOKEN = "EAAYvJrXVU1sBAFZBAC8bpItqCZBKNcZBxbleaxcIdLYiJVZAelRfpQFI6pPZAaoz2JHeMqJfvkljpFp1mLBqtHriJCPrHiQlZCjOEOwjJ0pOl06BukAqP61AQflGTYMToYSLWGHq7lHm7Q9khreq0yZBKKzb0wUv6V24K3YRvOcHgZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'ssees'){
		VERIFICATION_TOKEN = "EAAOmcqjs0c0BAOaBJctZCpOeWiG6Bc6hwMX1BLOjdeQHW8YWwFvIPKrBpFXi6rlP2awuBbTZA3WUQxPGiwvNuxqcm2Y6abu7BBclI6cdRbQfPRqZCmZCZA6TdnWxHB3kxfrb8U6R4o57BTxU3yMC4fYf5lISWrZCN6JGM1AnzlrgZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'ucl'){
		VERIFICATION_TOKEN = "EAAHsfEZAJkVYBAIKVGRuhthACyc1vjkYDr4jZAARj1ZCG57Y30AOxyRb66I1rE9yv3T8fa45ZAhU2uFm7byIM110Ec4ZAATcZA9B0doLdvh2LXumncuk2EMS3r4gje0ZBqge9xuDBBermsPf2hrrdG9lBbLlsZCuB1RJTDoGbxLcLwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'hertfordshire'){
		VERIFICATION_TOKEN = "EAAW9W8MJa2kBAFJeBqF2osbFlNOkBwbY6LMq4zOOcH710ParO5E8IOL4EKvnFUwbKzYXzPwPajDkY6uOlBRTlrTZASdvBYvC38wQKUTmqYq693PSxeYOJWPo7iZA0f0ubpaCNS4ZC8gVoeKYbQ6jna4Gdf5QibQyNsI6wtIdAZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}EAAW9W8MJa2kBAFJeBqF2osbFlNOkBwbY6LMq4zOOcH710ParO5E8IOL4EKvnFUwbKzYXzPwPajDkY6uOlBRTlrTZASdvBYvC38wQKUTmqYq693PSxeYOJWPo7iZA0f0ubpaCNS4ZC8gVoeKYbQ6jna4Gdf5QibQyNsI6wtIdAZDZD
	else if(code === 'bot11'){
		VERIFICATION_TOKEN = "EAAX1JAdwI9MBALz7BLzpV35Qe0XqVrnGKNZCEACeXmeUZCAG6Jdn3bo8KGYvdFzxljixu5psqnHi8FfVFJ07Apof7zJGgxqcbybcQSAyCFzF7gCgXOcDz0dFliRon23tgF1xZCZCW2GmFxJyD4NURZAnTbDrZCbKwmoqxXSz4fWgZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot12'){
		VERIFICATION_TOKEN = "EAACBLyO7Q4wBAMnoEL24gpNeV4ZC4o2N5JBjCat6RZCJ62k8KNZBZBK93F3QYQ1USEaxamXHTvZBloD3rhKJb5pBoVLZB4AZByd7dTbItYtY6ZByrdZBue2oQApTNdmgkw2VHE9qPvKgWUnHSRupfFbRIN0F5L2Oiq1zyUxJBf7xnewZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot13'){
		VERIFICATION_TOKEN = "EAAZA6iwin4KgBAIz47eyFfXinT9vJqpLX4AgTJZCVfZAXNF50guxkGgstWttLsZCRKEsSqX9ZC1aT8V1dw6kVHi6AM8KICwPSiQ7eZB0Y79ePIemajAM9OGIgjp8o2IEgfCsC6H07ZB4OteptZBHWUmmsuiZA6VVVZAwYb1ssh9A5GYQZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot14'){
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
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAW9W8MJa2kBAFJeBqF2osbFlNOkBwbY6LMq4zOOcH710ParO5E8IOL4EKvnFUwbKzYXzPwPajDkY6uOlBRTlrTZASdvBYvC38wQKUTmqYq693PSxeYOJWPo7iZA0f0ubpaCNS4ZC8gVoeKYbQ6jna4Gdf5QibQyNsI6wtIdAZDZD"

// For setting up Get Started Button

// curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type":"call_to_actions",
//   "thread_state":"new_thread",
//   "call_to_actions":[
//     {
//       "payload":"yep"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAW9W8MJa2kBAFJeBqF2osbFlNOkBwbY6LMq4zOOcH710ParO5E8IOL4EKvnFUwbKzYXzPwPajDkY6uOlBRTlrTZASdvBYvC38wQKUTmqYq693PSxeYOJWPo7iZA0f0ubpaCNS4ZC8gVoeKYbQ6jna4Gdf5QibQyNsI6wtIdAZDZD"
