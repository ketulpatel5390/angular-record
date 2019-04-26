import { Component, OnDestroy, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Song } from '../../_models/songbook-life';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Router,ActivatedRoute } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-albuminmycrate',
  templateUrl: './albuminmycrate.component.html',
  styleUrls: ['./albuminmycrate.component.css']
})
export class AlbuminmycrateComponent implements OnInit, AfterViewInit {
  albumid:any;
  constructor(private api: WebApiService, private sd: SharedDataService,
    private router: Router,private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'My Music Library';
    self.albumid= this.route.snapshot.params['id'];

  }
   @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  error = '';
  successerror = '';
  inpromember: boolean=false;
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    self.api.getpromember().subscribe(response => { 
      if (response == 1) {
        console.log(response);
         this.inpromember = true;
      }
    });

  }
  ngAfterViewInit(){
    let self = this;
    
          self.configurePager();
      
  }
  private configurePager(){
      let self = this;
      self.sd.showProgressBar('Retrieving songs count');
      this.spinnerService.show();
      self.api.getAlbumLibraryCount(this.albumid).subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
        self.sd.hideProgressBar();
      })
     
    }
    onLoadPageHandler(){
      let self = this;
      
        self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
        this.spinnerService.show();
        self.getLibrary().subscribe(response => {
          this.spinnerService.hide();
          self.pagedSongs = response;
          self.sd.hideProgressBar();
        });
     }

    getLibrary(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getAlbumLibrary(this.albumid,skip, take);
    }
    sharemycrate(username){
      console.log("username",username);
      if(username == ""){
        this.error = "Please Enter UserName For Share Your Song Crate.";
      }else
      {
        this.spinnerService.show();
        this.api.sharemycrate(username).subscribe(response => {
          this.spinnerService.hide();
          console.log("username",response);
          if(response == 1){
            this.successerror = "Successfully Share Your Song Crate With " + username + " User";
          }else if(response == 2){
            this.error = "Do Not Share Your Song Crate To Current User.";
          }else{
            this.error = "UserName Does Not exist Please Enter Valid UserName For Share Your Song Crate.";
          }
        });
      }

    }

}
