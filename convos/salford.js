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
            "text": "Welcome to the new UWE Football Community page. Please answer a few questions so we can help you get the most out of your football.",
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
                                                                    "nodeType": "quickReplies",
                                                                    "text": "What is your preferred position?",
                                                                    "quickReplies": [
                                                                        "Striker",
                                                                        "Winger",
                                                                        "Centre Mid",
                                                                        "Keeper",
                                                                        "Centre Back",
                                                                        "Full Back"
                                                                    ],
                                                                    "next": [
                                                                        {
                                                                            "id": "1.1.1.1.1.1.1.1.1",
                                                                            "sender": "bot",
                                                                            "nodeType": "function",
                                                                            "function": "saveStriker",
                                                                            "next": [
                                                                                {
                                                                                    "id": "1.1.1.1.1.1.1.1.1.1",
                                                                                    "sender": "bot",
                                                                                    "nodeType": "quickReplies",
                                                                                    "text": "What is your backup position?",
                                                                                    "quickReplies": [
                                                                                        "Striker",
                                                                                        "Winger",
                                                                                        "Centre Mid",
                                                                                        "Keeper",
                                                                                        "Centre Back",
                                                                                        "Full Back"
                                                                                    ],
                                                                                    "next": [
                                                                                        {
                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.1",
                                                                                            "sender": "bot",
                                                                                            "nodeType": "function",
                                                                                            "function": "saveStriker2",
                                                                                            "next": [
                                                                                                {
                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.1.1",
                                                                                                    "sender": "bot",
                                                                                                    "nodeType": "quickReplies",
                                                                                                    "text": "What is your previous level of football experience?",
                                                                                                    "quickReplies": [
                                                                                                        "Pro",
                                                                                                        "Semi Pro",
                                                                                                        "School/Uni",
                                                                                                        "Amateur"
                                                                                                    ],
                                                                                                    "next": [
                                                                                                        {
                                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.1.1.1",
                                                                                                            "sender": "bot",
                                                                                                            "nodeType": "function",
                                                                                                            "function": "savePro",
                                                                                                            "next": [
                                                                                                                {
                                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1",
                                                                                                                    "sender": "bot",
                                                                                                                    "nodeType": "quickReplies",
                                                                                                                    "text": "What is your kit size?",
                                                                                                                    "quickReplies": [
                                                                                                                        "XL",
                                                                                                                        "L",
                                                                                                                        "M",
                                                                                                                        "S",
                                                                                                                        "XS"
                                                                                                                    ],
                                                                                                                    "next": [
                                                                                                                      {
                                                                                                                          "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.1",
                                                                                                                          "sender": "bot",
                                                                                                                          "nodeType": "function",
                                                                                                                          "function": "saveXL",
                                                                                                                          "next": [
                                                                                                                              {
                                                                                                                                  "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1",
                                                                                                                                  "sender": "bot",
                                                                                                                                  "nodeType": "function",
                                                                                                                                  "function": "showEvents"
                                                                                                                              }
                                                                                                                          ]
                                                                                                                      },
                                                                                                                      {
                                                                                                                          "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.2",
                                                                                                                          "sender": "bot",
                                                                                                                          "nodeType": "function",
                                                                                                                          "function": "saveL",
                                                                                                                          "next": [
                                                                                                                              {
                                                                                                                                  "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.2.1",
                                                                                                                                  "sender": "bot",
                                                                                                                                  "nodeType": "function",
                                                                                                                                  "function": "showEvents"
                                                                                                                              }
                                                                                                                          ]
                                                                                                                      },
                                                                                                                      {
                                                                                                                          "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.3",
                                                                                                                          "sender": "bot",
                                                                                                                          "nodeType": "function",
                                                                                                                          "function": "saveM",
                                                                                                                          "next": [
                                                                                                                              {
                                                                                                                                  "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.3.1",
                                                                                                                                  "sender": "bot",
                                                                                                                                  "nodeType": "function",
                                                                                                                                  "function": "showEvents"
                                                                                                                              }
                                                                                                                          ]
                                                                                                                      },
                                                                                                                      {
                                                                                                                          "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.4",
                                                                                                                          "sender": "bot",
                                                                                                                          "nodeType": "function",
                                                                                                                          "function": "saveS",
                                                                                                                          "next": [
                                                                                                                              {
                                                                                                                                  "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.4.1",
                                                                                                                                  "sender": "bot",
                                                                                                                                  "nodeType": "function",
                                                                                                                                  "function": "showEvents"
                                                                                                                              }
                                                                                                                          ]
                                                                                                                      },
                                                                                                                      {
                                                                                                                          "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.5",
                                                                                                                          "sender": "bot",
                                                                                                                          "nodeType": "function",
                                                                                                                          "function": "saveXS",
                                                                                                                          "next": [
                                                                                                                              {
                                                                                                                                  "id": "1.1.1.1.1.1.1.1.1.1.1.1.1.1.5.1",
                                                                                                                                  "sender": "bot",
                                                                                                                                  "nodeType": "function",
                                                                                                                                  "function": "showEvents"
                                                                                                                              }
                                                                                                                          ]
                                                                                                                      }
                                                                                                                    ]
                                                                                                                }
                                                                                                            ]
                                                                                                        },
                                                                                                        {
                                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.1.1.2",
                                                                                                            "sender": "bot",
                                                                                                            "nodeType": "function",
                                                                                                            "function": "saveSemiPro",
                                                                                                            "next": [
                                                                                                                {
                                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.1.1.2.1",
                                                                                                                    "sender": "bot",
                                                                                                                    "nodeType": "jumpToId",
                                                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1.1.1.1.1"
                                                                                                                }
                                                                                                            ]
                                                                                                        },
                                                                                                        {
                                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.1.1.3",
                                                                                                            "sender": "bot",
                                                                                                            "nodeType": "function",
                                                                                                            "function": "saveSchool",
                                                                                                            "next": [
                                                                                                                {
                                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.1.1.3.1",
                                                                                                                    "sender": "bot",
                                                                                                                    "nodeType": "jumpToId",
                                                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1.1.1.1.1"
                                                                                                                }
                                                                                                            ]
                                                                                                        },
                                                                                                        {
                                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.1.1.4",
                                                                                                            "sender": "bot",
                                                                                                            "nodeType": "function",
                                                                                                            "function": "saveAmateur",
                                                                                                            "next": [
                                                                                                                {
                                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.1.1.4.1",
                                                                                                                    "sender": "bot",
                                                                                                                    "nodeType": "jumpToId",
                                                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1.1.1.1.1"
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.2",
                                                                                            "sender": "bot",
                                                                                            "nodeType": "function",
                                                                                            "function": "saveWinger2",
                                                                                            "next": [
                                                                                                {
                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.2.1",
                                                                                                    "sender": "bot",
                                                                                                    "nodeType": "jumpToId",
                                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1.1.1"
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.3",
                                                                                            "sender": "bot",
                                                                                            "nodeType": "function",
                                                                                            "function": "saveCenterMid2",
                                                                                            "next": [
                                                                                                {
                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.3.1",
                                                                                                    "sender": "bot",
                                                                                                    "nodeType": "jumpToId",
                                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1.1.1"
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.4",
                                                                                            "sender": "bot",
                                                                                            "nodeType": "function",
                                                                                            "function": "saveKeeper2",
                                                                                            "next": [
                                                                                                {
                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.4.1",
                                                                                                    "sender": "bot",
                                                                                                    "nodeType": "jumpToId",
                                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1.1.1"
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.5",
                                                                                            "sender": "bot",
                                                                                            "nodeType": "function",
                                                                                            "function": "saveCenterBack2",
                                                                                            "next": [
                                                                                                {
                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.5.1",
                                                                                                    "sender": "bot",
                                                                                                    "nodeType": "jumpToId",
                                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1.1.1"
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "id": "1.1.1.1.1.1.1.1.1.1.6",
                                                                                            "sender": "bot",
                                                                                            "nodeType": "function",
                                                                                            "function": "saveFullBack2",
                                                                                            "next": [
                                                                                                {
                                                                                                    "id": "1.1.1.1.1.1.1.1.1.1.6.1",
                                                                                                    "sender": "bot",
                                                                                                    "nodeType": "jumpToId",
                                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1.1.1"
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            "id": "1.1.1.1.1.1.1.1.2",
                                                                            "sender": "bot",
                                                                            "nodeType": "function",
                                                                            "function": "saveWinger",
                                                                            "next": [
                                                                                {
                                                                                    "id": "1.1.1.1.1.1.1.1.2.1",
                                                                                    "sender": "bot",
                                                                                    "nodeType": "jumpToId",
                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            "id": "1.1.1.1.1.1.1.1.3",
                                                                            "sender": "bot",
                                                                            "nodeType": "function",
                                                                            "function": "saveCenterMid",
                                                                            "next": [
                                                                                {
                                                                                    "id": "1.1.1.1.1.1.1.1.3.1",
                                                                                    "sender": "bot",
                                                                                    "nodeType": "jumpToId",
                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            "id": "1.1.1.1.1.1.1.1.4",
                                                                            "sender": "bot",
                                                                            "nodeType": "function",
                                                                            "function": "saveKeeper",
                                                                            "next": [
                                                                                {
                                                                                    "id": "1.1.1.1.1.1.1.1.4.1",
                                                                                    "sender": "bot",
                                                                                    "nodeType": "jumpToId",
                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            "id": "1.1.1.1.1.1.1.1.5",
                                                                            "sender": "bot",
                                                                            "nodeType": "function",
                                                                            "function": "saveCenterBack",
                                                                            "next": [
                                                                                {
                                                                                    "id": "1.1.1.1.1.1.1.1.5.1",
                                                                                    "sender": "bot",
                                                                                    "nodeType": "jumpToId",
                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            "id": "1.1.1.1.1.1.1.1.6",
                                                                            "sender": "bot",
                                                                            "nodeType": "function",
                                                                            "function": "saveFullBack",
                                                                            "next": [
                                                                                {
                                                                                    "id": "1.1.1.1.1.1.1.1.6.1",
                                                                                    "sender": "bot",
                                                                                    "nodeType": "jumpToId",
                                                                                    "jumpToId": "1.1.1.1.1.1.1.1.1.1"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
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
