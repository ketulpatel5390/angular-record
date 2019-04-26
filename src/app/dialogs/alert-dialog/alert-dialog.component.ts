import { Component, OnInit, Inject } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, ValidatorFn } from '@angular/forms';

export class InputDialogData {
  title? = 'Input Box';
  prompt? = '';
  placeholder? = 'Enter value here';
  validators?: ValidatorFn[] = [];
}

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>,
      @Inject(MAT_DIALOG_DATA) public data: InputDialogData) { }


  valueCtrl = new FormControl('', this.data.validators);

  ngOnInit() {
    
  }

  onNoClick(){
    let self = this;
    self.cancelDialog();
  }

  closeDialog(){
    let self = this;
    self.dialogRef.close(true);
   /* if (self.valueCtrl.valid){
      self.dialogRef.close(self.valueCtrl.value);
    }
    else {
      alert('The value entered is invalid');
    }*/
  }

  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }
}
