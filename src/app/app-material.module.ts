import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatToolbarModule,
  MatSidenavModule,
  MatCardModule,
  MatTabsModule,
  MatListModule,
  MatIconModule,
  MatDividerModule,
  MatTooltipModule,
  MatExpansionModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatRadioModule,
  MatSelectModule,
  MatChipsModule,
  MatCheckboxModule,
  MatDialogModule,
  MatButtonToggle
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatSelectModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDialogModule
  ]
})
export class AppMaterialModule {}
