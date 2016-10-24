import { Component, Input } from '@angular/core';
import { Group } from './group';


@Component({
  selector: 'my-message',
  templateUrl: 'js/angular/message/message.component.html'
})

export class MessageComponent {
	@Input()
	groups: Group[];

}