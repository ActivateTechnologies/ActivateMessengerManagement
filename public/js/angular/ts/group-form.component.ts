import { Component, Input } from '@angular/core';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'group-form',
  templateUrl: 'group-form.component.html'
})

export class GroupFormComponent {
  @Input() 
  groupitems : any[];
  groupName: string = "";
  dataDismiss: string = "";
  submitted = false;

  onSubmit() { 
    
    this.submitted = true;
    $('#myModal').modal('hide');
  }

}
