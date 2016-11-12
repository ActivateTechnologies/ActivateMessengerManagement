'use strict'

const status = 'test'; //'production' or 'test'

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
	}

	else if(code === 'entrepreneurs'){
		VERIFICATION_TOKEN = "EAAEd51HpEZCwBADOoxUDUZCoHHodFrbMIh9gI9PpUXs5ABmZBhDZBzrMEE8dOBrOPcNU45IZBiSZBfXyylopwZBeqxZC2ZCxcUAHOwnKM0u4jZAKAug4Bh9bXpJUevIZCwyYhdVf2X4Yjzi6k6Y0yrW5AOCrNqz3J4v9aoWX85WQZBlrrwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'lacrosse'){
		VERIFICATION_TOKEN = "EAAX1JAdwI9MBALKXa20Be3EGOHE67PqtbA0USJ5KciYZA1lWEyI7IcBh1LAhEjL3mMTjSF0pxdny8VO7f8euEO9kBKFiaJNRxHndLOEMxz9InjcbaLGTwa74RCEG9BKlrBZAQgsmOCfDlajUmg9UjyZBOwysaWmyf22shpZBvAZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'parkour'){
		VERIFICATION_TOKEN = "EAACBLyO7Q4wBAG8LdfNTBMG224iphXt9VrAWgMzZB7QqI2VAgOcBKYosGZBkB7Ko5ZA3YxDCdpWyOxZAAI9xQ61WexKeiIflKNlLjQGUylCsHUT60LquRy2oq2qYimivq5OPt0eogKrdO1EJah1h5LpPpGHhzVLZABHBVVz64oAZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'birmingham'){
		VERIFICATION_TOKEN = "EAAZA6iwin4KgBAFNz9s7nslfO8BUqNReUSIqrBOHzDV18cZBxV5vEMDJIHQGZBnmbjuz8R9LZBfyfwbWqRh6lfBJ4L83FZBeVLqPZBZBjBLk1lRgOpeVp0J3YVcNjU6r3Dtn30G8USuFtrUyyCl4N3C1Ksmvl39cY1THbipfLVb2wZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'birmingham_basketball'){
		VERIFICATION_TOKEN = "EAAZAfg4qX41oBAEmj82oApLKGYT4gIPvx8FTVjMra399JS9YozvA5KKHTDRPmXnDCdXKyc4JN3Y4HaveAaxqgfoZApm190ZB2piDqrXgDZCdGDF0EZA4fXkU7zzQyjE9cspZAUsL7quaRU1tuGvqF9PdL6Q3yzs4dfGSnVZBfXIFwZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'hull'){
		VERIFICATION_TOKEN = "EAASRxicK1BEBAG7YxskIO25jv65u4OE1TeMEgBPlRUxuSQkVdQT8CDrtljQavSTZCI9eFHFdGJqIuXeuvHW2VryYCaJeoJDvyV7krrops9o1ZAwuxYQ1gp6apcrYK2p2ZAw8220hvhwqmSmMZAg3mR33vrqNWekZAIShokzHE8gZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'wegeek'){
		VERIFICATION_TOKEN = "EAAH7eotDS6EBAGdWZCiNUBIPgMc6K2E8WdCbwqir7KKVCkWlgYzUyxBkCcm1O4zgm7nfT5dZC2omQJ9MMUmziniZBvmTZCULKwFW7T8EyN8fQxlKtFDx7f0r6ZArZBqd4jld8nCMaML26dnpmXHrVtlZBmu3OOt1U9xBhu1SlJlPgZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot15'){
		VERIFICATION_TOKEN = "EAASRxicK1BEBABVSZCXjCNU88PuTQZBFIbDrckZCoT6YxQZCM5qCopl1bG1ZBu6bfeL6wwZAWQbZCrug4hHJiS4g9mvvYa98DXia9wO6mxZAUd195Grib20HOAR65ltZBryCUtOLOOczzP2qTtVwfETojWgE3oBqkBH5bzoIT9TUgXAZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot16'){
		VERIFICATION_TOKEN = "EAAH7eotDS6EBAJ8VynxJvlfCnxKhLPiIHQNCZAr6NKVojr1ZCAkBYqV6iWKQrG328wsrGVgjGBBk9z2CbIYRnXbazL6ZByEoh8vVZA2tM7jGE7RJY3gmOr3D51kvFsYhoasXQZBA8ryBTby27HBisOOkfNUP3NzPKFAcOq8WG6QZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot17'){
		VERIFICATION_TOKEN = "EAAC71ZAsDHiEBANWKFZANj8y2jO5CnLbwkxZCa8X5MZCHnPqZCmgSWt86vcKwzEiLnhC6JC5aO5aI9ZAAHj0dUIvYGtEaZBMRFHQyRcfV14ax9YzfHrnDDMZBROJBj7zZBwp27WPWjbEFwR2cjueoWnsUZAYXdF1FXiYvkqlPbxVONhQZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if(code === 'bot18'){
		VERIFICATION_TOKEN = "EAAdxEjAbauwBAOizPui6j1ZB4kdnrB3JDFFVHkq5wzFeZCMZBWlvLaoCWsvZAWbwM6WZB5ZBI3OB4xCwEmtdFnKjZAjlEQUA8ZALZC2zv5F3ovkcnhELGwOaT6DhZBGSiyHuy2WITZBvuCxMINDYBfdZCQOOfwSsXqhqP1QCBHOrnzZAB3gZDZD";
		ROOT_URL = "http://www.activatetechnologies.co.uk";
	}

	else if (code == 'ani') {
		VERIFICATION_TOKEN = "EAAIL6dc0iLsBANEl8YmfIIGihJFiNLIQOBq2dQ7Y9IyJZBjRhq1sYTJi12KbJ69XeWJ8rzjhZAvfZAyLpgCuUZCGjPLnJfNedJD02fJC9D4jdMfm7omnBJGwY31MVjUPJaS8JCZABO62GExbtd24pTJ5tHu7T0t0TEY3jC2d5LQZDZD";
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
