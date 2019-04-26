import { Component, OnInit, Inject } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import swal from 'sweetalert2';

export class InputDialogData {
  title? = 'Input Box';
  prompt? = '';
  placeholder? = 'Enter value here';
  validators?: ValidatorFn[] = [];
}

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.css']
})
export class InputDialogComponent implements OnInit {
 error = '';
 successerror = '';
 forgotform: FormGroup;
  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>,
      @Inject(MAT_DIALOG_DATA) public data: InputDialogData,private spinnerService: Ng4LoadingSpinnerService) { }


  //valueCtrl = new FormControl('', Validators.compose([Validators.required]));
  //email = new FormControl('', Validators.compose([Validators.required]));
  //captcha= new FormControl('', Validators.compose([Validators.required]));
  /*captcha: new FormControl("", Validators.compose([Validators.required])),*/
submitted = false;
  ngOnInit() {
    this.forgotform = new FormGroup({
      valueCtrl: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([Validators.required, Validators.email])),
      
    });
  }

  onNoClick(){
    let self = this;
    self.cancelDialog();
  }

  closeDialog(){
    let self = this;
    this.error='';
    if (self.forgotform.valid){
      this.spinnerService.show();
      self.api.resetPasswords(self.forgotform.value.valueCtrl,self.forgotform.value.email).subscribe(response => {
      console.log ('Reset Password Response', response);
      //self.sd.hideProgressBar();
      this.spinnerService.hide();
      if(response){
        swal({
              title: 'Reset instructions will be sent to the email associated with your account.',
              text: "Please Check It.",
              type: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
          }).then((result) => {
              if (result.value) 
              {
                 self.dialogRef.close();
              }
        })
        this.successerror=""; 
      }else{
        //this.error+= 'Please Enter Valid Username Or Email Address.';
        swal(
            'Please Enter Valid Username Or Email Address',
            'Enter Valid credentials',
            'warning'
        );
      }
     
      });

    }
    else {
       this.submitted = true;
      /*if(self.forgotform.value.valueCtrl == ""){
        this.error+= 'Please Enter Username ';
      }
      if(self.forgotform.value.email == ""){
        this.error+= 'Please Enter Email Address ';
      }*/
      
      //alert('The value entered is invalid');
    }
  }

  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }
}
