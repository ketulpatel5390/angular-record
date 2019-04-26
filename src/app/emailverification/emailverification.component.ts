import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { WebApiService} from '../_services/web-api.service';
import { Router,ActivatedRoute } from '@angular/router';
import { AlertService} from '../_services/alert.service';
import * as $ from 'jquery';
import * as moment from 'moment';
import {environment} from '../../environments/environment';
import swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material';
import { SharedDataService,IToken } from '../_services/shared-data.service';
@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  
  imageName;
  bgimageName;
  loading = false;
  error = '';
  success = '';
  userid:any = '';
  confirmid:any = '';
  registrationform: FormGroup;
   isAuthenticated: boolean;
  constructor(private sd: SharedDataService,private _Activatedroute:ActivatedRoute,
    private api: WebApiService, 
    private router: Router, 
    private alertService: AlertService,
     private dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    
    let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
     
  }

  ngOnInit() {

    this.confirmid= this._Activatedroute.snapshot.params['id'];
    this.userid= this._Activatedroute.snapshot.params['id2'];
    this.spinnerService.show();
    this.api.getEmailVerification(this.confirmid,this.userid).subscribe(response => {
      console.log(response);
      if(response){
        this.spinnerService.hide();
        this.success="Your email has been verified. Please log in using your credentials.";
      }else{
        this.spinnerService.hide();
        this.error ="Your Email Verifaction link has been Expired or Invalid.";
      }
    });
  }


   userlogin(){
        let self = this;
        if(this.dialog.openDialogs.length <= 0)
          {
                let d = self.dialog.open(LoginDialogComponent, 
                                        { panelClass: 'custom-dialog-container',
                                          backdropClass: 'custom-dialog-container-login' });
          }                              
      
    }

}
