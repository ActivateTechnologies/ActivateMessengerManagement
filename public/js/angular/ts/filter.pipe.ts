import { Pipe } from '@angular/core';

@Pipe({
	name: 'filter',
	pure: false
})

export class FilterPipe {
	transform(arr: any[], filters: string[]): any[] {
		if(filters[0] === '' && filters[1] === '' && filters[2] === '' && filters[3] === '') {
			return arr;
		}
		return arr.filter((eachItem: any) => {
			return (eachItem['preferredPosition'] ? eachItem['preferredPosition'].toLowerCase().includes(filters[0].toLowerCase()) : false) &&
				   (eachItem['backupPosition'] ? eachItem['backupPosition'].toLowerCase().includes(filters[1].toLowerCase()) : false) &&
				   (eachItem['level'] ? (filters[2] === '' ? eachItem['level'].toLowerCase().includes(filters[2].toLowerCase()) : eachItem['level'].toLowerCase() === (filters[2].toLowerCase())) : false) &&
				   (eachItem['type'] ? eachItem['type'].toLowerCase().includes(filters[3].toLowerCase()) : false);
		});
	}
}