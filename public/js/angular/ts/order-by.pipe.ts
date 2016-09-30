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
	        	return 0;
	      	}
	    });
    	return array;
	}
}
