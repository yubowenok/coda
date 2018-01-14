import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProblemsetListComponent } from './problemset-list/problemset-list.component';
import { LoginComponent } from './login/login.component';
import { ProblemsetComponent } from './problemset/problemset.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ProblemComponent } from './problem/problem.component';
import { SubmitComponent } from './submit/submit.component';
import { SubmissionComponent } from './submission/submission.component';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { FaqComponent } from './faq/faq.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/problemsets', pathMatch: 'full' },
  { path: 'problemsets', component: ProblemsetListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'problemset/:problemsetId', component: ProblemsetComponent },
  { path: 'problemset/:problemsetId/submit', component: SubmitComponent },
  { path: 'problemset/:problemsetId/problem/:problemNumber/submit', component: SubmitComponent },
  { path: 'problemset/:problemsetId/problem/:problemNumber', component: ProblemComponent },
  { path: 'problemset/:problemsetId/submissions/:username', component: SubmissionListComponent },
  { path: 'problemset/:problemsetId/submissions', component: SubmissionListComponent },
  { path: 'problemset/:problemsetId/submission/:username/:submissionId', component: SubmissionComponent },
  { path: 'problemset/:problemsetId/scoreboard', component: ScoreboardComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
