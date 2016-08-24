const platform = 'kickabout'; //'kickabout' or 'ticketing'

//Hot words identifier
const h = "#~*#";

const kickabout = {
  company: {
    name: "Kickabout",
    website: "www.kickabout.football",
    address: "Kickabout, Gordon House, 29 Gordon Square, London, WC1H 0PP"
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
	}, bot: {
		allEventsDefault: "Here are some upcoming games to join. "
      + "Tap the card for directions or 'More Info' to book.",
    allEventsAfterCancel: "Looking for other games? Here are a few upcoming ones:",
    start: {
    	text: "Hey there! We at Kickabout are all about playing football. Sound Good?",
    	quickReply: "Yep"
    }, menu: {
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
    }, booking: {
    	freeEventBookedConfirmation: "Thanks for booking. Do you want to"
    	  + " continue looking?",
    	quickReply: "Yes"
    }, eventCard: {
    	buttonDirections: "Directions",
    	buttonShareCardMoreInfo: "More Info",
    	buttonMoreInfo: "More Info",
    	buttonCancelBooking: "Cancel Booking",
    	buttonBook: "BOOK",
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
	}, payment: {
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

const ticketing = {
  company: {
    name: "Student Tickets",
    website: "http://www.wickedstudentnights.co.uk/",
    address: "11 The Ivories, 6-18 Northampton Street, N1 2HY"
  },
  sms: {
    paidEventConfirmation: "You just booked onto " + h + "name with Wicked Tickets!\n\n"
      + h + "strapline\n\n"
      + "Directions: " + h + "mapsUrl \n\n"
      + "For more info and for more events come talk to us on "
      + "Facebook Messenger: " + h + "messengerUrl",
    freeEventConfirmation: "You just booked onto " + h + "name with Wicked Tickets!\n\n"
      + h + "strapline\n\n"
      + "Directions: " + h + "mapsUrl \n\n"
      + "For more info and for more events come talk to us on "
      + "Facebook Messenger: " + h + "messengerUrl"
  }, bot: {
    allEventsDefault: "Here are some upcoming events to join. "
      + "Tap the card for directions or 'More Info' to book.",
    allEventsAfterCancel: "Looking for other events? Here are a few upcoming ones:",
    start: {
      text: "Hey there! We at Wicked Tickets are all about playing football. Sound Good?",
      quickReply: "Yep"
    }, menu: {
      text: "Hi there, what do you want to do?",
      showEventsText: "Show Events",
      myEventsText: "My Events",
      notificationsText: "Notifications",
      notifications: {
        text: "Do you want to receive weekly events updates?",
        notificationsOnText: "Yes",
        notificationsOffText: "No",
        onConfirmationText: "You will receive weekly notifications",
        offConfirmationText: "You won't receive weekly notifications",
      }
    }, booking: {
      freeEventBookedConfirmation: "Thanks for booking. Do you want to"
        + " continue looking?",
      quickReply: "Yes"
    }, eventCard: {
      buttonDirections: "Directions",
      buttonShareCardMoreInfo: "More Info",
      buttonMoreInfo: "More Info",
      buttonCancelBooking: "Cancel Booking",
      buttonBook: "BOOK",
      buttonKeepLooking: "Keep Looking",
      buttonShare: "Share"
    },
    shareInstruction: "If you're on your phone, forward the following"
      + " message to a friend or group!",
    bookingCancelled: "Your booking has been cancelled",
    publicLinkEvent: "Here is your event: ",
    publicLinkEventFinished: "That event has finished",
    myEventsHaventJoined: "You haven't joined any events.",
    yourEvents: "Here are the events you've joined: "
  }, payment: {
    eventNotFound: "The event you are looking for does not exist.",
    alreadyAttending: "You are already attending this event.",
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

exports.h = h;
if (platform == 'kickabout') {
	exports.s = kickabout;
} else if (platform == 'ticketing') {
	exports.s = ticketing;
}