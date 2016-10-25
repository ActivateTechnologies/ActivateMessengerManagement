import { Component, Input } from '@angular/core';
import { Group } from './group';


@Component({
  selector: 'my-groups',
  templateUrl: 'js/angular/message/group.component.html'
})

export class GroupComponent {
	@Input()
	groups: Group[] = [];
}