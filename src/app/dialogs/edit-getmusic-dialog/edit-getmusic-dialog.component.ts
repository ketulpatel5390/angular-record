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
import { KVP,Application } from '../../_models/songbook-life';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
@Component({
  selector: 'app-edit-getmusic-dialog',
  templateUrl: './edit-getmusic-dialog.component.html',
  styleUrls: ['./edit-getmusic-dialog.component.css']
})
export class EditGetmusicDialogDialogComponent implements OnInit {
  editgeneralform: FormGroup;
  model: any = {};
   loading = false;
    error = '';
     //genreslist: any;
    
     ApplicationProfiles: Application;
     generslist: IMultiSelectOption[];
  mySettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 7,
    displayAllSelectedText: true,
    minSelectionLimit:0,
    autoUnselect: true,
    isLazyLoad: true,
    maxHeight:'150px',
    showCheckAll:true,
    showUncheckAll:true,
    ignoreLabels:true,
};
myTexts: IMultiSelectTexts = {
   
    defaultTitle: 'Select Genres',
    
};
  constructor(private api: WebApiService,public sd: SharedDataService,
    private authenticationService: AuthenticationService,
    private router: Router , private spinnerService: Ng4LoadingSpinnerService,
    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>) { }

  
  
  ngOnInit() {
    let self = this;
    /*self.api.getProperty<KVP[]>('GenreGroupNames').subscribe(response => {
      console.log("Genreslist",response);
      self.genreslist=response;
       console.log("AfterGenreslist",self.genreslist);
    });*/
    self.api.getGenreGroupNames().subscribe(response =>{
      //this.genersgroupname = response;

      this.generslist = response;
      
    });
    
    this.editgeneralform = new FormGroup({
        appid: new FormControl(""),
        SongsReview: new FormControl("",  Validators.compose([Validators.required])),
        MusicServed: new FormControl("", Validators.compose([Validators.required])),
      
    });
    this.spinnerService.show();
    self.api.getApplication().subscribe(response => { 
        
        console.log("app info : ", response);
        this.ApplicationProfiles=response;
        var string = this.ApplicationProfiles.MusicServed.split('|'); // <- split
        this.editgeneralform.setValue({
         appid: this.ApplicationProfiles.AppId,
         SongsReview: this.ApplicationProfiles.SongsReview,
         MusicServed: string,
         
        });
        this.spinnerService.hide();
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
    if (self.editgeneralform.valid){
      //self.onSubmitHandler(self.form.getPayload());
      self.dialogRef.close(self.editgeneralform.value);
    }else {
      this.error = 'Some of your entries are invalid!';
    }
   
  }

}
