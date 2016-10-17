{
    "_id": {
        "$oid": "57a9e635f36d2840aa65ecd2"
    },
    "name": "onboarding",
    "next": [
        {
            "id": "1",
            "sender": "bot",
            "nodeType": "quickReplies",
            "text": "Welcome to the new University of Birmingham - Everything Basketball bot. Please answer a few questions so we can help you get the most out of your football.",
            "quickReplies": [
                "Continue"
            ],
            "next": [
              {
                  "id": "1.1",
                  "sender": "bot",
                  "nodeType": "quickReplies",
                  "text": "What is your previous level of basketball experience?",
                  "quickReplies": [
                      "Pro",
                      "Semi Pro",
                      "School/Uni",
                      "Amateur"
                  ],
                  "next": [
                      {
                          "id": "1.1.1",
                          "sender": "bot",
                          "nodeType": "function",
                          "function": "savePro",
                          "next": [
                            {
                                "id": "1.1.1.1",
                                "sender": "bot",
                                "nodeType": "function",
                                "function": "showEvents"
                            }
                          ]
                      },
                      {
                          "id": "1.1.2",
                          "sender": "bot",
                          "nodeType": "function",
                          "function": "saveSemiPro",
                          "next": [
                            {
                                "id": "1.1.2.1",
                                "sender": "bot",
                                "nodeType": "function",
                                "function": "showEvents"
                            }
                          ]
                      },
                      {
                          "id": "1.1.3",
                          "sender": "bot",
                          "nodeType": "function",
                          "function": "saveSchool",
                          "next": [
                            {
                                "id": "1.1.3.1",
                                "sender": "bot",
                                "nodeType": "function",
                                "function": "showEvents"
                            }
                          ]
                      },
                      {
                          "id": "1.1.4",
                          "sender": "bot",
                          "nodeType": "function",
                          "function": "saveAmateur",
                          "next": [
                            {
                                "id": "1.1.4.1",
                                "sender": "bot",
                                "nodeType": "function",
                                "function": "showEvents"
                            }
                          ]
                      }
                  ]
              }
            ]
        }
    ]
}
