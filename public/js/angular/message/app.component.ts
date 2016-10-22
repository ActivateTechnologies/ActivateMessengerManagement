import { Component, OnInit, ElementRef } from '@angular/core';
import { Group } from './group';
import { GroupService } from './group.service';

@Component({
  selector: 'my-groups',
  templateUrl: 'js/angular/message/app.component.html'
})

export class AppComponent {
	groups: Group[];
	companyCode: string;

	constructor (private groupService: GroupService, private elementRef: ElementRef) {
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