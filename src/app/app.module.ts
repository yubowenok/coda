import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }    from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent } from './app.component';
import { ProblemsetListComponent } from './problemset-list/problemset-list.component';
import { ProblemComponent } from './problem/problem.component';
import { ProblemsetComponent } from './problemset/problemset.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { SubmissionComponent } from './submission/submission.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './profile/profile.component';

import { ApiService } from './api.service';

@NgModule({
  declarations: [
    AppComponent,
    ProblemsetListComponent,
    ProblemComponent,
    ProblemsetComponent,
    ScoreboardComponent,
    SubmissionListComponent,
    SubmissionComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    UserComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppMaterialModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
