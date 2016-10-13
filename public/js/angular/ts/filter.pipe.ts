import { Pipe } from '@angular/core';

@Pipe({
	name: 'filter',
	pure: false
})

export class FilterPipe {
	transform(arr: any[], fields:string[], filters: string[]): any[] {
		if(filters[0] === '' && filters[1] === '' && filters[2] === '' && filters[3] === '' && filters[4] === '') {
			return arr;
		}
		return arr.filter((eachItem: any) => {
			var returnUser = true;
			for(var i = 0; i < filters.length; i++) {
				if(filters[i] !== '') {
					if (eachItem[fields[i]]) {
						returnUser = returnUser && (eachItem[fields[i]].toLowerCase() === filters[i].toLowerCase());
					} else {
						return false;
					}
				}
			}
			return returnUser;
		});
	}
}