import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { WebApiService} from '../_services/web-api.service';
import { Router,ActivatedRoute } from '@angular/router';
import { SharedDataService,IToken } from '../_services/shared-data.service';
import * as $ from 'jquery';
import {environment} from '../../environments/environment';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material';
import { AuthenticationService } from '../_services/authentication.service';
import swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
  
})
export class AboutusComponent implements OnInit {
  imageName;
  bgimageName;
  isAuthenticated: boolean;
  constructor(private _Activatedroute:ActivatedRoute,
    private authenticationService: AuthenticationService,
    private api: WebApiService, 
    private router: Router, 
    private dialog: MatDialog,
    private sd: SharedDataService,
    private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    self.sd.pageTitle.value = 'About Us';

    
      let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
  
   }
   ngOnInit() {
      
   
  }

   userlogin(){
        let self = this;
        if(self.dialog.openDialogs.length <= 0){
        let d = self.dialog.open(LoginDialogComponent, { panelClass: 'custom-dialog-container',
                                                         backdropClass: 'custom-dialog-container-login'
                                                       });
      }
      
    }

}
