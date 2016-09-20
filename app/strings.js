'use strict'

module.exports = function(code){

  const h = "#~*#";
  let s;

  if (code === 'kickabout') {
    s = {
      company: {
        name: "Kickabout",
        website: "www.kickabout.football",
        address: "Kickabout, Gordon House, 29 Gordon Square, London, WC1H 0PP",
        botURL: "http://m.me/kickaboutapp",
        code: 'kickabout'
      },
    	sms: {
    		paidEventConfirmation: "You just booked onto " + h + "name with Kickabout!\n\n"
    		  + h + "strapline\n\n"
    		  + "Directions: " + h + "mapsUrl \n\n"
    		 	+ "For more info and for more games come talk to us on "
    		  + "Facebook Messenger: " + h + "messengerUrl",
    		freeEventConfirmation: "You just booked onto " + h + "name with Kickabout!\n\n"
    		  + h + "strapline\n\n"
    		  + "Directions: " + h + "mapsUrl \n\n"
    		 	+ "For more info and for more games come talk to us on "
    		  + "Facebook Messenger: " + h + "messengerUrl"
    	},
      bot: {
    		allEventsDefault: "Here are some upcoming games to join. ",
        allEventsAfterCancel: "Looking for other games? Here are a few upcoming ones:",
        start: {
        	text: "Hey there! We at Kickabout are all about playing football. Sound Good?",
        	quickReply: "Yep"
        },
        menu: {
        	text: "Hi there, what do you want to do?",
        	showEventsText: "Show Games",
        	myEventsText: "My Games",
        	notificationsText: "Notifications",
        	notifications: {
        		text: "Do you want to receive weekly games updates?",
        		notificationsOnText: "Yes",
        		notificationsOffText: "No",
        		onConfirmationText: "You will receive weekly notifications",
        		offConfirmationText: "You won't receive weekly notifications",
        	}
        },
        booking: {
        	freeEventBookedConfirmation: "Thanks for booking. Do you want to"
        	  + " continue looking?",
        	quickReply: "Yes"
        },
        eventCard: {
        	buttonDirections: "Directions",
        	buttonShareCardMoreInfo: "More Info",
        	buttonMoreInfo: "More Info",
        	buttonCancelBooking: "Cancel Booking",
        	buttonBook: "Get Ticket",
        	buttonKeepLooking: "Keep Looking",
        	buttonShare: "Share"
        },
        shareInstruction: "If you're on your phone, forward the following"
          + " message to a friend or group!",
        bookingCancelled: "Your booking has been cancelled",
        publicLinkEvent: "Here is your game: ",
        publicLinkEventFinished: "That game has finished",
        myEventsHaventJoined: "You haven't joined any games.",
        yourEvents: "Here are the games you've joined: "
    	},
      payment: {
    		eventNotFound: "The game you are looking for does not exist.",
    		alreadyAttending: "You are already attending this game.",
    		bookingSuccessFreeSms: "Booking successful! We\'ve sent you a confirmation text"
          + " to " + h + "phoneNumber.",
        bookingSuccessFreeMessenger: "Booking successful! You should get a"
          + " confirmation in your Facebook Messenger shortly.",
        bookingSuccessPaidSms: "Your payment has gone through. We've sent you a"
          + " receipt to" + h + "phoneNumber.",
        bookingSuccessPaidMessenger: "Your payment has gone through. You should get a"
          + " receipt in your Facebook Messenger shortly.",
        paymentError: "Your payment did not go through, please try again."
    	}
    }
  }

  else if (code === 'uwe'){
    s = {
      company: {
        name: "UWE",
        website: "www.kickabout.football",
        address: "Kickabout, Gordon House, 29 Gordon Square, London, WC1H 0PP",
        botURL: "http://m.me/kickaboutapp",
        code: 'uwe'
      },
      sms: {
        paidEventConfirmation: "You just booked onto " + h + "name with Kickabout!\n\n"
          + h + "strapline\n\n"
          + "Directions: " + h + "mapsUrl \n\n"
          + "For more info and for more games come talk to us on "
          + "Facebook Messenger: " + h + "messengerUrl",
        freeEventConfirmation: "You just booked onto " + h + "name with Kickabout!\n\n"
          + h + "strapline\n\n"
          + "Directions: " + h + "mapsUrl \n\n"
          + "For more info and for more games come talk to us on "
          + "Facebook Messenger: " + h + "messengerUrl"
      },
      bot: {
        allEventsDefault: "Here are some upcoming games to join. ",
        allEventsAfterCancel: "Looking for other games? Here are a few upcoming ones:",
        start: {
          text: "Hey there! We at UWE are all about playing football. Sound Good?",
          quickReply: "Yep"
        },
        menu: {
          text: "Hi there, what do you want to do?",
          showEventsText: "Show Games",
          myEventsText: "My Games",
          notificationsText: "Notifications",
          notifications: {
            text: "Do you want to receive weekly games updates?",
            notificationsOnText: "Yes",
            notificationsOffText: "No",
            onConfirmationText: "You will receive weekly notifications",
            offConfirmationText: "You won't receive weekly notifications",
          }
        },
        booking: {
          freeEventBookedConfirmation: "Thanks for booking. Do you want to"
            + " continue looking?",
          quickReply: "Yes"
        },
        eventCard: {
          buttonDirections: "Directions",
          buttonShareCardMoreInfo: "More Info",
          buttonMoreInfo: "More Info",
          buttonCancelBooking: "Cancel Booking",
          buttonBook: "Get Ticket",
          buttonKeepLooking: "Keep Looking",
          buttonShare: "Share"
        },
        shareInstruction: "If you're on your phone, forward the following"
          + " message to a friend or group!",
        bookingCancelled: "Your booking has been cancelled",
        publicLinkEvent: "Here is your game: ",
        publicLinkEventFinished: "That game has finished",
        myEventsHaventJoined: "You haven't joined any games.",
        yourEvents: "Here are the games you've joined: "
      },
      payment: {
        eventNotFound: "The game you are looking for does not exist.",
        alreadyAttending: "You are already attending this game.",
        bookingSuccessFreeSms: "Booking successful! We\'ve sent you a confirmation text"
          + " to " + h + "phoneNumber.",
        bookingSuccessFreeMessenger: "Booking successful! You should get a"
          + " confirmation in your Facebook Messenger shortly.",
        bookingSuccessPaidSms: "Your payment has gone through. We've sent you a"
          + " receipt to" + h + "phoneNumber.",
        bookingSuccessPaidMessenger: "Your payment has gone through. You should get a"
          + " receipt in your Facebook Messenger shortly.",
        paymentError: "Your payment did not go through, please try again."
      }
    }
  }

  else if (code === 'ucl'){
    s = {
      company: {
        name: "UCL",
        website: "www.kickabout.football",
        address: "Kickabout, Gordon House, 29 Gordon Square, London, WC1H 0PP",
        botURL: "http://m.me/kickaboutapp",
        code: 'ucl'
      },
      sms: {
        paidEventConfirmation: "You just booked onto " + h + "name with Kickabout!\n\n"
          + h + "strapline\n\n"
          + "Directions: " + h + "mapsUrl \n\n"
          + "For more info and for more games come talk to us on "
          + "Facebook Messenger: " + h + "messengerUrl",
        freeEventConfirmation: "You just booked onto " + h + "name with Kickabout!\n\n"
          + h + "strapline\n\n"
          + "Directions: " + h + "mapsUrl \n\n"
          + "For more info and for more games come talk to us on "
          + "Facebook Messenger: " + h + "messengerUrl"
      },
      bot: {
        allEventsDefault: "Here are some upcoming games to join. ",
        allEventsAfterCancel: "Looking for other games? Here are a few upcoming ones:",
        start: {
          text: "Hey there! We at UCL Football are all about playing football. Sound Good?",
          quickReply: "Yep"
        },
        menu: {
          text: "Hi there, what do you want to do?",
          showEventsText: "Show Games",
          myEventsText: "My Games",
          notificationsText: "Notifications",
          notifications: {
            text: "Do you want to receive weekly games updates?",
            notificationsOnText: "Yes",
            notificationsOffText: "No",
            onConfirmationText: "You will receive weekly notifications",
            offConfirmationText: "You won't receive weekly notifications",
          }
        },
        booking: {
          freeEventBookedConfirmation: "Thanks for booking. Do you want to"
            + " continue looking?",
          quickReply: "Yes"
        },
        eventCard: {
          buttonDirections: "Directions",
          buttonShareCardMoreInfo: "More Info",
          buttonMoreInfo: "More Info",
          buttonCancelBooking: "Cancel Booking",
          buttonBook: "Get Ticket",
          buttonKeepLooking: "Keep Looking",
          buttonShare: "Share"
        },
        shareInstruction: "If you're on your phone, forward the following"
          + " message to a friend or group!",
        bookingCancelled: "Your booking has been cancelled",
        publicLinkEvent: "Here is your game: ",
        publicLinkEventFinished: "That game has finished",
        myEventsHaventJoined: "You haven't joined any games.",
        yourEvents: "Here are the games you've joined: "
      },
      payment: {
        eventNotFound: "The game you are looking for does not exist.",
        alreadyAttending: "You are already attending this game.",
        bookingSuccessFreeSms: "Booking successful! We\'ve sent you a confirmation text"
          + " to " + h + "phoneNumber.",
        bookingSuccessFreeMessenger: "Booking successful! You should get a"
          + " confirmation in your Facebook Messenger shortly.",
        bookingSuccessPaidSms: "Your payment has gone through. We've sent you a"
          + " receipt to" + h + "phoneNumber.",
        bookingSuccessPaidMessenger: "Your payment has gone through. You should get a"
          + " receipt in your Facebook Messenger shortly.",
        paymentError: "Your payment did not go through, please try again."
      }
    }
  }

  else {
    s = {
      company: {
        name: "Ani",
        website: "www.kickabout.football",
        address: "Kickabout, Gordon House, 29 Gordon Square, London, WC1H 0PP",
        botURL: "http://m.me/kickaboutapp",
        code: 'ani'
      },
    	sms: {
    		paidEventConfirmation: "You just booked onto " + h + "name with Kickabout!\n\n"
    		  + h + "strapline\n\n"
    		  + "Directions: " + h + "mapsUrl \n\n"
    		 	+ "For more info and for more games come talk to us on "
    		  + "Facebook Messenger: " + h + "messengerUrl",
    		freeEventConfirmation: "You just booked onto " + h + "name with Kickabout!\n\n"
    		  + h + "strapline\n\n"
    		  + "Directions: " + h + "mapsUrl \n\n"
    		 	+ "For more info and for more games come talk to us on "
    		  + "Facebook Messenger: " + h + "messengerUrl"
    	},
      bot: {
    		allEventsDefault: "Here are some upcoming games to join. ",
        allEventsAfterCancel: "Looking for other games? Here are a few upcoming ones:",
        start: {
        	text: "Hey there! We at Kickabout are all about playing football. Sound Good?",
        	quickReply: "Yep"
        },
        menu: {
        	text: "Hi there, what do you want to do?",
        	showEventsText: "Show Games",
        	myEventsText: "My Games",
        	notificationsText: "Notifications",
        	notifications: {
        		text: "Do you want to receive weekly games updates?",
        		notificationsOnText: "Yes",
        		notificationsOffText: "No",
        		onConfirmationText: "You will receive weekly notifications",
        		offConfirmationText: "You won't receive weekly notifications",
        	}
        },
        booking: {
        	freeEventBookedConfirmation: "Thanks for booking. Do you want to"
        	  + " continue looking?",
        	quickReply: "Yes"
        },
        eventCard: {
        	buttonDirections: "Directions",
        	buttonShareCardMoreInfo: "More Info",
        	buttonMoreInfo: "More Info",
        	buttonCancelBooking: "Cancel Booking",
        	buttonBook: "Get Ticket",
        	buttonKeepLooking: "Keep Looking",
        	buttonShare: "Share"
        },
        shareInstruction: "If you're on your phone, forward the following"
          + " message to a friend or group!",
        bookingCancelled: "Your booking has been cancelled",
        publicLinkEvent: "Here is your game: ",
        publicLinkEventFinished: "That game has finished",
        myEventsHaventJoined: "You haven't joined any games.",
        yourEvents: "Here are the games you've joined: "
    	},
      payment: {
    		eventNotFound: "The game you are looking for does not exist.",
    		alreadyAttending: "You are already attending this game.",
    		bookingSuccessFreeSms: "Booking successful! We\'ve sent you a confirmation text"
          + " to " + h + "phoneNumber.",
        bookingSuccessFreeMessenger: "Booking successful! You should get a"
          + " confirmation in your Facebook Messenger shortly.",
        bookingSuccessPaidSms: "Your payment has gone through. We've sent you a"
          + " receipt to" + h + "phoneNumber.",
        bookingSuccessPaidMessenger: "Your payment has gone through. You should get a"
          + " receipt in your Facebook Messenger shortly.",
        paymentError: "Your payment did not go through, please try again."
    	}
    }
  }

  return {s:s};
}
