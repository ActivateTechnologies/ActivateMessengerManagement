import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';

declare var moment: any;

@Component({
  selector: 'my-table',
  templateUrl: 'js/angular/ts/app.component.html'
})

export class AppComponent {
	currentHead: number;
	isReversed: boolean;
	orderField: string;
	users : User[] = [];
	displayedCols : boolean[] = [];
	companyCode: string;

	constructor (private userService: UserService, private elementRef: ElementRef) {
		this.companyCode = elementRef.nativeElement.getAttribute('[companycode]');
	}

	getFormattedDate(date: string) {
		// return new moment().format('HH:mm');
		var d: string;
		d = new moment(date).format('DD/MM/YY HH:mm');
		return d;
	}

	ngOnInit() {
		this.currentHead = -1;
		this.orderField = '';
		this.getUsers();
	}

	getUsers() {
		this.userService.getUsers(this.companyCode)
							.subscribe(
								users => this.users = users);
	}

	headingClicked(head: number) {
		if(this.currentHead === head) {
          this.isReversed = !this.isReversed;
        } else {
          this.isReversed = false;
        }
		
		this.currentHead = head;

        switch(head) {
          case 0:
            this.orderField = 'firstName';
            break;
          case 1:
            this.orderField = 'gender';
            break;
          case 2:
            this.orderField = 'phoneNumber';
            break;
          case 3:
            this.orderField = 'email';
            break;
          case 4:
            this.orderField = 'preferredPosition';
            break;
          case 5:
            this.orderField = 'backupPosition';
            break;
          case 6:
            this.orderField = 'level';
            break;
          case 7:
            this.orderField = 'type';
            break;
          case 8:
            this.orderField = 'signedUpDate';
            break;
          case 9:
            this.orderField = 'interactionTime';
            break;
          case 10:
            this.orderField = '_id';
            break;
        }

	}

	isColDisplayed(head: number) {
		for(var _i = 0; _i < this.users.length; _i++) {

			switch(head) {
				case 2:
					if(this.users[_i].phoneNumber != null) {
		            	return true;
		        	}
		        	break;
		        case 3:
					if(this.users[_i].email != null) {
		            	return true;
		        	}
		        	break;
		        case 4:
					if(this.users[_i].preferredPosition != null) {
		            	return true;
		        	}
		        	break;
		        case 5:
					if(this.users[_i].backupPosition != null) {
		            	return true;
		        	}
		        	break;
		        case 6:
					if(this.users[_i].level != null) {
		            	return true;
		        	}
		        	break;
		        case 7:
					if(this.users[_i].type != null) {
		            	return true;
		        	}
		        	break;
			}
		}
		return false;
	}
}
