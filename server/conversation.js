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

/*
  Executes given node and calls itself or relevant functions 
  when required */
function executeTreeNode(uid, conversationName, node, message) {
  //console.log('executeTreeNode', uid, conversationName, node);
  if (node.sender == 'bot') {
    clearUserConversationLocation(uid);
    if (node.type == 'text') {
      if (node.quickReplies && node.quickReplies.length) {
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
          saveUserConversationLocation(uid, conversationName, node.id);
        });
      } else {
        send.text_promise(uid, node.text).then(() => {
          if (node.next && node.next.length) {
            executeTreeNode(uid, conversationName, node.next[0]);
          } else {
            console.log('No nodes found in next, assuming end of tree.');
          }
        });
      }
    } else if (node.type == 'function') {
      functionsIndex[conversationName][node.function](uid,
       conversationName, node, message);
    } else if (node.type == 'jumpToId') {
      executeTreeNodefromId(uid, conversationName, node.jumpToId);
    }
  } else if (node.sender == 'user') {
    saveUserConversationLocation(uid, conversationName, node.id)
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
  console.log('handleQuickReply(' + payload + ')');
  let conversationName = payload.split('|')[0].split('~')[1];
  let nodeId = payload.split('|')[1].split('~')[1];
  /*console.log('conversationName: ' + conversationName
   + ', nodeId: ' + nodeId + ')');*/

  executeTreeNodefromId(uid, conversationName, nodeId);
}

/*
  Saves the users current conversation to his user object, saving
  conversationName and nodeId. */
function saveUserConversationLocation(uid, conversationName, nodeId) {
  /*console.log('saveUserConversationLocation(' + uid + ', ' 
    + conversationName + ', ' + nodeId + ')');*/
  let updateObject = {
    conversationLocation: {
      conversationName: conversationName,
      nodeId: nodeId
    }
  }
  M.User.update({userId: uid.mid}, updateObject, (error, result) => {
    if (error) {
      console.log('Error saving user\'s conversationLocation: ', error);
    }
  })
}

/* Clears the conversationLocation from the user */
function clearUserConversationLocation(uid) {
  let updateObject = {$unset: {conversationLocation: 1 }};
  M.User.update({userId: uid.mid}, updateObject, (error, result) => {
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
    /*createUser(uid, (error) => {
      if (error) {
        //TODO Handle error, send user some text message
      } else {
        executeTreeNode(uid, conversationName, node.next[0]);
      }
    });*/
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
    M.User.update({userId: uid.mid}, updateObject, (error, result) => {
      if (error) {
        console.log('Error saving user\'s phone number: ', error);
        callback(error);
      } else {
        callback();
      }
    })
  }
}

/* Calls send.allGames */
var showGames = function(uid, conversationName, node, message) {
  send.allGames(uid);
}

let functionsIndex = {
  onboarding: {
    collectPhoneNumber: collectPhoneNumber,
    showGames: showGames
  }
}

module.exports = {
  startConversation: startConversation,
  handleQuickReply: handleQuickReply,
  executeTreeNodefromId: executeTreeNodefromId
}