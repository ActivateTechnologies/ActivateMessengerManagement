'use strict'

const request = require('request')
const M = require('./schemas.js')
const config = require('./../config')
const send = require('./send.js');

/*
  Retrieves specified conversation from database and starts executing by
  calling executeTreeNode() with the first node */
function startConversation(uid, conversationName) {
  M.Conversations.find({name: conversationName}, (error, results) => {
    if (error) {
      console.log('Error getting conversation: ', error);
    } else if (results.length == 0) {
      console.log('No conversations with name "' + conversationName + '" found.');
    } else {
      let conversation = results[0];
      if (conversation.next && conversation.next.length) {
        executeTreeNode(uid, conversationName, conversation.next[0]);
      } else {
        console.log('No nodes found in next, assuming end of tree.');
      }
    }
  });
}

function consumeWebhookEvent(event, uid, user) {
  //return false;
  //console.log(uid, user, event);
  if (!user || !user.conversationLocation) {
    return false;
  }
  let userMessageType = user.conversationLocation.nodeType;

  if (userMessageType == 'text') {
    if (!event.message || !event.message.text) {
      sendUserErrorMessage(event, uid, user);
      return true;
    } else {
      executeTreeNodefromId(uid,
        user.conversationLocation.conversationName,
        user.conversationLocation.nodeId + '.1',
        event.message.text);
      return true;
    }
  } else if (userMessageType == 'quickReplies') {
    if (!event.message || !event.message.quick_reply) {
      if (user.conversationLocation.userErrorText) {
        sendUserErrorMessage(event, uid, user);
      } else {
        executeErrorForNode(event, uid, user);
      }
      return true;
    } else {
      let payload = event.message.quick_reply.payload;
      if (payload.substring(0, 16) == "conversationName") {
        handleQuickReply(uid, payload);
        return true;
      } else {
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
  //console.log('sendUserErrorMessage', event, uid, user);
  let message = user.conversationLocation.userErrorText;
  send.textPromise(uid, message).then(() => {
    executeTreeNodefromId(uid, user.conversationLocation.conversationName,
     user.conversationLocation.nodeId);
  });
}

/*
  Called when user replies with a type of message that's not expected;
  executes the last of 'next's for that node. */
function executeErrorForNode (event, uid, user) {
  //console.log('executeErrorForNode', event, uid, user);
  executeTreeNodefromId(uid, user.conversationLocation.conversationName,
   user.conversationLocation.nodeId);

  let conversationName = user.conversationLocation.conversationName;
  let nodeId = user.conversationLocation.nodeId;

  let nodeIdArray = nodeId.split(".");
  M.Conversations.find({name: conversationName}, (error, results) => {
    if (error) {
      consol.log('Error getting conversation: ', error);
    } else if (results.length == 0) {
      console.log('No conversations with name "' + conversationName + '" found.');
    } else {
      let conversation = results[0];
      let i = 1, node = conversation.next[0];
      while (i < nodeIdArray.length) {
        //console.log('Going to id next[' + (nodeIdArray[i] - 1) + ']');
        node = node.next[nodeIdArray[i] - 1];
        i++;
      }
      executeTreeNode(uid, conversationName, node.next[node.next.length - 1]);
    }
  });
}

/*
  Executes given node and calls itself or relevant functions 
  when required */
function executeTreeNode(uid, conversationName, node, message) {
  //console.log('executeTreeNode', uid, conversationName, node);
  if (node.sender == 'bot') {
    clearUserConversationLocation(uid);
    if (node.nodeType == 'text') {
      if (node.text.trim().length > 0) {
        send.textPromise(uid, node.text).then(() => {
          if (node.next && node.next.length) {
            executeTreeNode(uid, conversationName, node.next[0]);
          } else {
            console.log('No nodes found in next, assuming end of tree.');
          }
        });
      } else {
        if (node.next && node.next.length) {
          executeTreeNode(uid, conversationName, node.next[0]);
        } else {
          console.log('No nodes found in next, assuming end of tree.');
        }
      }
    } else if (node.nodeType == 'quickReplies') {
      let quickReplies = [];
      node.quickReplies.forEach((textString, index) => {
        quickReplies.push({
          "content_type": "text",
          "title": textString,
          "payload": "conversationName~" + conversationName
            + "|nodeId~" + node.id + "." + (index + 1)
        });
      });
      send.textWithQuickReplies(uid, node.text, quickReplies).then(() => {
        saveUserConversationLocation(uid, conversationName, node);
      });
    } else if (node.nodeType == 'function') {
      if (functionsIndex[conversationName]
       && functionsIndex[conversationName][node.function]) {
        functionsIndex[conversationName][node.function](uid,
         conversationName, node, message);
      } else {
        console.log('Error: Function "' + node.function 
          + '" for conversation "' + conversationName + '" not found')
      }
    } else if (node.nodeType == 'jumpToId') {
      executeTreeNodefromId(uid, conversationName, node.jumpToId);
    } else if (node.nodeType == 'jumpToExternalId') {
      executeTreeNodefromId(uid, node.jumpToExternalId.conversationName,
       node.jumpToExternalId.nodeId);
    }
  } else if (node.sender == 'user') {
    saveUserConversationLocation(uid, conversationName, node)
  }
}

/*
  Similar to above, but retrieves the conversation since only nodeId is provided,
  not node (the object) */
function executeTreeNodefromId(uid, conversationName, nodeId, message) {
  let nodeIdArray = nodeId.split(".");
  M.Conversations.find({name: conversationName}, (error, results) => {
    if (error) {
      consol.log('Error getting conversation: ', error);
    } else if (results.length == 0) {
      console.log('No conversations with name "' + conversationName + '" found.');
    } else {
      let conversation = results[0];
      let i = 1, node = conversation.next[0];
      while (i < nodeIdArray.length) {
        //console.log('Going to id next[' + (nodeIdArray[i] - 1) + ']');
        node = node.next[nodeIdArray[i] - 1];
        i++;
      }
      executeTreeNode(uid, conversationName, node, message);
    }
  });
}

/*
  Called from webhook.js when the user hits a quick reply button and payload 
  starts with 'conversationName...'. */
function handleQuickReply(uid, payload) {
  /*console.log('handleQuickReply(' + payload + ')');*/
  let conversationName = payload.split('|')[0].split('~')[1];
  let nodeId = payload.split('|')[1].split('~')[1];
  /*console.log('conversationName: ' + conversationName
   + ', nodeId: ' + nodeId + ')');*/
  executeTreeNodefromId(uid, conversationName, nodeId);
}

/*
  Usually called when it's at a node with "sender" == "user".
  Saves the users current conversation location to his user object,
  saving conversationName, nodeId, type and userErrorText. */
function saveUserConversationLocation(uid, conversationName, node) {
  /*console.log('saveUserConversationLocation(' + uid._id + ', ' 
    + conversationName + ', ' + node.id + ', ' + node.nodeType
    + ', ' + node.userErrorText + ')');*/
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

/* CONVERSATION FUNCTIONS */

/*
  If user's phone number is correct, saves it to his user document and
  calls next[0], else calls next[1]*/
var collectPhoneNumber = function(uid, conversationName, node, message) {
  
  let processedPhoneNumber = validatePhoneNumber(message);
  if (processedPhoneNumber == -1) {
    executeTreeNode(uid, conversationName, node.next[1]);
  } else {
    savePhoneNumber(uid, processedPhoneNumber, (error) => {
      if (error) {
        //TODO Handle error, send user some text message
      } else {
        executeTreeNode(uid, conversationName, node.next[0]);
      }
    });
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
    let updateObject = {
      phoneNumber: '+44' + phoneNumber
    }
    M.User.update({mid: uid.mid}, updateObject, (error, result) => {
      if (error) {
        console.log('Error saving user\'s phone number: ', error);
        callback(error);
      } else {
        callback();
      }
    })
  }
}

/* Calls send.allEvents */
var showEvents = function(uid, conversationName, node, message) {
  send.allEvents(uid);
}

let functionsIndex = {
  onboarding: {
    collectPhoneNumber: collectPhoneNumber,
    showEvents: showEvents
  },
  collectPhoneNumber: {
    collectPhoneNumber: collectPhoneNumber,
    showEvents: showEvents
  },
  onboardingSkip: {
    collectPhoneNumber: collectPhoneNumber,
    showEvents: showEvents
  },
  collectPhoneNumberSkip: {
    collectPhoneNumber: collectPhoneNumber,
    showEvents: showEvents
  }
}

module.exports = {
  startConversation: startConversation,
  handleQuickReply: handleQuickReply,
  executeTreeNodefromId: executeTreeNodefromId,
  consumeWebhookEvent: consumeWebhookEvent
}