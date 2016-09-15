'use strict'

const request = require('request');


module.exports = function(code){

  const M = require('./../models/' + code);
  const Config = require('./../config')(code);
  const Send = require('./../send.js')(code);

  /*
    Retrieves specified conversation from database and starts executing by
    calling executeTreeNode() with the first node */
  function startConversation(uid, conversationName, user) {
    M.Conversations.find({name: conversationName}, (error, results) => {
      if (error) {console.log(error);}
      else if (results.length == 0) {
        console.log('No conversations with name "' + conversationName + '" found.');
      }
      else {
        let conversation = results[0];
        if (conversation.next && conversation.next.length) {
          executeTreeNode(uid, conversationName, conversation.next[0], null, user);
        }
        else {
          console.log('No nodes found in next, assuming end of tree.');
        }
      }
    });
  }

  /*
    Takes the event supplied from facebook, if the user is in the middle of
    a conversation it calls the revelant functions and returns true, else it
    returns false indicating it hasn't handeled the event. */
  function consumeWebhookEvent(event, uid, user) {
    if (!user || !user.conversationLocation) {
      return false;
    }
    let userMessageType = user.conversationLocation.nodeType;

    if (userMessageType == 'text') {
      if (!event.message || !event.message.text) {
        sendUserErrorMessage(event, uid, user);
        return true;
      }
      else {
        executeTreeNodefromId(uid,
          user.conversationLocation.conversationName,
          user.conversationLocation.nodeId + '.1',
          event.message.text, user);
        return true;
      }
    }
    else if (userMessageType == 'quickReplies') {
      if (!event.message || !event.message.quick_reply) {
        if (user.conversationLocation.userErrorText) {
          sendUserErrorMessage(event, uid, user);
        }
        else {
          executeErrorForNode(event, uid, user);
        }
        return true;
      }
      else {
        let payload = event.message.quick_reply.payload;
        if (payload.substring(0, 16) == "conversationName") {
          handleQuickReply(uid, payload, user);
          return true;
        }
        else {
          sendUserErrorMessage(event, uid, user);
          return true;
        }
      }
    }
  }

  /*
    Called when user replies with a type of message that's not expected;
    sends the user the saved error message from that node. */
  function sendUserErrorMessage (event, uid, user) {
    let message = user.conversationLocation.userErrorText;
    Send.textPromise(uid, message).then(() => {
      executeTreeNodefromId(uid, user.conversationLocation.conversationName,
       user.conversationLocation.nodeId, null, user);
    });
  }

  /*
    Called when user replies with a type of message that's not expected;
    executes the last of 'next's for that node. */
  function executeErrorForNode (event, uid, user) {

    let conversationName = user.conversationLocation.conversationName;
    let nodeId = user.conversationLocation.nodeId;

    let nodeIdArray = nodeId.split(".");
    M.Conversations.find({name: conversationName}, (error, results) => {
      if (error) {
        console.log('Error getting conversation: ', error);
      }
      else if (results.length == 0) {
        console.log('No conversations with name "' + conversationName + '" found.');
      }
      else {
        let conversation = results[0];
        let i = 1, node = conversation.next[0];
        while (i < nodeIdArray.length) {
          node = node.next[nodeIdArray[i] - 1];
          i++;
        }
        executeTreeNode(uid, conversationName, node.next[node.next.length - 1], null, user);
      }
    });
  }

  /*
    Executes given node and calls itself or relevant functions
    when required */
  function executeTreeNode(uid, conversationName, node, message, user) {
    if (node.sender == 'bot') {
      clearUserConversationLocation(uid);
      if (node.nodeType == 'text') {
        if (node.text.trim().length > 0) {
          Send.textPromise(uid, replaceHotWords(node.text, user)).then(() => {
            if (node.next && node.next.length) {
              executeTreeNode(uid, conversationName, node.next[0], null, user);
            }
            else {
              console.log('No nodes found in next, assuming end of tree.');
            }
          });
        }
        else {
          if (node.next && node.next.length) {
            executeTreeNode(uid, conversationName, node.next[0], null, user);
          }
          else {
            console.log('No nodes found in next, assuming end of tree.');
          }
        }
      }
      else if (node.nodeType == 'quickReplies') {
        let quickReplies = [];
        node.quickReplies.forEach((textString, index) => {
          quickReplies.push({
            "content_type": "text",
            "title": textString,
            "payload": "conversationName~" + conversationName
              + "|nodeId~" + node.id + "." + (index + 1)
          });
        });
        let textToSend = replaceHotWords(node.text, user);
        Send.textWithQuickReplies(uid, textToSend, quickReplies).then(() => {
          saveUserConversationLocation(uid, conversationName, node);
        });
      }
      else if (node.nodeType == 'function') {
        if (functionsIndex[conversationName]
         && functionsIndex[conversationName][node.function]) {
          functionsIndex[conversationName][node.function](uid,
           conversationName, node, message, user);
        }
        else {
          console.log('Error: Function "' + node.function
            + '" for conversation "' + conversationName + '" not found')
        }
      }
      else if (node.nodeType == 'jumpToId') {
        executeTreeNodefromId(uid, conversationName, node.jumpToId, null, user);
      }
      else if (node.nodeType == 'jumpToExternalId') {
        executeTreeNodefromId(uid, node.jumpToExternalId.conversationName,
         node.jumpToExternalId.nodeId, null, user);
      }
    }
    else if (node.sender == 'user') {
      saveUserConversationLocation(uid, conversationName, node)
    }
  }

  /*
    Similar to above, but retrieves the conversation since only nodeId is provided,
    not node (the object) */
  function executeTreeNodefromId(uid, conversationName, nodeId, message, user) {
    let nodeIdArray = nodeId.split(".");
    M.Conversations.find({name: conversationName}, (error, results) => {
      if (error) {
        console.log('Error getting conversation: ', error);
      }
      else if (results.length == 0) {
        console.log('No conversations with name "' + conversationName + '" found.');
      }
      else {
        let conversation = results[0];
        let i = 1, node = conversation.next[0];
        while (i < nodeIdArray.length) {
          node = node.next[nodeIdArray[i] - 1];
          i++;
        }
        executeTreeNode(uid, conversationName, node, message, user);
      }
    });
  }

  /*
    Called from webhook.js when the user hits a quick reply button and payload
    starts with 'conversationName...'. */
  function handleQuickReply(uid, payload, user) {
    let conversationName = payload.split('|')[0].split('~')[1];
    let nodeId = payload.split('|')[1].split('~')[1];
    executeTreeNodefromId(uid, conversationName, nodeId, null, user);
  }

  /*
    Usually called when it's at a node with "sender" == "user".
    Saves the users current conversation location to his user object,
    saving conversationName, nodeId, type and userErrorText. */
  function saveUserConversationLocation(uid, conversationName, node) {
    let updateObject = {
      conversationLocation: {
        conversationName: conversationName,
        nodeId: node.id,
        nodeType: node.nodeType,
        userErrorText: (node.userErrorText) ? node.userErrorText : ''
      }
    }
    M.User.update({mid: uid.mid}, updateObject, (error, result) => {
      if (error) {
        console.log('Error saving user\'s conversationLocation: ', error);
      }
    })
  }

  /* Clears the conversationLocation from the user */
  function clearUserConversationLocation (uid) {
    let updateObject = {$unset: {conversationLocation: 1 }};
    M.User.update({mid: uid.mid}, updateObject, (error, result) => {
      if (error) {
        console.log('Error clearing user\'s conversationLocation: ', error);
      }
    })
  }

  /*
    Replaces hot words of the format #~*#fname with user's unique data
    */
  function replaceHotWords(text, user) {
    if (user) {
      text = text.replace("#~*#fname", user.firstName);
      text = text.replace("#~*#lname", user.lastName);
    }
    return text;
  }

  /* CONVERSATION FUNCTIONS */

  /*
    If user's number is unique, saves it to their user document and calls
    next[0], if users phone number is incorrect, calls next[node.next.length
     - 1], if user's phone number exists (they've used public link before
    messenger platform), calls next[1]*/
  var collectPhoneNumber = function(uid, conversationName, node, message, user) {

    let processedPhoneNumber = validatePhoneNumber(message);
    if (processedPhoneNumber == -1) {
      executeTreeNode(uid, conversationName, node.next[node.next.length - 1], null, user);
    }
    else {
      M.User.find({phoneNumber: '+44' + processedPhoneNumber}, (error, users) => {
        if (error) {
          console.log('Error getting users with phoneNumber: ', error);
        }
        else if (users.length == 0) {
          console.log('No users with phoneNumber "'
            + processedPhoneNumber + '" found, confirmed as new user');
          savePhoneNumber(uid, processedPhoneNumber, (updatedUser, error) => {
            if (error) {
              console.log(error);
            }
            else {
              executeTreeNode(uid, conversationName, node.next[0], null, updatedUser);
            }
          });
        }
        else {
          console.log('User with phoneNumber "' + processedPhoneNumber
            + '" already exists, combining users');
          combineUsers(uid, processedPhoneNumber, users[0], (updatedUser, error) => {
            if (error) {console.log(error);}
            else {
              executeTreeNode(uid, conversationName, node.next[1], null, updatedUser);
            }
          });
        }
      });
    }
  }

  //Returns phone number in format 7123456789 or -1 if unrecognnized phone number
  function validatePhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D/gm, '');
    if(phoneNumber.substring(0, 2) === "44") {
      return (phoneNumber.length == 12) ? phoneNumber.substring(2) : -1;
    } else if(phoneNumber.substring(0, 4) === "0044") {
      return (phoneNumber.length == 14) ? phoneNumber.substring(4) : -1;
    } else if(phoneNumber.substring(0, 1) === "0") {
      return (phoneNumber.length == 11) ? phoneNumber.substring(1) : -1;
    } else if(phoneNumber.length == 10) {
      return phoneNumber;
    } else {
      return -1;
    }
  }

  //Saves phone number to database
  function savePhoneNumber(uid, phoneNumber, callback) {
    let updateObj = {
      phoneNumber: '+44' + phoneNumber
    }
    M.User.findOneAndUpdate({mid: uid.mid}, {$set:updateObj}, {new: true},
     (error, updatedUser) => {
      if (error) {
        console.log('Error saving user\'s phone number: ', error);
        callback(null, error);
      } else {
        callback(updatedUser);
      }
    })
  }

  //Combines user with this mid to existing user with phoneNumber
  function combineUsers(uid, phoneNumber, existingUser, callback) {
    M.User.find({_id: uid._id}, (error, users) => {
      if (error) {
        console.log('Error getting user with _id ' + uid._id + ':', error);
        callback(error);
      } else if (users.length == 0) {
        console.log('No users found with _id ' + uid._id + '.');
        callback({message:'No users found with _id ' + uid._id + '.'});
      } else {
        let updateObj = {
          mid: users[0].mid,
          firstName: users[0].firstName,
          lastName: users[0].lastName,
          profilePic: users[0].profilePic,
          locale: users[0].locale,
          gender: users[0].gender,
          messengerSignedUpDate: new Date(),
          conversationLocation: users[0].conversationLocation
        }
        M.User.findOneAndUpdate({phoneNumber: '+44' + phoneNumber}, {$set:updateObj},
         {new: true},
         (error, updatedUser) => {
          if (error) {
            console.log('Error saving user\'s phone number: ', error);
            callback(null, error);
          } else {
            M.User.remove({_id: uid._id}, (error, result) => {
              if (error) {
                console.log('Error deleting user\'s old profile: ', error);
                callback(null, error);
              } else {
                M.Analytics.update({name:"NewUsers"}, {$pull: {activity:
                 {uid:uid._id}}}, (err) => {
                  if (err) {
                    console.log('Error removing analytics from "NewUsers":', err);
                  }
                });
                callback(updatedUser);
              }
            });
          }
        });
      }
    });
  }

  function collectEmail(uid, conversationName, node, message, user){
    let email= validateEmail(message);

    //Invalid email so calling last item in next
    if (email == -1) {
      executeTreeNode(uid, conversationName, node.next[node.next.length - 1], null, user);
    }

    //valid email so adding the user to the database
    else {

      M.User.find({email: email}, (error, users) => {
        if (error) {console.log(error);}

        // NEW USER
        // so adding his email to his record
        else if (users.length == 0) {
          console.log('No users with email "' + email + '" found, confirmed as new user');
          M.User.findOneAndUpdate({mid: uid.mid}, {email:email}, {new: true},
           (e, updatedUser) => {
            if (e) {
              console.log(e);
            } else {
              executeTreeNode(uid, conversationName, node.next[0], null, updatedUser);
            }
          })
        }

        // EXISTING USER
        // Need to show him the game from the public link
      })

    }
  }

  //Returns email if valid or -1 if unrecognnized email
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)){
      return email;
    }
    else {
      return -1;
    }
  }


  /* Calls send.allEvents */
  var showEvents = function(uid, conversationName, node, message, user) {
    Send.allEvents(uid);
  }

  /* Send receipt for the user's last event */
  var showLastReceipt = function(uid, conversationName, node, message, user) {
    let lastEvent = user.events[user.events.length - 1];
    M.Event.findOne({_id: lastEvent.eid}, (error, event) => {
      if (error) {
        console.log('Error getting events for showLastReceipt: ', error);
      } else if (event == undefined || event == null) {
        console.log('No event with _id "' + uid._id + '" found.');
      } else {
        Send.booked(uid, user.firstName + ' ' + user.lastName, event.price,
         event.name, event.strapline, event.image_url, lastEvent.bookingReference,
         Math.round(lastEvent.joinDate.getTime()/1000), (error) => {
          if (error) {
            console.log('Error sending receipt to user:', error);
          } else {
            executeTreeNode(uid, conversationName, node.next[node.next.length - 1],
             null, user);
          }
        });
      }
    });
  }


  let functionsIndex = {
    onboardingSimple: {
      showEvents: showEvents,
      showLastReceipt: showLastReceipt
    },
    onboardingEmail: {
      collectEmail: collectEmail,
      showEvents: showEvents
    },
    onboardingPhoneNumber: {
      collectPhoneNumber: collectPhoneNumber,
      showEvents: showEvents,
      showLastReceipt: showLastReceipt
    }
  }

  return {
    startConversation: startConversation,
    handleQuickReply: handleQuickReply,
    executeTreeNodefromId: executeTreeNodefromId,
    consumeWebhookEvent: consumeWebhookEvent
  }

}
