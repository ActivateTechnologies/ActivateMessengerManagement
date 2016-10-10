import './rxjs-extensions';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { OrderByPipe } from './order-by.pipe';
import { CapitaliseFirstPipe } from './capitalise-first.pipe';
import { PhoneNumberPipe } from './phone-number.pipe'
import { FilterPipe } from './filter.pipe';
import { FilterDatePipe } from './filterDate.pipe'
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports:      [ BrowserModule, HttpModule, JsonpModule, FormsModule ],
  declarations: [ AppComponent, OrderByPipe, CapitaliseFirstPipe, PhoneNumberPipe, FilterPipe, FilterDatePipe ],
  providers:    [ UserService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
