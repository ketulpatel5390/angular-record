import { Component, OnDestroy, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Userinfo ,Song} from '../../_models/songbook-life';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-CurrentSongCrateFriendsinfo',
  templateUrl: './CurrentSongCrateFriendsinfo.component.html',
  styleUrls: ['./CurrentSongCrateFriendsinfo.component.css']
})
export class CurrentSongCrateFriendsinfoComponent implements OnInit{
  currentuserid:any;
   crateuserinfo: Userinfo;
   items: any;
   @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  constructor(private api: WebApiService, private sd: SharedDataService,private route: ActivatedRoute,
     private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.currentuserid= this.route.snapshot.params['id'];

    

  }


  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    this.spinnerService.show();
   self.api.Songcratecurrentuserinfo(self.currentuserid).subscribe(response => {
     this.spinnerService.hide();
      self.crateuserinfo = response;
      console.log("crateuserinfo ",this.crateuserinfo);
    });
   self.configurePager();
  }

 
    private configurePager(){
      let self = this;
      this.spinnerService.show();
      self.api.getcrateuserSongsCount(self.currentuserid).subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
      })
      
    }

    onLoadPageHandler(){
      let self = this;
      this.spinnerService.show();
      self.getcrateuserSongs().subscribe(response => {
        this.spinnerService.hide();
          self.pagedSongs = response;
      });
      
    }

    getcrateuserSongs(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getcrateuserSongs(self.currentuserid,skip, take);
    }
 
}
