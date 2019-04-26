import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { Song ,NewSong} from '../../_models/songbook-life';
import { SharedDataService, CacheItemNames } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import {OwlCarousel} from 'ngx-owl-carousel';

//declare var $: any;


@Component({
  selector: 'app-review-music',
  templateUrl: './review-music.component.html',
  styleUrls: ['./review-music.component.css']
})
export class ReviewMusicComponent implements OnInit, AfterViewInit {
@ViewChild('owlElement') owlElement: OwlCarousel;
  constructor(private api: WebApiService, private sd: SharedDataService, 
    private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    self.sd.pageTitle.value = 'Review Music';

   }
    //@ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  newsong:NewSong[];
   sliderOptions = {margin: 10, dots: false, navigation: true,
   nav: true, loop: false, lazyLoad: true,scrollPerPage: true,
    responsive:{ 0:{ items: 2,slideBy: 2 }, 600:{ items: 3,slideBy: 3 }, 1000:{ items: 5,slideBy: 5 } } }; 
 

    
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    this.spinnerService.show();
        self.getSongsToReview().subscribe(response => {
          self.newsong=response;
          
          this.spinnerService.hide();
        



    


        });
        
   // this.owlElement.next([200]);
   }



  /*getSongsToReview(){
    let self = this;
    self.sd.showProgressBar('Retrieving list of songs to review');
    
      self.api.getSongsToReview()
        .subscribe(response => {
          console.log('Songs To Review', response);
          self.songs = response;
          self.sd.cacheManager.set(CacheItemNames.SongsToReview, response);

          self.sd.hideProgressBar();
        });
    
  }*/
  ngAfterViewInit(){
    let self = this;

        //self.configurePager();
      
  }
  /*private configurePager(){
      let self = this;
      this.spinnerService.show();
      self.sd.showProgressBar('Retrieving songs count');
      self.api.getSongsToReviewCount().subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
        self.sd.hideProgressBar();
      })
     
    }*/
    onLoadPageHandler(){
      let self = this;
      /*let cacheId = `Songs ${self.pager.startIndex} ${self.pager.endIndex}`;
      let songs = self.sd.cacheManager.get<Song[]>(cacheId);
      if (songs){
        self.pagedSongs = songs;
      }
      else {*/
        this.spinnerService.show();
        //self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
        self.getSongsToReview().subscribe(response => {
          this.spinnerService.hide();
          //self.pagedSongs = response;
          self.newsong=response;
          //console.log(response);
          //console.log(self.newsong);
          //self.sd.cacheManager.set(cacheId, response);
          //self.sd.hideProgressBar();
        });
      //}
      // self.pagedSongs = self.songs.slice(self.pager.startIndex, self.pager.endIndex + 1);
    }

    getSongsToReview(){
      let self = this;
      let skip = 0;
      let take = 5;
      return self.api.getSongsToReview(skip, take);
    }
   
   
}
