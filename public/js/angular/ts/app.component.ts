import { Component, OnInit } from '@angular/core';
import { OrderByPipe } from './order-by.pipe.ts'

@Component({
  selector: 'my-table',
  templateUrl: './app.component.html',
  pipes: [ 'OrderByPipe' ]
})

export class AppComponent {
	currentHead: number;
	isReversed: boolean;
	orderField: string;

	constructor (private userService: UserService) {}

	ngOnInit() {
		this.currentHead = -1;
		this.orderField = '';
		this.getUsers();
	}

	getUsers() {
		this.userService.getUsers()
							.subscribe(
								users => this.users = users,
                       			error =>  this.errorMessage = <any>error);
	}

	headingClicked(head: number) {
		if(currentHead === head) {
          isReversed = !isReversed;
        } else {
          isReversed = false;
        }
		
		currentHead = head;

        switch(head) {
          case 0:
            orderField = ['firstName','lastName'];
            break;
          case 1:
            orderField = 'gender';
            break;
          case 2:
            orderField = 'phoneNumber';
            break;
          case 3:
            orderField = 'email';
            break;
          case 4:
            orderField = 'preferredPosition';
            break;
          case 5:
            orderField = 'backupPosition';
            break;
          case 6:
            orderField = 'level';
            break;
          case 7:
            orderField = 'type';
            break;
          case 8:
            orderField = 'signedUpDate';
            break;
          case 9:
            orderField = 'interactionTime';
            break;
          case 10:
            orderField = '_id';
            break;
        }

	}

}
