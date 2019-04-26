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
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  
  imageName;
  bgimageName;
  error = '';
 msgstatus= '';


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
    
   
  }


}
