import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, CacheItemNames } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS } from '../../material-design-module';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Addtolisteningroom  } from '../../_services/song-addinlisteningroom.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-find-music',
  templateUrl: './find-music.component.html',
  styleUrls: ['./find-music.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class FindMusicComponent implements OnInit, AfterViewInit {
  searchname: string ='';
  constructor(private api: WebApiService, private sd: SharedDataService,private router: Router, 
    private spinnerService: Ng4LoadingSpinnerService, 
    private route: ActivatedRoute,private dataService:Addtolisteningroom) { 
    let self = this;
    self.sd.pageTitle.value = 'Find Music';

  }

  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
 

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
         this.searchname = params['searchval'];
         this.configurePager(this.searchname);
        //this.filterItem(this.search);
    });
  } 

  ngAfterViewInit(){
    let self = this;
    self.configurePager(this.searchname);
      
  }
    private configurePager(searchname){
      let self = this;
      this.spinnerService.show();
      self.sd.showProgressBar('Retrieving songs count');
      self.api.getSongsCount(searchname).subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
        self.sd.hideProgressBar();
      })
      
    }

    onLoadPageHandler(searchname){
      console.log(searchname);
      let self = this;
      this.spinnerService.show();
       self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
        self.getSongs(searchname).subscribe(response => {
          this.spinnerService.hide();
          self.pagedSongs = response;
          self.sd.hideProgressBar();
        });
      
    }

    getSongs(searchname){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getSongs(searchname,skip, take);
    }
    browssongclass(){
    
        let songids: any = this.dataService.getData();
        if(songids){
          this.api.addmultiplesonginuserlisteningroom(songids).subscribe(response => {
              this.spinnerService.hide();
              localStorage.removeItem('songlisteningroom');
              swal(
                'Song has been added To ListeningRoom.',
                "Selected Song has been added to your Listeningroom.Please Give Review And Rating.",
                'success'
              );
              this.onLoadPageHandler(this.searchname);
          });
        }else{
          swal(
            'Please Select Any Checkbox.',
            "When You select Checkbox then after add to Listening Room.",
            'warning'
          );
        }
      
    }
    clearallselection(){
      localStorage.removeItem('songlisteningroom');
      //this.configurePager(this.searchname);
      this.onLoadPageHandler(this.searchname);
    }
    /*filterItem(searchname){

      if(!searchname) this.configurePager(searchname); //when nothing has typed
       this.pagedSongs = Object.assign([], this.pagedSongs).filter(
        pagedSong => pagedSong.SongTitle.toLowerCase().indexOf(searchname.toLowerCase()) > -1 ||
                     pagedSong.Genre.toLowerCase().indexOf(searchname.toLowerCase()) > -1 
      )
       this.pager = new PagerConfig();

    }*/
    
}
