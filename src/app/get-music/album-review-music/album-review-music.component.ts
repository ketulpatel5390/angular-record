import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { Song,Albuminfo } from '../../_models/songbook-life';
import { SharedDataService, CacheItemNames } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {environment} from '../../../environments/environment';
@Component({
  selector: 'app-album-review-music',
  templateUrl: './album-review-music.component.html',
  styleUrls: ['./album-review-music.component.css']
})
export class ReviewMusicalbumComponent implements OnInit, AfterViewInit {
albumid:any;
albuminfo: Albuminfo;
imageSource: string;
  constructor(private api: WebApiService, private sd: SharedDataService,private router: Router, 
    private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    self.sd.pageTitle.value = 'Review Music';
    self.albumid= this.route.snapshot.params['id'];
   }
    @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    let baseulrs=environment.baseulrs;
    this.spinnerService.show();
    self.api.getsongalbumdetail(this.albumid).subscribe(response => { 
      this.spinnerService.hide();
      if (response) {
         this.albuminfo=response;
         self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}`+ response.album_image_path +'/'+response.album_image;
      }
    });
  
  }


  ngAfterViewInit(){
    let self = this;
    
          self.configurePager();
      
  }
  private configurePager(){
      let self = this;
      this.spinnerService.show();
      self.sd.showProgressBar('Retrieving songs count');
      self.api.getalbumSongsToReviewCount(this.albumid).subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
        self.sd.hideProgressBar();
      })
     
    }
    onLoadPageHandler(){
      let self = this;
       this.spinnerService.show();
        self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
        self.getSongsToReview().subscribe(response => {
          this.spinnerService.hide();
          
         self.sd.hideProgressBar();
         if(response.length > 0){
            self.pagedSongs = response;
          }else{
            this.router.navigate(['/getMusic/reviewMusic']);
          }
        });
     }

    getSongsToReview(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getalbumSongsToReview(this.albumid,skip, take);
    }
}
