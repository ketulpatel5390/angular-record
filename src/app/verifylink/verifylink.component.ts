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
  selector: 'app-verifylink',
  templateUrl: './verifylink.component.html',
  styleUrls: ['./verifylink.component.css']
})
export class VerifylinkComponent implements OnInit {
  
  imageName;
  bgimageName;
  error = '';
 msgstatus= '';
 userid:any;
  username:any;
   verifylinkform: FormGroup;
    usernameparam:any;
     resetcodeparam:any;


  constructor(private _Activatedroute:ActivatedRoute,
    private api: WebApiService, 
    private router: Router, 
    private dialog: MatDialog,
    private sd: SharedDataService,
    private alertService: AlertService, private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
     


  
   }

  ngOnInit() {
    let self = this; 
    //debugger;
    this.userid =self.sd.currentUser.UserId;
    this.username  =self.sd.currentUser.Username;
    this.verifylinkform = new FormGroup({
        userid: new FormControl(""),
        username: new FormControl(""),
      });
    this.verifylinkform.patchValue({
                userid: self.sd.currentUser.UserId,
                username : self.sd.currentUser.Username,
                });
   
  }

  onSubmitHandler(){
    console.log("verifylinkform",this.verifylinkform.value);
    this.spinnerService.show();
    this.api.userverificationemail(this.verifylinkform.value.userid).subscribe(response => {
      
      
        this.spinnerService.hide();
        swal({
              title: 'A Verification link has been sent to your email account check your Inbox or Junk.',
              text: "Please click on the link that has been sent to your email account to verify your email and continue the registration process.",
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.value) {
          this.router.navigate(['/home']);
            }
        });
        
     
    });
   
  }
}
