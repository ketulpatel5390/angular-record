import { Component, OnInit, Inject } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, ValidatorFn } from '@angular/forms';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-alert-dialog',
  templateUrl: './genres-display-dialog.component.html',
  styleUrls: ['./genres-display-dialog.component.css']
})
export class GenresdisplayDialogComponent implements OnInit {

generlist:any[];
  constructor(private api: WebApiService, private spinnerService: Ng4LoadingSpinnerService,
    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>) { }

ngOnInit() {
   this.spinnerService.show();
    this.api.getUswersGenreGroupNames().subscribe(response =>{
       this.generlist = response;
       this.spinnerService.hide();
      
    });
   
    
  }

  onNoClick(){
    let self = this;
    self.cancelDialog();
  }

  closeDialog(){
    let self = this;
    self.dialogRef.close();
 }
  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }
}
