import { Pipe } from '@angular/core';

@Pipe({name: 'capitaliseFirst'})

export class CapitaliseFirstPipe {
	transform(str: string): string {
		return (!!str) ? str.charAt(0).toUpperCase() + str.substr(1).toLowerCase() : '-';
	}
}
