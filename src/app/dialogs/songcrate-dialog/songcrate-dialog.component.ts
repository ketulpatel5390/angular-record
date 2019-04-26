import { Component, OnInit, Inject } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-songcrate-dialog',
  templateUrl: './songcrate-dialog.component.html',
  styleUrls: ['./songcrate-dialog.component.css']
})
export class SongcrateDialogComponent implements OnInit {
 error = '';
 successerror = '';
 forgotform: FormGroup;
  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<SongcrateDialogComponent>, private spinnerService: Ng4LoadingSpinnerService) { }


  ngOnInit() {
   
  }

  onNoClick(){
    let self = this;
    self.cancelDialog();
  }

  closeDialog(){
    let self = this;
    
    
  }
  sharemycrate(username){
      console.log("username",username);
      if(username == ""){
        this.error = "Please Enter UserName For Share Your Song Crate.";
      }else
      {
        this.spinnerService.show();
        this.api.sharemycrate(username).subscribe(response => {
          console.log("username",response);
          this.spinnerService.hide();
          if(response == 1){
            this.successerror = "Successfully Share Your Song Crate With " + username + " User";
            this.error='';
          }else if(response == 2){
            this.error = "Do Not Share Your Song Crate To Current User.";
            this.successerror='';
          }else if(response == 3){
            this.successerror = "Request was already sent To Current User.";
            this.error='';
          }else{
            this.error = "UserName Does Not exist Please Enter Valid UserName For Share Your Song Crate.";
            this.successerror='';
          }
        });
      }

    }

  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }
}
