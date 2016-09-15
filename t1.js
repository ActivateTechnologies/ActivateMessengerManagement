{
    "_id": {
        "$oid": "57b3299adcba0f396ac72c6f"
    },
    "name": "onboardingPhoneNumber",
    "next": [
        {
            "id": "1",
            "sender": "bot",
            "nodeType": "quickReplies",
            "text": "Hey there! We at Kickabout are all about playing football. Sound Good?",
            "quickReplies": [
                "Yep"
            ],
            "next": [
                {
                    "id": "1.1",
                    "sender": "bot",
                    "nodeType": "text",
                    "text": "To register, please enter your phone number:",
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
                                            "text": "Cool thank you! Now lets get playing. Here are some games to join:",
                                            "next": [
                                                {
                                                    "id": "1.1.1.1.1.1",
                                                    "sender": "bot",
                                                    "nodeType": "function",
                                                    "function": "showEvents"
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
