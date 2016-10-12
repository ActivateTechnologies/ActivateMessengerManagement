import { Pipe } from '@angular/core';
declare var moment: any;

@Pipe({
	name: 'filtertimer',
	pure: false
})

export class FilterTimerPipe {
	transform(arr: any[], filters: boolean[]): any[] {
		
		return arr.filter((eachItem: any) => {
			var it: any = new moment(eachItem.interactionTime);
			var rt: any = new moment(eachItem.receivedTime);
			var now: any = new moment();

			var endOfWindow: any = new moment(eachItem.interactionTime);
	        endOfWindow.add(24, 'hours');

	        if (endOfWindow.isAfter(now)){
	          	return filters[0];
			} else if (rt.isBefore(it) || eachItem.receivedTime == null) {
				return filters[1];
			} else {
				return filters[2];
			}
		});
	}
}