{
    "_id": {
        "$oid": "57b3299adcba0f396ac72c6f"
    },
    "name": "onboarding",
    "next": [
        {
            "id": "1",
            "sender": "bot",
            "nodeType": "quickReplies",
            "text": "Welcome to the Sheffield Hallam University page. Please answer a few questions so we can help you get the most out of your football.",
            "quickReplies": [
                "Continue"
            ],
            "next": [
                {
                    "id": "1.1",
                    "sender": "bot",
                    "nodeType": "text",
                    "text": "What is your phone number?",
                    "next": [
                        {
                            "id": "1.1.1",
                            "sender": "user",
                            "nodeType": "text",
                            "userErrorText": "Really sorry, but we need your phone number before we can proceed.",
                            "next": [
                                {
                                    "id": "1.1.1.1",
                                    "sender": "bot",
                                    "nodeType": "function",
                                    "function": "collectPhoneNumber",
                                    "next": [


                                      {
                                          "id": "1.1.1.1.1",
                                          "sender": "bot",
                                          "nodeType": "text",
                                          "text": "What is your email?",
                                          "next": [
                                              {
                                                  "id": "1.1.1.1.1.1",
                                                  "sender": "user",
                                                  "nodeType": "text",
                                                  "userErrorText": "Really sorry, but we need your email before we can proceed.",
                                                  "next": [
                                                      {
                                                          "id": "1.1.1.1.1.1.1",
                                                          "sender": "bot",
                                                          "nodeType": "function",
                                                          "function": "collectEmail",
                                                          "next": [

                                                              {
                                                                  "id": "1.1.1.1.1.1.1.1",
                                                                  "sender": "bot",
                                                                  "nodeType": "function",
                                                                  "function": "showEvents"
                                                              },


                                                              {
                                                                  "id": "1.1.1.1.1.1.1.2",
                                                                  "sender": "bot",
                                                                  "nodeType": "text",
                                                                  "text": "That doesn't seem like a valid email sorry, try typing out your email again?",
                                                                  "next": [
                                                                      {
                                                                          "id": "1.1.1.1.1.1.1.2.1",
                                                                          "sender": "bot",
                                                                          "nodeType": "jumpToId",
                                                                          "jumpToId": "1.1.1.1.1"
                                                                      }
                                                                  ]
                                                              }
                                                          ]
                                                      }
                                                  ]
                                              }
                                          ]
                                      },


                                        {
                                            "id": "1.1.1.1.2",
                                            "sender": "bot",
                                            "nodeType": "text",
                                            "text": "That doesn't seem like a valid phone number sorry, try typing out your phone number again?",
                                            "next": [
                                                {
                                                    "id": "1.1.1.1.2.1",
                                                    "sender": "bot",
                                                    "nodeType": "jumpToId",
                                                    "jumpToId": "1.1.1"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
