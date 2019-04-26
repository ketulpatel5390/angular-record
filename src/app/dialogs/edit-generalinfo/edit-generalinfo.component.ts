import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
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
import { KVP,Application,AppWithData } from '../../_models/songbook-life';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'app-edit-generalinfo',
  templateUrl: './edit-generalinfo.component.html',
  styleUrls: ['./edit-generalinfo.component.css']
})
export class EditGeneralinfoDialogComponent implements OnInit {
  editgeneralform: FormGroup;
  selectedFile: File;
  model: any = {};
   loading = false;
    error = '';
     countrylist: any;
     statelist: any;
     ApplicationProfiles: Application;
     Applicationfiles: AppWithData[] = [];
      @ViewChild('fileInput') fileInput: ElementRef;
      imageSource: string;
      isuploads='';
      inpromember: boolean=false;
     // @ViewChild('fileUpload') fileUpload:FileUpload;
  constructor(private api: WebApiService,public sd: SharedDataService,
    private authenticationService: AuthenticationService,
    private router: Router , private spinnerService: Ng4LoadingSpinnerService,

    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>) { }

  
  
  ngOnInit() {
    let self = this;
    this.spinnerService.show();
    self.api.getpromember().subscribe(response => { 
      this.spinnerService.hide();
      if (response) {
         this.inpromember=true;
      }
    });
    this.isuploads=self.sd.currentUser.isupload;
    this.spinnerService.show();
    self.api.getProperty<KVP[]>('Countries').subscribe(response => {
      console.log("Countrylist",response);
      self.countrylist=response;
       console.log("AfterCountrylist",self.countrylist);
       this.spinnerService.hide();
    });
    this.spinnerService.show();
    self.api.getProperty<KVP[]>('States').subscribe(response => {
      console.log("statelist",response);
      self.statelist=response;
       console.log("Afterstatelist",self.statelist);
       this.spinnerService.show();
    });
    this.editgeneralform = new FormGroup({
        appid: new FormControl(""),
        FirstName: new FormControl(""),
        LastName: new FormControl(""),
        DOB: new FormControl("", Validators.compose([Validators.required])),
        Email: new FormControl("", Validators.compose([Validators.email])),
        Country: new FormControl("", Validators.compose([Validators.required])),
        StateOrProvince: new FormControl("", Validators.compose([Validators.required])),
        gender: new FormControl(''),
        description: new FormControl(''),
        avatar: new FormControl(null),
        imageInput: new FormControl(''),
        facebook: new FormControl(''),
        twitter: new FormControl(''),
        instagram: new FormControl(''),
        youtube: new FormControl(''),
    });
    this.spinnerService.show();
    self.api.getApplication().subscribe(response => { 
        
        console.log("app info : ", response);
        this.ApplicationProfiles=response;
        //this.form.questions['FirstName'].value=response.FirstName;
         this.editgeneralform.setValue({
         appid: this.ApplicationProfiles.AppId,
         FirstName: this.ApplicationProfiles.FirstName,
         LastName: this.ApplicationProfiles.LastName,
         DOB: this.ApplicationProfiles.DOB,
         Email: this.ApplicationProfiles.Email,
         Country: this.ApplicationProfiles.Country,
         StateOrProvince: this.ApplicationProfiles.StateOrProvince,
         gender: this.ApplicationProfiles.Gender,
         description: this.ApplicationProfiles.bio,
         avatar:null,
         imageInput:'',
         facebook: this.ApplicationProfiles.facebook,
         twitter: this.ApplicationProfiles.twitter,
         instagram: this.ApplicationProfiles.instagram,
         youtube: this.ApplicationProfiles.youtube
        });
        
        let baseulrs=environment.baseulrs;
        self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}` + this.ApplicationProfiles.profile_pic;
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
  onFileChanged(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      
       reader.onload = () => {
         reader.result;
          console.log(" reader.result", reader.result); 
          this.editgeneralform.get('imageInput').setValue(reader.result);
       }; 
       
       //this.editgeneralform.get('imageInput').setValue(reader.result);
       
    }
  }


  closeDialog(){
    let self = this;
    //const formModel = this.prepareSave();
    if (self.editgeneralform.valid){
      //self.onSubmitHandler(self.form.getPayload());
      self.dialogRef.close(self.editgeneralform.value);
    }else {
      this.error = 'Some of your entries are invalid!';
    }
    //console.log(self.loginform.value.username);
    /*this.authenticationService.login(self.loginform.value.username, self.loginform.value.password)
                .subscribe(result => {
                if (result === true) {
                    self.dialogRef.close(self.loginform.value);
                    this.router.navigate(['getMusic']);
                } else {
                    if (self.sd.currentUser && self.sd.currentUser.errvar == 4)
                        self.router.navigate(['/confirm']);

                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                   // alert('Username or password is incorrect');
                }
               }, (error) => {
                          this.error = 'Username or password is incorrect';
              });*/
    /*if (self.loginform.valid){
      //self.onSubmitHandler(self.form.getPayload());
      self.dialogRef.close(self.loginform.value);
    }
    else {
      alert('Some of your entries are invalid!');
    }*/
  }

}
