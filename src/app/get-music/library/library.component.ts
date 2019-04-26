import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit , AfterViewInit {

  constructor(private api: WebApiService, private sd: SharedDataService, 
    private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'My Music Library';

  }
   @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  error = '';
  successerror = '';
  ngOnInit() {
    let self = this;

  }
  ngAfterViewInit(){
    let self = this;
    
          self.configurePager();
      
  }
  private configurePager(){
      let self = this;
      this.spinnerService.show();
      self.sd.showProgressBar('Retrieving songs count');
      self.api.getLibraryCount().subscribe(response => {
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
      return self.api.getLibrary(skip, take);
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
