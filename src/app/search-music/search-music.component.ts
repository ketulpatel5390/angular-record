import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../_models/songbook-life';
import { WebApiService } from '../_services/web-api.service';
import { SharedDataService, CacheItemNames } from '../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../shared/pager/pager.component';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS } from '../material-design-module';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-search-music',
  templateUrl: './search-music.component.html',
  styleUrls: ['./search-music.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class SearchMusicComponent implements OnInit{
  search: string;
  constructor(private api: WebApiService, private sd: SharedDataService, private router: Router, 
    private route: ActivatedRoute, private dialog: MatDialog,private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Find Music';
    //self.search= this.route.snapshot.params['search'];
    

  }

  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  
  ngOnInit() {
    let self = this;
    this.route.params.subscribe((params: Params) => {
         self.search = params['searchval'];
          self.configurePager();
    });
          self.configurePager();
    } 

    private configurePager(){
      let self = this;
      console.log("self.search",self.search);
      //alert(self.search.value);
      self.sd.showProgressBar('Retrieving songs count');
      if(self.search){
        this.spinnerService.show();
        self.api.getfrontSongsCount(self.search).subscribe(response => {
          this.spinnerService.hide();
          self.pager = self.pagerCtrl.getPager(response);
          self.pagerCtrl.setPage(1);
          self.sd.hideProgressBar();
        })
      }else{
        this.spinnerService.show();
        self.api.getfrontallSongsCount().subscribe(response => {
          this.spinnerService.hide();
          self.pager = self.pagerCtrl.getPager(response);
          self.pagerCtrl.setPage(1);
          self.sd.hideProgressBar();
        })
      }
     
      //self.pager = self.pagerCtrl.getPager(self.songs.length);
      //self.pagerCtrl.setPage(1);
    }

    onLoadPageHandler(){
      let self = this;
      
        self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
        this.spinnerService.show();
        self.getSongs().subscribe(response => {
          this.spinnerService.hide();
          self.pagedSongs = response;
         self.sd.hideProgressBar();
        });
      }

    getSongs(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      if(self.search){
        return self.api.getfrontSongs(skip, take,self.search);
      }else{
        return self.api.getallfrontSongs(skip, take);
      }
      
    }
    
    searchitemss(searchname){
        console.log(searchname);
       this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/search',{ searchval: searchname}]));
       
    }
    filterItem(searchname){

      if(!searchname) this.configurePager(); //when nothing has typed
       this.pagedSongs = Object.assign([], this.pagedSongs).filter(
        pagedSong => pagedSong.SongTitle.toLowerCase().indexOf(searchname.toLowerCase()) > -1 || pagedSong.Genre.toLowerCase().indexOf(searchname.toLowerCase()) > -1
      )
       this.pager = new PagerConfig();

    }
    userlogin(){
        let self = this;
        let d = self.dialog.open(LoginDialogComponent, { panelClass: 'custom-dialog-container',
                                                         backdropClass: 'custom-dialog-container-login'
                                                       });
        d.disableClose = true;

       d.backdropClick().subscribe(onclick => {
         console.log("onclick Event");
          d.close();
        });
   }
}
