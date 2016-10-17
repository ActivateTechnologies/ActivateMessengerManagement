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
            "text": "Hey there! We at Kickabout are all about playing football. Sound Good?",
            "quickReplies": [
                "Yep"
            ],
            "next": [

              {
                  "id": "1.1",
                  "sender": "bot",
                  "nodeType": "quickReplies",
                  "text": "Do you want to receive weekly updates about games from us?",
                  "quickReplies": [
                      "Yes",
                      "No"
                  ],
                  "next": [
                      {
                          "id": "1.1.1",
                          "sender": "bot",
                          "nodeType": "function",
                          "function": "showEvents"
                      },
                      {
                          "id": "1.1.2",
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
