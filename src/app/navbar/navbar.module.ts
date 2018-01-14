import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../api.service';
import { AppRoutingModule } from '../app-routing.module';

import { NavbarComponent } from './navbar.component';
import { NavbarProblemsetComponent } from './navbar-problemset/navbar-problemset.component';
import { UserComponent } from './user/user.component';

import { AppMaterialModule } from '../app-material.module';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  exports: [
    NavbarComponent
  ],
  declarations: [
    NavbarComponent,
    NavbarProblemsetComponent,
    UserComponent
  ],
  providers: [
    ApiService
  ]
})
export class NavbarModule { }
