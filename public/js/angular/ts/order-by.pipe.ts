import { Pipe } from '@angular/core';

@Pipe({name: 'exponentialStrength'})

export class OrderByPipe {
	transform(array: any[], key: string, desc: boolean): any[] {
		array.sort((a: any, b: any) => {
	      	if (a[key] < b[key]) {
	        	return -1;
	      	} else if (a[key] > b[key]) {
	        	return 1;
	      	} else {
	      		if(key === 'firstName') {
	      			if (a['lastName'] < b['lastName']) {
			        	return -1;
			      	} else if (a['lastName'] > b['lastName']) {
			        	return 1;
			      	}
			    }
	        	return 0;
	      	}
	    });

	    if(desc) {
	    	return array.reverse();
	    }
    	return array;
	}
}
