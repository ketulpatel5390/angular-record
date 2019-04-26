import { Component, OnDestroy, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Songcratefriendsinfo } from '../../_models/songbook-life';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-Myrequest',
  templateUrl: './Myrequest.component.html',
  styleUrls: ['./Myrequest.component.css']
})
export class MyrequestComponent implements OnInit,AfterViewInit {
  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  Songcratefriendsinfo: Songcratefriendsinfo[];

  constructor(private router: Router,private api: WebApiService, private sd: SharedDataService,
     private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
   
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
      self.api.getSongcraterequestCount().subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
      })
     
    }
    onLoadPageHandler(){
      let self = this;
      this.spinnerService.show();
      self.getSongcraterequest().subscribe(response => {
        this.spinnerService.hide();
          self.Songcratefriendsinfo = response;
      });
     
    }

    getSongcraterequest(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getSongcraterequest(skip, take);
    }
    delete(crate_id){
      this.spinnerService.show();
      this.api.getdeleteSongcraterequest(crate_id).subscribe(response => {
        this.spinnerService.hide();
          //this.configurePager();
          //this.onLoadPageHandler();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/mysongcratefriends/Myrequest']));
        
      });

    }
 
}
