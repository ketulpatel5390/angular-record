import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../question-base';
import { TextboxQuestion } from '../../textbox-question';
import { FormControl, FormGroup,Validators, FormArray } from '@angular/forms';
import { MyValidators } from '../../my-validators';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { SharedDataService, IToken } from '../../_services/shared-data.service';

import { IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

export class InputDialogData {
  SongId? = 'Input Box';
}
@Component({
  selector: 'app-geolocation-message-dialog',
  templateUrl: './geolocation-message-dialog.component.html',
  styleUrls: ['./geolocation-message-dialog.component.css']
})
export class GeolocationMessageDialogComponent implements OnInit {
  messageform: FormGroup;
  model: any = {};
   loading = false;
    error = '';
    StateorProvinancelist:IMultiSelectOption[];
  mySettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 7,
    displayAllSelectedText: true,
    minSelectionLimit:0,
    autoUnselect: true,
};
myTexts: IMultiSelectTexts = {
   
    defaultTitle: 'Select Option',
    
};

  constructor(private api: WebApiService,public sd: SharedDataService,
    private authenticationService: AuthenticationService,
    private router: Router ,
    private dialogRef: MatDialogRef<GeolocationMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData, private spinnerService: Ng4LoadingSpinnerService) 
    {
       dialogRef.backdropClick().subscribe(() => {
        // Close the dialog
        dialogRef.close();
       });
    }

  
  
  ngOnInit() {
    let self = this;
    console.log("Rec_UserId",this.data.SongId);
    this.spinnerService.show();
     self.api.getFavouriteMemberStateOrProvinance().subscribe(response => { 
     
        self.StateorProvinancelist = response;
        console.log("StateOrProvinance",self.StateorProvinancelist);
        this.spinnerService.hide();
      });

    this.messageform = new FormGroup({
       region: new FormControl("", Validators.compose([Validators.required])),
        title: new FormControl("", Validators.compose([Validators.required])),
        message: new FormControl("", Validators.compose([Validators.required]))
    });
    this.messageform.patchValue({
      region : [],
      title : "",
      message : ""
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
    
    console.log(self.messageform.value);
    this.spinnerService.show();
    self.api.SendGeolocationMessage(this.data.SongId,self.messageform.value.region.toString(),self.messageform.value.title,self.messageform.value.message).subscribe(response => 
    { 
      this.spinnerService.hide();
     if(response == 1){
       this.error="Message Sent Successfully.";
       
       self.dialogRef.close();
       
     }else{
       this.error="Something Went Wrong Please Try Letter.";
     } 
    });
   
  }

}
