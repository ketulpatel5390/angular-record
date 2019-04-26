import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Siteconfiginfo } from '../../_models/songbook-life';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { KVP, KVPG } from '../../_models/songbook-life';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-editsiteconfig',
  templateUrl: './editsiteconfig.component.html',
  styleUrls: ['./editsiteconfig.component.css']
})
export class EditSiteconfigComponent implements OnInit, OnDestroy {

  siteconfig:Siteconfiginfo;
  formdata;
  siteconfigaccess :boolean = true;
  packagelist:any;
  public envtype = [
    { value: 'sandbox', display: 'sandbox' },
    { value: 'production', display: 'production' }
];
  constructor(private router: Router,private api: WebApiService, private sd: SharedDataService, 
    private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Site Config';
    let temp = JSON.parse(localStorage.getItem('currentUser'));
     this.spinnerService.show();
    this.api.getadminrightsformenu(temp.UserId).subscribe(response => {
      console.log(response);
       this.spinnerService.hide();
      if(response.sitesetting == 1){
          this.siteconfigaccess = true;
      }else{
        this.siteconfigaccess = false;
      }

     });

  }

  

  ngOnInit() {
    let self = this;
    this.formdata = new FormGroup({
         ep_limit: new FormControl("", Validators.compose([Validators.required])),
         album_limit: new FormControl("", Validators.compose([Validators.required])),
         ideltime: new FormControl("", Validators.compose([Validators.required])),
         defaultpackage: new FormControl("", Validators.compose([Validators.required])),
         defaultreviewlimit: new FormControl("", Validators.compose([Validators.required])),
         fileuploadsize: new FormControl("", Validators.compose([Validators.required])),
         listeningroomconfig: new FormControl("", Validators.compose([Validators.required])),
         set_distibution: new FormControl("", Validators.compose([Validators.required])),
         paypal_env: new FormControl("", Validators.compose([Validators.required])),
         paypal_key: new FormControl("", Validators.compose([Validators.required])),
         tire2_per: new FormControl("", Validators.compose([Validators.required,Validators.min(0), Validators.max(100)])),
         tire2_ret: new FormControl("", Validators.compose([Validators.required,Validators.min(0), Validators.max(5)])),
         tire3_per: new FormControl("", Validators.compose([Validators.required,Validators.min(0), Validators.max(100)])),
         tire3_ret: new FormControl("", Validators.compose([Validators.required,Validators.min(0), Validators.max(5)])),
         tire4_per: new FormControl("", Validators.compose([Validators.required,Validators.min(0), Validators.max(100)])),
         tire4_ret: new FormControl("", Validators.compose([Validators.required,Validators.min(0), Validators.max(5)]))
     });
     this.spinnerService.show();
    self.api.getProperty<KVP[]>('Packages').subscribe(response => { 
      this.packagelist=response;
       this.spinnerService.hide();
    });
     this.spinnerService.show();
    self.api.getSiteconfiginfo().subscribe(response => {
      self.siteconfig = response;
       this.spinnerService.hide();
      //console.log(self.siteconfig);
      this.formdata.setValue({
         ep_limit: this.siteconfig.ep_limit,
         album_limit: this.siteconfig.album_limit,
         ideltime: this.siteconfig.ideltime,
         defaultpackage: this.siteconfig.defaultpackage,
         defaultreviewlimit: this.siteconfig.defaultreviewlimit,
         fileuploadsize: this.siteconfig.fileuploadsize,
         listeningroomconfig: this.siteconfig.listeningroomconfig,
         set_distibution: this.siteconfig.set_distibution,
         paypal_key: this.siteconfig.paypal_key,
         paypal_env: this.siteconfig.paypal_env,
         tire2_per: this.siteconfig.tire2_per,
         tire2_ret: this.siteconfig.tire2_ret,
         tire3_per: this.siteconfig.tire3_per,
         tire3_ret: this.siteconfig.tire3_ret,
         tire4_per: this.siteconfig.tire4_per,
         tire4_ret: this.siteconfig.tire4_ret,
      });

     //this.formdata.controls['defaultpackage'].setValue(this.siteconfig.defaultpackage, {onlySelf: true});
    });
    
    
  }

  ngOnDestroy(){
    let self = this;
   
  }
   onClickSubmit(formdatavalue){
   // console.log("Form Submit Data",JSON.stringify(formdatavalue));
    this.spinnerService.show();
   this.api.updateSiteconfiginfo(JSON.stringify(formdatavalue)).subscribe(response => {
      console.log('Song updated ', response);
       this.spinnerService.hide();
      this.router.navigate(['/admin/siteconfig']);
    });
  }
}
