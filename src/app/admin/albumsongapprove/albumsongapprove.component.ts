import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Router,ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-albumsongapprove',
  templateUrl: './albumsongapprove.component.html',
  styleUrls: ['./albumsongapprove.component.css']
})
export class AlbumsongapproveComponent implements OnInit , AfterViewInit {
   albumid:any;
    songaccess :boolean = true;
  constructor(private api: WebApiService, private sd: SharedDataService,
    private router: Router,private route: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'My Music Library';
    self.albumid= this.route.snapshot.params['id'];
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
  }
  ngAfterViewInit(){
    let self = this;
    self.configurePager();
  }
  private configurePager(){
      let self = this;
      self.sd.showProgressBar('Retrieving songs count');
      this.spinnerService.show();
      self.api.getAlbumwiseSongApproveCount(this.albumid).subscribe(response => {
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
        self.sd.hideProgressBar();
        this.spinnerService.hide();
      })
     
    }
    onLoadPageHandler(){
        let self = this;
          self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
          this.spinnerService.show();
          self.getSongApprove().subscribe(response => {
            self.pagedSongs = response;
            self.sd.hideProgressBar();
            this.spinnerService.hide();
          });
    }

    getSongApprove(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getAlbumwiseSongApprove(this.albumid,skip, take);
    }

}
