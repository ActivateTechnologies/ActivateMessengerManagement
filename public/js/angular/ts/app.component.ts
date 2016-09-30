import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';

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

	ngOnInit() {
		this.currentHead = -1;
		this.orderField = '';
		this.getUsers();
		this.populateDisplayedCols();
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

	populateDisplayedCols() {
		console.log("In Populate Displayed Cols");
		for(var _i = 0; _i < 10; _i++) {
			this.displayedCols[_i] = false;
		}

		console.log(this.users.length);

		for(let user of this.users) {
			//console.log(user.firstName);
			if(user.phoneNumber != null) {
            	this.displayedCols[2] = true;
        	}

        	if(user.email != null) {
            	this.displayedCols[3] = true;
        	}

        	if(user.preferredPosition != null) {
        		this.displayedCols[4];
        	}

        	if(user.backupPosition != null) {
        		this.displayedCols[5];
        	}

        	if(user.level != null) {
        		this.displayedCols[6];
        	}

        	if(user.type != null) {
        		this.displayedCols[7];
        	}
		}
	}

	// $scope.isDisplayed = function(head) {
    //     for(i = 0; i < $scope.users.length; i++) {
    //       switch(head) {
    //         case 2:
    //           if($scope.users[i].phoneNumber != null) {
    //             return true;
    //           }
    //           break;
    //         case 3:
    //           if($scope.users[i].email != null) {
    //             return true;
    //           }
    //           break;
    //         case 4:
    //           if($scope.users[i].preferredPosition != null) {
    //             return true;
    //           }
    //           break;
    //         case 5:
    //           if($scope.users[i].backupPosition != null) {
    //             return true;
    //           }
    //           break;
    //         case 6:
    //           if($scope.users[i].level != null) {
    //             return true;
    //           }
    //           break;
    //         case 7:
    //           if($scope.users[i].type != null) {
    //             return true;
    //           }
    //           break;
    //       }
    //     }
    //     return false;
    //   }
    // }

}
