import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProblemsetListComponent } from './problemset-list/problemset-list.component';
import { LoginComponent } from './login/login.component';
import { ProblemsetComponent } from './problemset/problemset.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ProblemComponent } from './problem/problem.component';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { FaqComponent } from './faq/faq.component';

const routes: Routes = [
  { path: 'list', component: ProblemsetListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'faq', component: FaqComponent },
  { path: ':problemsetId', component: ProblemsetComponent },
  { path: ':problemsetId/:problemNumber', component: ProblemComponent },
  { path: ':problemsetId/submissions/:problemNumber', component: SubmissionListComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
