import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { QuestionBase } from '../question-base';
import { TextboxQuestion } from '../textbox-question';
import { DropdownQuestion } from '../dropdown-question';
import { MyValidators } from '../my-validators';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { QuestionControlService } from '../_services/question-control.service';
import { CheckboxArrayQuestion } from '../checkbox-array-question';
import { WebApiService} from '../_services/web-api.service';
import { MultipleChoiceQuestionBase } from '../multiple-choice-question-base';
import { DatepickerQuestion } from '../datepicker-question';
import { Router,ActivatedRoute } from '@angular/router';
import { DropdownCheckboxQuestion } from '../dropdown-checkbox-question';
import { SharedDataService,IToken } from '../_services/shared-data.service';
import { DynamicFormComponent } from '../shared/dynamic-form/dynamic-form.component';
import { AlertService} from '../_services/alert.service';
import { KVP, KVPG } from '../_models/songbook-life';
import * as $ from 'jquery';
import { MY_FORMATS } from '../material-design-module';
import { MAT_DATE_FORMATS } from '@angular/material';
import { IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
//import {IMyDpOptions,IMyDefaultMonth,IMyDateModel,IMyInputFieldChanged,IMyInputFocusBlur,IMyDate} from 'mydatepicker';
import * as moment from 'moment';
import {environment} from '../../environments/environment';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material';
import { AuthenticationService } from '../_services/authentication.service';
import swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
export class RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  city: string;
  recoveryQuestion: string;
  recoveryAnswer: string;
  iAgree: boolean;
  genres: string[];
  songReviewLimit: number;
 
 

}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class RegisterComponent implements OnInit {
  fbname :string="";
  fbemail :string="";
  fbid :string="";
  msgstatus : string="";
  packagelist:any;
  payLoad :string = '';
  imageName;
  bgimageName;
  dateofbirth:string;
  daten = new Date();
loading = false;
    error = '';
  //generslist :any;
  generslist: IMultiSelectOption[];
  mySettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 5,
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
 myDatePickerOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'mm-dd-yyyy',
        disableSince:{year: this.daten.getFullYear() - 13, month: this.daten.getMonth(), day: this.daten.getDay()},
        maxYear:this.daten.getFullYear() - 13,
        
        

    };
 private placeholder: string = 'mm-dd-yyyy';
 public mask = {
    guide: true,
    showMask : true,
    mask: [/\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/,/\d/, /\d/]
  };
 
 
  countrylist:any;
  statelist :any;
   registrationform: FormGroup;
   default: number = 10;
   defaultcountry: string = 'US';
   defaultstates: string = 'AL';
   defaultpackage: number = 111;
   isuploadlist = [{
                  "key": 'Yes',
                  "value": "Yes"
                  }, {
                  "key": 'No',
                  "value": "No"
                  }];
     defaultisuploadlist: string = 'No';
  constructor(private qcs: QuestionControlService, 
    private _Activatedroute:ActivatedRoute,
    private authenticationService: AuthenticationService,
    private api: WebApiService, 
    private router: Router, 
    private dialog: MatDialog,
    private sd: SharedDataService,
    private alertService: AlertService,
    private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    self.sd.pageTitle.value = 'Registration Form';

     $("#register_scroll").click(function() {
          $([document.documentElement, document.body]).animate({
              scrollTop: $("#register_scroller").offset().top
          }, 2000);
      });
      let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
   /* this.spinnerService.show();
    self.api.getPropertys<KVPG[]>('GenreGroupNames').subscribe(response =>{
      this.generslist = response;
      this.spinnerService.hide();
    });*/
    self.api.getGenreGroupNames().subscribe(response =>{
      //this.genersgroupname = response;

      this.generslist = response;
      this.spinnerService.hide();
    });
   
     
   }
    
   questions: QuestionBase<any>[]= [];


    submitted = false;
  
    onSubmit() { this.submitted = true; }
  
 
    ngOnInit() {
    
      
      this.spinnerService.show();
      //$("#register_scroll").click(function() {
          $([document.documentElement, document.body]).animate({
              scrollTop: $("#register_scroller").offset().top
          }, 'slow');
     // });
    let self = this; 
    /*self.api.getPropertys<KVPG[]>('GenreGroupNames').subscribe(response =>{
      this.generslist = response;
    });*/
    self.api.getGenreGroupNames().subscribe(response =>{
      //this.genersgroupname = response;

      this.generslist = response;
      this.spinnerService.hide();
    });
    
    self.fbemail=self._Activatedroute.snapshot.paramMap.get('email');
    console.log("email",self._Activatedroute.snapshot.paramMap.get('email'));
    self.fbname=self._Activatedroute.snapshot.paramMap.get('name');
    console.log("name",self._Activatedroute.snapshot.paramMap.get('name'));
    self.fbid=self._Activatedroute.snapshot.paramMap.get('id');
    console.log("id",self._Activatedroute.snapshot.paramMap.get('id'));

    
    this.registrationform = new FormGroup({
        facebookid: new FormControl(""),
        firstName: new FormControl(""),
        lastName: new FormControl(""),
        dob: new FormControl("", Validators.compose([Validators.required])),
        email: new FormControl("", Validators.compose([Validators.required, Validators.email])),
        username: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(32)])),
        password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(5)])),
        confirmPassword: new FormControl("", Validators.compose([MyValidators.sameAs('password', 'Password')])),
        country: new FormControl("", Validators.compose([Validators.required])),
        state: new FormControl("", Validators.compose([Validators.required])),
        city: new FormControl("", Validators.compose([Validators.required])),
        songReviewLimit: new FormControl("", Validators.compose([Validators.required, Validators.min(10)])),
        genre: new FormControl("", Validators.compose([Validators.required])),
        //package: new FormControl("", Validators.compose([Validators.required])),
       // captcha: new FormControl("", Validators.compose([Validators.required])),
       uploadasong: new FormControl("", Validators.compose([Validators.required])),
    });
   this.registrationform.controls['genre'].setValue([], {emitEvent: false});

    
    self.api.getProperty<KVP[]>('Countries').subscribe(response =>{
      this.countrylist =response;
    });
    self.api.getProperty<KVP[]>('States').subscribe(response =>{
      this.statelist =response;
    });
    self.api.getProperty<KVP[]>('Packages').subscribe(response => { 
      this.packagelist=response;
    });

  
   this.registrationform.controls['country'].setValue(this.defaultcountry, {onlySelf: true});
   this.registrationform.controls['state'].setValue(this.defaultstates, {onlySelf: true});
   this.registrationform.controls['uploadasong'].setValue(this.defaultisuploadlist, {onlySelf: true});

    self.api.getinfoSiteconfig().subscribe(response => {
      this.registrationform.controls['songReviewLimit'].setValue(response.defaultreviewlimit, {onlySelf: true});
      //this.registrationform.controls['package'].setValue(response.defaultpackage, {onlySelf: true});
    });
    /*this.registrationform.controls['dob'].setValue({
        date: {
            year: this.daten.getFullYear() - 14,
            month: this.daten.getMonth(),
            day: this.daten.getDate()}
      });*/
   
   this.spinnerService.hide();
  }


  changeLog: string[]=[];

  onChangeLogHandler(changes: string[]){
    this.changeLog.push(changes.join(', '));
  }
  onDateChanged(event: IMyDateModel) {
    this.dateofbirth = event.formatted;
      var regexes = /^(\d{1,2})\-(\d{1,2})\-(\d{4})$/;
      var dtRegex = new RegExp(/\b\d{1,2}[\-]\d{1,2}[\-]\d{4}\b/);
      //  console.log("fc.value",new Date(event.formatted));
      //  console.log("fc.value",dtRegex.test(event.formatted));
    if(!regexes.test(event.formatted)){

      return ({isValidDateofbirth: true});

    } else {
      return (null);
    }

    }
  getPayload(){
     let self = this;
  let genreString = '';
    for (let i = 0; i < self.registrationform.value.genre.length; i++) {
      if (self.registrationform.value.genre[i])
        genreString +=self.registrationform.value.genre[i] + '|';
    }
    if (genreString.length > 0)
      genreString = genreString.substr(0, genreString.length - 1);
    self.registrationform.value.genreString = genreString;
    //format date  moment(self.registrationform.value.dob.date.formatted).format('YYYY-MM-DD');
    self.registrationform.value.dob = this.dateofbirth; 
    return JSON.stringify(this.registrationform.value);
  }
  onSubmitHandler(){
    let self = this;
    if(self.registrationform.valid){


     self.payLoad = self.getPayload();
    self.sd.showProgressBar('Submitting application...');
    //console.log('Form Value',  self.payLoad);
    this.spinnerService.show();
    self.api.submitApplication( self.payLoad).subscribe(response => {
      self.sd.hideProgressBar();
      this.spinnerService.hide();
      console.log('Registration Response', response);
      if (response.status == 0 || response.status == null) {
        //alert('Application submitted successfully!');
        let msg = `Application submitted successfully! Please Check Your Email Address For Confirmation Link \n.`;
        /*if (response.data.package.Price > 0){
          self.sd.tempData = response.data;
          self.router.navigate(['checkout']);
        }*/
        if (response.data.uploadasong ==  'Yes'){
          self.sd.tempData = response.data;
          self.router.navigate(['chooseplan']);
        }
        else
        {  
          
          swal({
            title: 'Application submitted successfully.',
            text: "",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
              //this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/home']));
                //self.router.navigate(['']);
                 //this.alertService.success( 'Application submitted successfully! Please Check Your Email Address For Confirmation Link', true);
                self.router.navigate(['thankyou']);
                }
          })
          //self.router.navigate(['register']);
          
        }

      }
      else {
        let msg = '';
        if (response.status == 1){
          msg += 'Missing data like Username or password or confirmPassword or dob or Email. \n';
        }
         if (response.status == 2){
          msg += 'No sign ups below the age of 13 \n';  
        }
        if (response.status == 3){
          msg += 'The selected username is not available \n';
        }
        if (response.status == 4){
          msg += 'Failed to User Registration because Something Went to Wrong. \n' ;
        }
        if (response.status == 5){
          msg += 'Failed to User Registration because Something Went to Wrong. \n';
        }
        /* $([document.documentElement, document.body]).animate({
              scrollTop: $("#register_scroller").offset().top
          }, 2000);*/
        this.alertService.error(msg, true);
        //self.router.navigate(['register',{ statusmsg: msg }]);
        //alert(msg);
      }
    });
    }else{
      this.submitted = true;
    }
  }
   userlogin(){
        let self = this;
        if(self.dialog.openDialogs.length <= 0){
        let d = self.dialog.open(LoginDialogComponent, { panelClass: 'custom-dialog-container',
                                                         backdropClass: 'custom-dialog-container-login'
                                                       });
      }
       /* d.disableClose = true;

       d.backdropClick().subscribe(onclick => {
         console.log("onclick Event");
          d.close();
        });*/
       /* d.afterClosed().subscribe(s => {
            if (s) {
              //console.log(s);
                self.sd.showProgressBar('User Login...');
                this.authenticationService.login(s.username, s.password)
                .subscribe(result => {
                if (result === true) {
                  
                    this.router.navigate(['getMusic']);

                } else {
                    if (self.sd.currentUser && self.sd.currentUser.errvar == 4)
                        self.router.navigate(['/confirm']);

                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
            }
             console.log('Right After close', s);
        });*/
    }
    dateMask(event: any) {
        var v = event.target.value;
        if (v.match(/^\d{2}$/) !== null) {
          event.target.value = v + '-';
        } else if (v.match(/^\d{2}\-\d{2}$/) !== null) {
          event.target.value = v + '-';
      }
    }

}
