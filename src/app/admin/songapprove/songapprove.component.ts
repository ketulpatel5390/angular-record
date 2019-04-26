import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { PageEvent } from '@angular/material';
import * as $ from 'jquery';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-songapprove',
  templateUrl: './songapprove.component.html',
  styleUrls: ['./songapprove.component.css']
})
export class SongApproveComponent implements OnInit{
songaccess :boolean = true;
items: any[] = [
    { id: 'Pending', name: 'Pending' },
    { id: 'All', name: 'All' },
    { id: 'Rated', name: 'Rated' },
    { id: 'Unrated', name: 'Unrated' },
    { id: 'Approved', name: 'Approved' },
    { id: 'Rejected', name: 'Rejected' },
    { id: 'Expired', name: 'Expired' } 
  ];
  selected: any = 'Pending';
  constructor(private router: Router,private api: WebApiService, private sd: SharedDataService
    , private spinnerService: Ng4LoadingSpinnerService,private route: ActivatedRoute) { 
    let self = this;
    
    self.sd.pageTitle.value = 'My Music Library';
    let temp = JSON.parse(localStorage.getItem('currentUser'));
    this.spinnerService.show();
    this.api.getadminrightsformenu(temp.UserId).subscribe(response => {
      console.log(response);
      this.spinnerService.hide();
      if(response.music == 1){
          this.songaccess = true;
      }else{
        this.songaccess = false;
      }

     });

  }
   @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  
  ngOnInit() {
    let self = this;
    this.route.queryParams.subscribe(params => {
        console.log("Filter",params.filter);
        if(params.filter){
          this.selected = params.filter;
        }
    });
     self.configurePager(this.selected);
  }
/*  ngAfterViewInit(){
    let self = this;

   
  }*/
  selectOption(id: string) {
    //getted from event
    //console.log(id);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => 
    this.router.navigate(['/admin/songapprovebyadmin'], { queryParams: { filter: id } }));
    this.selected = id;
    this.configurePager(this.selected);
   //this.onLoadPageHandler(id); 
    
  }
  private configurePager(selected){
      let self = this;
      console.log("configurePager",selected);
      this.spinnerService.show();
      self.api.getSongApproveCount(selected).subscribe(response => {
        console.log("total",response);
        this.spinnerService.hide();
        self.pager = this.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
        //self.sd.hideProgressBar();
        
      });
     
    }
    onLoadPageHandler(filterby){
        let self = this;
        console.log("onLoadPageHandler",filterby);
          self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
          this.spinnerService.show();
          self.getSongApprove(filterby).subscribe(response => {
            self.pagedSongs = response;
            self.sd.hideProgressBar();
            this.spinnerService.hide();
          });
    }

    getSongApprove(filterby){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getSongApprove(filterby, skip, take);
    }
    onloadfuntion(){
      this. onLoadPageHandler(this.selected);
    }

}
