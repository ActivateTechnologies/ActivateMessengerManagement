import { Pipe } from '@angular/core';

@Pipe({
	name: 'selectall',
	pure: false
})

export class SelectAllPipe {
	transform(arr: any[], checked: boolean): any[] {
		arr.forEach(function(el: any) {
			el.selected = checked;
		});
		return arr;
	}
}