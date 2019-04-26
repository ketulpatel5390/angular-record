import { Component, OnDestroy, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Songcratefriendsinfo } from '../../_models/songbook-life';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-MySongCratePendingRequests',
  templateUrl: './MySongCratePendingRequests.component.html',
  styleUrls: ['./MySongCratePendingRequests.component.css']
})
export class MySongCratePendingRequestsComponent implements OnInit,AfterViewInit {
   @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  Songcratefriendsinfo :Songcratefriendsinfo[];
  error = '';
  successerror = '';
  constructor(private api: WebApiService, private sd: SharedDataService,
     private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Admin - Log';

  }


  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;

   
  }
      ngAfterViewInit(){
    let self = this;
    
          self.configurePager();
      
  }
  private configurePager(){
      let self = this;
      this.spinnerService.show();
      self.api.PendingSongcratefriendsinfoCount().subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
      })
     
    }
    onLoadPageHandler(){
      let self = this;
      this.spinnerService.show();
      self.PendingSongcratefriendsinfo().subscribe(response => {
        this.spinnerService.hide();
          self.Songcratefriendsinfo = response;
      });
     
    }

    PendingSongcratefriendsinfo(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.PendingSongcratefriendsinfo(skip, take);
    }
    approved(crate_id,toUserId)
    {  
      this.spinnerService.show();
       this.api.actionrequestsongcrate(crate_id,toUserId,"Approved").subscribe(response => {
         this.spinnerService.hide();
        this.configurePager();
        this.onLoadPageHandler();
      });

    }
    denied(crate_id,toUserId){
      this.spinnerService.show();
      this.api.actionrequestsongcrate(crate_id,toUserId,"Denied").subscribe(response => {
        this.spinnerService.hide();
        this.configurePager();
        this.onLoadPageHandler();
      });
    }
    block(crate_id,toUserId){
      this.spinnerService.show();
      this.api.actionrequestsongcrate(crate_id,toUserId,"Block").subscribe(response => {
        this.spinnerService.hide();
        this.configurePager();
        this.onLoadPageHandler();
      });
    }
    unBlock(crate_id,toUserId){
      this.spinnerService.show();
      this.api.actionrequestsongcrate(crate_id,toUserId,"Unblock").subscribe(response => {
        this.spinnerService.hide();
        this.configurePager();
        this.onLoadPageHandler();
      });
    }
 
}
