import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-feedback-dialog',
  templateUrl: './confirm-feedback-dialog.component.html',
  styleUrls: ['./confirm-feedback-dialog.component.css']
})
export class ConfirmFeedbackDialogComponent implements OnInit {

  feedbackform: FormGroup;
  constructor(private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>) { }

  addLinks = true;
  download = false;
  artist = false;
  displayfavourite=false;
  submitted = false;
  ngOnInit() {
    this.feedbackform = new FormGroup({
        comment: new FormControl("", Validators.compose([Validators.required])),
        addLink: new FormControl(""),
        favourite: new FormControl("")
    });
     this.feedbackform.setValue({
         comment:'',
         addLink: 'No',
         favourite: 'Yes'
     });
     
  }

  onNoClick(){
    let self = this;

    self.closeDialog();

  }

  closeDialog(){
    let self = this;
    if (self.feedbackform.valid){
        self.dialogRef.close(self.feedbackform.value);
    }else{
        this.submitted = true;
    }
  }
  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }
  show1(){
    this.displayfavourite=true;
  }
  show2(){
   this.displayfavourite=false;
  }
}
