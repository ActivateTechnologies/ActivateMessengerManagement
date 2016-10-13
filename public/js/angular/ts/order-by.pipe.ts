import { Pipe } from '@angular/core';

@Pipe({name: 'orderBy'})

export class OrderByPipe {
	transform(array: any[], key: string, desc: boolean): any[] {
		array.sort((a: any, b: any) => {
			if(!!a[key] && !b[key]) {
				return -1;
			} else if (!a[key] && !!b[key]) {
				return 1;
			} else if (!a[key] && !b[key]) {
				return 0;
			}

	      	if (this.safeToLower(a[key]) < this.safeToLower(b[key])) {
	        	return -1;
	      	} else if (this.safeToLower(a[key]) > this.safeToLower(b[key])) {
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

	safeToLower(input: any): any {
		if(typeof input === 'string') {
			return input.toLowerCase();
		} else {
			return input;
		}
	}
}
