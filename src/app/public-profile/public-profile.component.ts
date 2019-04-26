import { Component, OnDestroy, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { WebApiService } from '../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Userinfo ,Song} from '../_models/songbook-life';
import { PagerConfig, PagerComponent } from '../shared/pager/pager.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit{
  currentuserid:any;
   crateuserinfo: Userinfo;
   items: any;
   @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  generlist:any[];
  constructor(private api: WebApiService, private sd: SharedDataService,private route: ActivatedRoute,
     private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.currentuserid= this.route.snapshot.params['id'];

    

  }


  ngOnInit() {
    let self = this;
    this.spinnerService.show();
   self.api.getuserinfo(self.currentuserid).subscribe(response => {
     this.spinnerService.hide();
      self.crateuserinfo = response;
      console.log("crateuserinfo ",this.crateuserinfo);
    });
   this.spinnerService.show();
    this.api.getUswersGenreGroupNamesbyuser(self.currentuserid).subscribe(response =>{
       this.generlist = response;
       this.spinnerService.hide();
      
    });
   
  }

 
}
