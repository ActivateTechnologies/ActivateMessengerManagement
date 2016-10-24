import { Component, ElementRef, OnInit } from '@angular/core';
import { GroupService } from './group.service';
import { Group } from './group';

@Component({
  selector: 'message-app',
  templateUrl: 'js/angular/message/app.component.html'
})

export class AppComponent {
	companyCode: string;
	groups: Group[] = [];

	constructor (private elementRef: ElementRef, private groupService: GroupService) {
		this.companyCode = elementRef.nativeElement.getAttribute('[companyCode]');
	}

	ngOnInit() {
		this.getGroups();
	}

	getGroups() {
		this.groupService.getGroups(this.companyCode)
						.subscribe(
							groups => this.groups = groups);
	}
}