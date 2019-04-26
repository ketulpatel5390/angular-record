import { Component, OnInit, Inject } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SongFeedback } from '../../_models/songbook-life';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import {OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent} from "angular-star-rating";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
export class InputDialogData {
  SongId? = 'Input Box';
  OverallRating? = 'Input Box';

}
@Component({
  selector: 'app-edit-feedback-dialog',
  templateUrl: './edit-feedback-dialog.component.html',
  styleUrls: ['./edit-feedback-dialog.component.css']
})
export class EditfeedbackDialogComponent implements OnInit {
  editfeedbackform: FormGroup;
   getSongFeedback: SongFeedback;
  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>, private spinnerService: Ng4LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData) { }

newRating = 0;
 

  ngOnInit() {
    let self = this;
    this.data.SongId;
    this.data.OverallRating;
    console.log(this.data.SongId);
    this.editfeedbackform = new FormGroup({
        Comment: new FormControl(''),
        
    });
    self.api.getSongFeedback(this.data.SongId).subscribe(response => { 
        
        console.log("app info : ", response);
        this.getSongFeedback=response;
        this.editfeedbackform.setValue({
        Comment:this.getSongFeedback.Comment,
        
    });

    });

  }

  onNoClick(){
    let self = this;
    self.cancelDialog();
  }

  closeDialog(){
    let self = this;
    console.log(self.newRating);
    console.log(self.editfeedbackform.value.Comment);
    this.spinnerService.show();
    self.api.postFeedback(this.getSongFeedback.SongId,self.newRating).subscribe(response => { 
        
        console.log("New Rating : ", response);
       this.spinnerService.hide();
        
    });
    this.spinnerService.show();
    self.api.postFeedbackcomment(this.getSongFeedback.SongId,self.editfeedbackform.value.Comment).subscribe(response => { 
        
        console.log("postFeedbackcomment info : ", response);
       this.spinnerService.hide();
        
    });

    self.dialogRef.close();
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
    onRatingChangeHandler($event: OnRatingChangeEven){
    let self = this;
    //self.overallRating = $event.rating;
    self.newRating = $event.rating;
    
  }
}
