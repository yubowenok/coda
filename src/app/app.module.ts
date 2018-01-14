import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent } from './app.component';
import { ProblemsetListComponent } from './problemset-list/problemset-list.component';
import { ProblemComponent } from './problem/problem.component';
import { ProblemsetComponent } from './problemset/problemset.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { SubmissionComponent } from './submission/submission.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { FaqComponent } from './faq/faq.component';

import { NavbarModule } from './navbar/navbar.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { MathJaxDirective } from './mathjax.directive';

import { ApiService } from './api.service';
import { MessageService } from './message.service';
import { SubmitComponent } from './submit/submit.component';
import { CopyService } from './copy.service';
import { CodeMirrorDirective } from './code-mirror.directive';

import { TimeDisplayPipe } from './pipes/time-display.pipe';
import { DateDisplayPipe } from './pipes/date-display.pipe';
import { VerdictDisplayPipe } from './pipes/verdict-display.pipe';
import { LanguageDisplayPipe } from './pipes/language-display.pipe';
import { VerdictClassPipe } from './pipes/verdict-class.pipe';
import { ExecutionTimePipe } from './pipes/execution-time.pipe';
import { MemoryPipe } from './pipes/memory.pipe';

@NgModule({
  imports: [
    NgxDatatableModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    FormsModule,
    NavbarModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ProblemsetListComponent,
    ProblemComponent,
    ProblemsetComponent,
    ScoreboardComponent,
    SubmissionListComponent,
    SubmissionComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    FaqComponent,
    MathJaxDirective,
    SubmitComponent,
    CodeMirrorDirective,
    TimeDisplayPipe,
    DateDisplayPipe,
    VerdictDisplayPipe,
    LanguageDisplayPipe,
    VerdictClassPipe,
    ExecutionTimePipe,
    MemoryPipe
  ],
  providers: [
    ApiService,
    CopyService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
