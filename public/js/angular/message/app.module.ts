import './rxjs-extensions';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent }   from './app.component';
import { GroupComponent } from './group.component';
import { MessageComponent } from './message.component';
import { GroupService } from './group.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports:      [ BrowserModule, HttpModule, JsonpModule, FormsModule ],
  declarations: [ AppComponent, GroupComponent, MessageComponent ],
  providers:    [ GroupService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
