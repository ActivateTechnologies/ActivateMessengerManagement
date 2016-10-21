import { Component, Input } from '@angular/core';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'group-form',
  templateUrl: 'group-form.component.html'
})

export class GroupFormComponent {
  @Input() 
  groupitems : any[];
  @Input()
  companyCode: string;
  groupName: string = "";
  dataDismiss: string = "";
  submitted = false;

  onSubmit() { 
    var list : string[] = _.pluck(this.groupitems, "_id");
    var group : any = {
      "name": this.groupName,
      "list": list.toString()
    };
    $.post('/addGroup.' + this.companyCode +'?name=' + group.name + '&list=' + group.list, function(data) {
      console.log(data);
      if(data.status === "success") {
        console.log("Group added");
      } else {
        console.log("Error: group not added");
      }
    })

    this.submitted = true;
    $('#myModal').modal('hide');
  }

}
