import { Pipe } from '@angular/core';
declare var moment: any;

@Pipe({
	name: 'filterdate',
	pure: false
})

export class FilterDatePipe {
	transform(arr: any[], date: string): any[] {
		if(date === '') {
			return arr;
		}
		var dates: string[] = date.split(" - ");
		
		console.log("ALRIGHT LADS!!");
		return arr.filter((eachItem: any) => {
			var start = moment(dates[0], "DD/MM/YYYY");
			var end = moment(dates[1], "DD/MM/YYYY");
			var userDate = moment(eachItem.signedUpDate).startOf('day');
			if((userDate.isAfter(start) || userDate.isSame(start)) && (userDate.isBefore(end) || userDate.isSame(end))) {
				return true;
			} else {
				return false;
			}
		});
	}
}