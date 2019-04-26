import {NgModule} from '@angular/core';
//import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule,
    MatCardModule, MatGridListModule,
    MatIconModule, MatListModule, 
    MatSelectModule,
    MatTabsModule,
    MAT_DATE_FORMATS,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM-DD-YYYY',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

    const modules = [MatIconModule, MatButtonModule, MatCardModule, MatCheckboxModule, 
      MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatGridListModule,
        MatInputModule, MatListModule, MatMomentDateModule, MatPaginatorModule,  MatProgressBarModule, 
        MatProgressSpinnerModule,
        MatSelectModule, MatTableModule,
        MatTabsModule, MatTooltipModule,
      ScrollDispatchModule]; 
@NgModule({
  imports: modules, 
  exports: modules,
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class MaterialDesignModule { }