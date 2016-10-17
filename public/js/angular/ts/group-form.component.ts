import { Component, Input } from '@angular/core';

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
    console.log("OI OI");
    this.submitted = true;
    this.dataDismiss = "modal";
  }

}
