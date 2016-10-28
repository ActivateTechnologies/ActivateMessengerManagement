import { Component, Input, OnInit } from '@angular/core';
import { Group } from './group';

declare var $: any;

@Component({
  selector: 'my-message',
  templateUrl: 'js/angular/message/message.component.html'
})

export class MessageComponent {
	@Input()
	groups: Group[];
	@Input()
	companyCode: string;
	messageText: string = '';
	ids: string = '';
	subtitle: string = '';
	events: any[] = [];
	eid: string;

	ngOnInit() {
		var that = this;
		$.get('/currentEvents.' + this.companyCode, function(data) {
			that.events = data;
			console.log(that.events);
		});
	}

	onChange(i: number) {
		if(i == 0) {
			this.ids = '';
		} else {
			var id: string = this.groups[i - 1]._id;
			this.ids = id;
		}
	}

	onChangeEvent(i: number) {
		if(i == 0) {
			this.eid = '';
		} else {
			var id: string = this.events[i - 1]._id;
			this.eid = id;
		}
	}

	onSubmit(type: string) {
		console.log(this.ids);
		$.post('/message.' + this.companyCode +'?message=' + this.messageText + '&ids=' + this.ids + '&formType=' + type + '&subtitle' + this.subtitle + '&eid=' + this.eid, function(data) {
	      
	    })
	}

}