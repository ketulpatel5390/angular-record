import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Siteconfiginfo } from '../../_models/songbook-life';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-siteconfig',
  templateUrl: './siteconfig.component.html',
  styleUrls: ['./siteconfig.component.css']
})
export class SiteconfigComponent implements OnInit, OnDestroy {

  siteconfig:Siteconfiginfo;
  siteconfigaccess :boolean = true;
  constructor(private api: WebApiService, private sd: SharedDataService, 
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
    this.spinnerService.show();
    self.api.getSiteconfiginfo().subscribe(response => {
      self.siteconfig = response;

      console.log(self.siteconfig);
      this.spinnerService.hide();
    });
  }

  ngOnDestroy(){
    let self = this;
   
  }
}
