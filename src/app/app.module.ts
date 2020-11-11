import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SelectorComponent } from './components/selector/selector.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { AuthComponent } from './components/auth/auth.component';
import { HeaderComponent } from './components/header/header.component';
import { TrashComponent } from './components/trash/trash.component';
import { AddTaskComponent } from './components/add-task/add-task.component';

import { MomentPipe } from './shared/pipes/moment.pipe';
import { FilterPipe } from './shared/pipes/fiter.pipe';
import { ErrorPipe } from './shared/pipes/errors.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    SelectorComponent,
    OrganizerComponent,
    AuthComponent,
    HeaderComponent,
    MomentPipe,
    FilterPipe,
    ErrorPipe,
    ConfirmDialogComponent,
    TrashComponent,
    AddTaskComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
  bootstrap: [AppComponent],
})
export class AppModule { }
