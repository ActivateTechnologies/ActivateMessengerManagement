import { Pipe } from '@angular/core';

@Pipe({
	name: 'selectall',
	pure: false
})

export class SelectAllPipe {
	transform(arr: any[], checked: boolean): any[] {
		arr.forEach(function(el: any) {
			if(checked) {
				el.selected = true;
			} else {
				el.selected = false || el.selected;
			}
		});
		return arr;
	}
}