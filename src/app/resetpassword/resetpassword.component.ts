import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { WebApiService} from '../_services/web-api.service';
import { Router,ActivatedRoute } from '@angular/router';
import { AlertService} from '../_services/alert.service';
import * as $ from 'jquery';
import * as moment from 'moment';
import {environment} from '../../environments/environment';
import { MatDialog } from '@angular/material';
import { MyValidators } from '../my-validators';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import swal from 'sweetalert2';
import { SharedDataService,IToken } from '../_services/shared-data.service';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  
  imageName;
  bgimageName;
  error = '';
 msgstatus= '';

   resetpasswordform: FormGroup;
    usernameparam:any;
    resetcodeparam:any;
    isAuthenticated: boolean;
  constructor(private sd: SharedDataService,private _Activatedroute:ActivatedRoute,
    private api: WebApiService, 
    private router: Router, 
    private dialog: MatDialog,

    private alertService: AlertService, private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;

    self.sd.onCurrentUserChanged.subscribe(response => {
        this.refreshModel(response);
    });
    
   }

  ngOnInit() {
    let self = this; 
    //debugger;
    this.resetpasswordform = new FormGroup({
        username: new FormControl(""),
        resetCode: new FormControl(""),
        password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(5)])),
        confirmPassword: new FormControl("", Validators.compose([MyValidators.sameAs('password', 'Password')])),
        //captcha: new FormControl(""),
      });
    self.usernameparam= this._Activatedroute.snapshot.params['id'];
    self.resetcodeparam= this._Activatedroute.snapshot.params['id2'];
    //console.log("self.usernameparam",self.usernameparam,self.resetcodeparam);
    this.resetpasswordform.patchValue({
                username: self.usernameparam,
                resetCode : self.resetcodeparam,
                password: '',
                confirmPassword : '',
                //captcha:'' 
              });
    /*self.router.routerState.root.queryParams
            .first()
            .subscribe(r => {
                let username = r['u'];
                let resetCode = r['rc'];
                console.log('Query Params', username, resetCode);
                
                
                //if (username && resetCode) self.changePassword(username, resetCode);
    });*/
  }
  private refreshModel(response: IToken) {
      this.isAuthenticated = response.isAuthenticated;
    }
  onSubmitHandler(){
    console.log("resetpasswordform",this.resetpasswordform.value);
    if ( this.resetpasswordform.value.password == this.resetpasswordform.value.confirmPassword){
        this.spinnerService.show();
        this.api.changePassword(this.resetpasswordform.value.password, null, 
          this.resetpasswordform.value.username, this.resetpasswordform.value.resetCode).subscribe(response => {
            this.spinnerService.hide();
            console.log('Change Password Response', response);
            if(response){
              //this.error = '';
              //this.msgstatus = 'Your password has been changed';
              //this.ngOnInit();
               swal({
                  title: 'Your password has been changed successfully',
                  text: " Please Check Using Login",
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ok'
                }).then((result) => {
                  if (result.value) {
                    //this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/home']));
                      this.router.navigate(['/home']);
                       //this.alertService.success( 'Application submitted successfully! Please Check Your Email Address For Confirmation Link', true);
                      }
                })
            }else{
              //this.msgstatus = '';
              //this.error = 'Something Went Wrong Please enter Valid Credential.';
              //this.ngOnInit();
              swal({
                  title: 'Something Went Wrong Please enter Valid Credential.',
                  text: "Because Your link has been expired or invalid.",
                  type: 'warning',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Ok'
                }).then((result) => {
                  if (result.value) {
                    this.ngOnInit();
                      }
                })
            }
            
        });
    }else{
      this.msgstatus = '';
      swal(
        'New Password and Confirm Password Not Match!',
        'Please Enter Valid Password',
        'warning'
      )
     //this.error="New Password and Confirm Password Not Match";
    } 

  }
}
