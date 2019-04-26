import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../question-base';
import { TextboxQuestion } from '../../textbox-question';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MyValidators } from '../../my-validators';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { SharedDataService, IToken } from '../../_services/shared-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import swal from 'sweetalert2';
export class InputDialogData {
  Rec_UserId? = 'Input Box';
  SongId? = 'Input Box';
}
@Component({
  selector: 'app-song-message-dialog',
  templateUrl: './song-message-dialog.component.html',
  styleUrls: ['./song-message-dialog.component.css']
})
export class SongMessageDialogComponent implements OnInit {
  messageform: FormGroup;
  model: any = {};
   loading = false;
    error = '';
  constructor(private api: WebApiService,public sd: SharedDataService,
    private authenticationService: AuthenticationService,
    private router: Router ,
    private dialogRef: MatDialogRef<SongMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData, private spinnerService: Ng4LoadingSpinnerService) 
    {
       
    }

  
  submitted = false;
  ngOnInit() {
    let self = this;
    this.data.Rec_UserId
    console.log("Rec_UserId",this.data.Rec_UserId);
    console.log("Rec_UserId",this.data.SongId);
    
    this.messageform = new FormGroup({
        title: new FormControl("", Validators.compose([Validators.required])),
        message: new FormControl("", Validators.compose([Validators.required]))
    });
    
  }

  onNoClick(){
    let self = this;
    self.cancelDialog();
  }

  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }

  closeDialog(){
    let self = this;
    this.data.Rec_UserId;
    if (self.messageform.valid){
    console.log(this.data.Rec_UserId);
    console.log(self.messageform.value);
    this.spinnerService.show();
    self.api.SongpostMessage(this.data.SongId,this.data.Rec_UserId,self.messageform.value.title,self.messageform.value.message).subscribe(response => 
    { 
      this.spinnerService.hide();
     if(response == 1){
       this.error="Message Sent Successfully.";
       
       self.dialogRef.close();
       
         swal(
              'Message Sent Successfully.',
              '',
              'success'
            );
           
         }else{
           this.error="Something Went Wrong Please Try Letter.";
           swal(
              'Something Went Wrong Please Try Letter.',
              '',
              'warning'
            );
         } 
        });
        }else{
         this.submitted = true;
       }
   
  }

}
