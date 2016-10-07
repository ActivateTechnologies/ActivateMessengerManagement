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
			// return (eachItem['preferredPosition'] ? eachItem['preferredPosition'].toLowerCase().includes(filters[0].toLowerCase()) : false) &&
			// 	   (eachItem['backupPosition'] ? eachItem['backupPosition'].toLowerCase().includes(filters[1].toLowerCase()) : false) &&
			// 	   (eachItem['level'] ? (filters[2] === '' ? eachItem['level'].toLowerCase().includes(filters[2].toLowerCase()) : eachItem['level'].toLowerCase() === (filters[2].toLowerCase())) : false) &&
			// 	   (eachItem['type'] ? eachItem['type'].toLowerCase().includes(filters[3].toLowerCase()) : false) &&
			// 	   (eachItem['gender'] ? (filters[4] === '' ? eachItem['gender'].toLowerCase().includes(filters[4].toLowerCase()) : eachItem['gender'].toLowerCase() === (filters[4].toLowerCase())) : false);
		});
	}
}