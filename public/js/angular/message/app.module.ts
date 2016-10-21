import './rxjs-extensions';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent }   from './app.component';
import { GroupService } from './group.service'


@NgModule({
  imports:      [ BrowserModule, HttpModule, JsonpModule ],
  declarations: [ AppComponent ],
  providers:    [ GroupService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
