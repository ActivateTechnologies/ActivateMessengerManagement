import './rxjs-extensions';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import { GroupFormComponent } from './group-form.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { OrderByPipe } from './order-by.pipe';
import { CapitaliseFirstPipe } from './capitalise-first.pipe';
import { PhoneNumberPipe } from './phone-number.pipe'
import { FilterPipe } from './filter.pipe';
import { FilterDatePipe } from './filterDate.pipe';
import { FilterTimerPipe } from './filter-timer.pipe';
import { SelectAllPipe } from './select-all.pipe';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports:      [ BrowserModule, HttpModule, JsonpModule, FormsModule ],
  declarations: [ AppComponent, GroupFormComponent, OrderByPipe, CapitaliseFirstPipe, PhoneNumberPipe, FilterPipe, FilterDatePipe, FilterTimerPipe, SelectAllPipe ],
  providers:    [ UserService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
