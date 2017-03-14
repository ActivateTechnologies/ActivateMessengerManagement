'use strict'

const status = 'production'; //'production' or 'test'

// PRODUCTION | Kickabout | heroku git:remote -a limitless-sierra-68694
// TEST | Monty Messenger | heroku git:remote -a kickabouttest

// Bot 15 - Monty Messener
// Bot 16 - Wembley FC
// Bot 17 - Avi Messenger
// Bot 18 - Anirudh Test



module.exports = function(code){

	let STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, VERIFICATION_TOKEN,
	 ROOT_URL;


	if(code === 'kickabout'){
		VERIFICATION_TOKEN = "EAACDZA59ohMoBABsVdZBRaXqrPeauovKzZB2JmyoZA87PLeIlTZCXNy1ry0EX7q7ZBNNpb3UAKlhirwPDZCniRY1JvHZCzlkIXceCWZBNUh3sNooO8L8tVAYcJRZAIzRljP1wcQgxeTuu7rtRLHEteAVmjKuPjfxXfXkkwKW8h7h981QZDZD";
		ROOT_URL = "http://www.kickabout.football";
	}

	else {
		console.log("CODE not provided in config.js");
	}


	// Setting Stripe Keys
	if(status === "production"){
		STRIPE_PUBLIC_KEY = "";
		STRIPE_SECRET_KEY = "";
	}
	else {
		STRIPE_PUBLIC_KEY = "";
		STRIPE_SECRET_KEY = "";
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
//       "title":"Show Events 🗓",
//       "payload":"play"
//     },
//     {
//       "type":"postback",
//       "title":"My Events 📝",
//       "payload":"my events"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAH7eotDS6EBANGtGQzV3eedtovnzRE2pJfZAjBP9H56A3ZBZBFwmZAQUXF1D9axS1ZCuVqLRdq4aClOn0zyViYoEjrWGZCnKzXZBq6EcAi6sscyIPOL8rudqplb926NtKLSEmBownod79LYwYKrYVNi9FnIS982Ep2buHSnn2hywZDZD"

// For setting up Get Started Button

// curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type":"call_to_actions",
//   "thread_state":"new_thread",
//   "call_to_actions":[
//     {
//       "payload":"yep"
//     }
//   ]
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAH7eotDS6EBANGtGQzV3eedtovnzRE2pJfZAjBP9H56A3ZBZBFwmZAQUXF1D9axS1ZCuVqLRdq4aClOn0zyViYoEjrWGZCnKzXZBq6EcAi6sscyIPOL8rudqplb926NtKLSEmBownod79LYwYKrYVNi9FnIS982Ep2buHSnn2hywZDZD"
