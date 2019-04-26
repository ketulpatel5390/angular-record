import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { EditSong,Song,KVP,SongFeedbackinfo } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import { Router } from '@angular/router';
import { SongMessageDialogComponent } from '../../dialogs/song-message-dialog/song-message-dialog.component';
import { MatDialog } from '@angular/material';

import { GeolocationMessageDialogComponent } from '../../dialogs/geolocation-message-dialog/geolocation-message-dialog.component';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PlatformLocation,Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-SongsReports',
  templateUrl: './SongsReports.component.html',
  styleUrls: ['./SongsReports.component.css']
})
export class SongsReportsComponent implements OnInit,AfterViewInit{
  editsong: EditSong;
  pagedSongs: SongFeedbackinfo[];
  pager = new PagerConfig();
  editsongid:any;
  songreviewedcount:any;
  songcrateaddedcount:any; 
  songfavouriteaddedcount:any;
  songlisteningroomcount:any;
  songaveragecountcount:any;
  inpromember: boolean=false;
  groupids=[];
  individualids=[];
  rating0;
  rating1;
  rating2;
  rating3;
  rating4;
  rating5; 
  songtitle:any;
  albumName:any;
  artistname:any;
  Genre:any;
  Label:any;
  State:any;
  Country:any;
  Website:any;

  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
  constructor(private router: Router,private location: PlatformLocation,private _location: Location,
    private dialog: MatDialog,private api: WebApiService, private sd: SharedDataService,
    private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Edit Song';
     self.editsongid= this.route.snapshot.params['id'];

      let baseHref = self.location.getBaseHrefFromDOM();
   console.log(baseHref);
   let baseulrs=environment.baseulrs;
    //self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    self.rating0 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/Star_rating_0_of_5.png`;
    self.rating1 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/Star_rating_1_of_5.png`;
    self.rating2 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/Star_rating_2_of_5.png`;
    self.rating3 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/Star_rating_3_of_5.png`;
    self.rating4 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/Star_rating_4_of_5.png`;
    self.rating5 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/Star_rating_5_of_5.png`; 

  }
  ngOnInit() {
    let self = this;
    this.spinnerService.show();
    self.api.getsongdetails(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.editsong = response;
      self.songtitle =response.SongTitle;
      self.albumName= response.AlbumName;
      self.artistname=response.ArtistName;
      self.Genre=response.Genre;
      self.Label=response.Label;
      self.State=response.State;
      self.Country=response.Country;
      self.Website=response.Website;
     // console.log(self.editsong);
    });
    this.spinnerService.show();
    self.api.adminsongreviewedcount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songreviewedcount = response;
    });
    this.spinnerService.show();
    self.api.adminsongaveragecountcount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songaveragecountcount = response;
    });

    this.spinnerService.show();
    self.api.adminsonglisteningroomcount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songlisteningroomcount = response;
    });


    this.spinnerService.show();
    self.api.adminsongcrateaddedcount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songcrateaddedcount = response;
    });
    this.spinnerService.show();
    self.api.adminsongfavouriteaddedcount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songfavouriteaddedcount = response;
    });
    
    this.spinnerService.show();
    self.api.admingetSongFeedbackinfo(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
          self.pagedSongs = response;
          self.sd.hideProgressBar();

    });
   
  }
   ngAfterViewInit(){
    let self = this;
       
  }

  backClicked() {
    this._location.back();
  }

}
