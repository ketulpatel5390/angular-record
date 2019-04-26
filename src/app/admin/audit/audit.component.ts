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
import { Auditlog } from '../../_models/songbook-life';
@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit, OnDestroy {
    auditaccess :boolean = true;
  
  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
  pager = new PagerConfig();
  pagedAuditlog: Auditlog[];
  constructor(private api: WebApiService, private sd: SharedDataService, private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Admin - Audit Log';
    let temp = JSON.parse(localStorage.getItem('currentUser'));
    this.spinnerService.show();
    this.api.getadminrightsformenu(temp.UserId).subscribe(response => {
      console.log(response);
      this.spinnerService.hide();
      if(response.auditlog == 1){
          this.auditaccess = true;
      }else{
         this.auditaccess = false;
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
    self.api.getAuditlogCount().subscribe(response => {
      self.pager = self.pagerCtrl.getPager(response);
      self.pagerCtrl.setPage(1);
      self.sd.hideProgressBar();
      this.spinnerService.hide();
    })
  }

  onLoadPageHandler(){
    let self = this;
      this.spinnerService.show();
      self.getAuditLog().subscribe(response => {
        this.spinnerService.hide();
        self.pagedAuditlog = response;
        self.sd.hideProgressBar();
      });
    
  }

  getAuditLog(){
    let self = this;
    let skip = self.pager.startIndex;
    let take = self.pager.endIndex - self.pager.startIndex + 1;
    return self.api.getAuditLog(skip, take);
  }
  ngOnDestroy(){
    let self = this;
    /*self.subscriptions.forEach(s => s.unsubscribe());*/
  }
  refreshpage(){
    this.ngOnInit();
  }
}
