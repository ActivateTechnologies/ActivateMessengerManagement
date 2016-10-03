import { Pipe } from '@angular/core';

@Pipe({name: 'phoneNumber'})

export class PhoneNumberPipe {
	transform(input: string): string {
		return (!!input) ? '+44' + input : '-';
	}
}
