const platform = 'kickabout'; //'kickabout' or 'ticketing'

//Hot words identifier
const h = "#~*#";
const kickabout = {
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
    /*freeEventConfirmation: "Thank you for booking with kickabout!"
      + "Here're your game details:\n"
      + h + "name\n"
      + h + "strapline\n"
      + h + "when\n"
      + "To view more details and see other events, "
      + "come talk to us on Messenger:" + "\n"
      + h + "messengerUrl"*/
	}
}

exports.h = h;
if (platform == 'kickabout') {
	exports.s = kickabout;
} else if (platform == 'ticketing') {
	exports.s = ticketing;
}