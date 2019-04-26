import { Component, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Song, KVP } from '../../_models/songbook-life';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-songinmycrate',
  templateUrl: './songinmycrate.component.html',
  styleUrls: ['./songinmycrate.component.css']
})
export class SonginmycrateComponent implements OnInit{

  sortbygener:string = '';
  singleSelect: null;
  
  key: string = 'test'; //set default
  reverse: boolean = false;
  sortkey: string = ''; //set default
  sortreverse: boolean = false;
  totolcount:number;

  constructor(private api: WebApiService, private sd: SharedDataService, 
    private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'My Music Library';

  }
   @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
  generlist : any;
  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  error = '';
  successerror = '';
 inpromember: boolean=false;
  
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    self.api.getProperty<KVP[]>('Genres').subscribe(response => { 
      console.log('Genres',response);
      this.generlist=response;
    });
    self.api.getpromember().subscribe(response => { 
      if (response == 1) {
        console.log(response);
         this.inpromember = true;
      }
    });
    self.configurePager(this.sortbygener,this.sortkey,this.sortreverse);
  }

  private configurePager(sortbygener,sortkey,sortreverse){

      //console.log(sortbygener,sortkey,sortreverse);

      let self = this;
      self.sd.showProgressBar('Retrieving songs count');
      this.spinnerService.show();
      self.api.getLibraryCount(sortbygener,sortkey,sortreverse).subscribe(response => {
        this.spinnerService.hide();
        this.totolcount=response;
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
        self.sd.hideProgressBar();
      });
     
    }
    onLoadPageHandler(sortbygener,sortkey,sortreverse){
      let self = this;
      self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
      this.spinnerService.show();
        self.getLibrary(sortbygener,sortkey,sortreverse).subscribe(response => {
          this.spinnerService.hide();
          self.pagedSongs = response;
         self.sd.hideProgressBar();
        });
     }

    getLibrary(sortbygener,sortkey,sortreverse){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getLibrary(skip, take, sortbygener,sortkey,sortreverse);
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
    
    GenreonChange(GenreValue) {
      //console.log(GenreValue);
      if(!GenreValue){
          this.sortbygener='';
          this.configurePager(this.sortbygener,this.sortkey,this.sortreverse);
      }else{
          this.sortbygener=GenreValue;
          this.configurePager(this.sortbygener,this.sortkey,this.sortreverse);
      }  
    }
    sort(key){
    this.key = key;
    this.reverse = !this.reverse;
    this.sortkey=key;
    this.sortreverse=this.reverse;
    //console.log(this.sortkey,this.sortreverse);
    this.configurePager(this.sortbygener,this.sortkey,this.sortreverse);

  }

}
