import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PagerComponent, PagerConfig } from '../../shared/pager/pager.component';
import { Log } from '../../_models/songbook-life';
@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {
  logaccess :boolean = true;
   @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
  pager = new PagerConfig();
  pagedlog: Log[];
  constructor(private api: WebApiService, private sd: SharedDataService, private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Admin - Log';
    let temp = JSON.parse(localStorage.getItem('currentUser'));
     this.spinnerService.show();
    this.api.getadminrightsformenu(temp.UserId).subscribe(response => {
      console.log(response);
       this.spinnerService.hide();
      if(response.logs == 1){
          this.logaccess = true;
      }else{
        this.logaccess = false;
      }

     });

  }


  ngOnInit() {
    let self = this;
    self.configurePager();
   
  }
  private configurePager(){
    let self = this;
    self.sd.showProgressBar('Retrieving applications count');
    this.spinnerService.show();
    self.api.getlogCount().subscribe(response => {
      self.pager = self.pagerCtrl.getPager(response);
      self.pagerCtrl.setPage(1);
      self.sd.hideProgressBar();
      this.spinnerService.hide();
    })
  }

  onLoadPageHandler(){
    let self = this;
      this.spinnerService.show();
      self.getlog().subscribe(response => {
        this.spinnerService.hide();
        self.pagedlog = response;
        self.sd.hideProgressBar();
      });
    
  }

  getlog(){
    let self = this;
    let skip = self.pager.startIndex;
    let take = self.pager.endIndex - self.pager.startIndex + 1;
    return self.api.getLog(skip, take);
  }
  ngOnDestroy(){
    let self = this;
   
  }
  refreshpage(){
    this.ngOnInit();
  }
}
