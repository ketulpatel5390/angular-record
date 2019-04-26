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
import { PlatformLocation } from '@angular/common';
import { environment } from '../../../environments/environment';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-SongReports',
  templateUrl: './SongReports.component.html',
  styleUrls: ['./SongReports.component.css']
})
export class SongReportsComponent implements OnInit,AfterViewInit{
  editsong: EditSong;
  pagedSongs: SongFeedbackinfo[];
  pager = new PagerConfig();
  editsongid:any;
  songreviewedcount:any;
  songcrateaddedcount:any; 
  songfavouriteaddedcount:any;
  songdestributioncount:any;
  songAvgrating:any;
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
  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
  constructor(private router: Router,private location: PlatformLocation,
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
    localStorage.removeItem('songlisteningroom');
    let self = this;
    this.spinnerService.show();
    self.api.editsongbyuser(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.editsong = response;
      self.songtitle =response.SongTitle;
      self.albumName= response.AlbumName;
      self.artistname=response.ArtistName;
     // console.log(self.editsong);
    });
    this.spinnerService.show();
    self.api.songreviewedcount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songreviewedcount = response;
    });
    this.spinnerService.show();
    self.api.songcrateaddedcount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songcrateaddedcount = response;
    });
    this.spinnerService.show();
    self.api.songfavouriteaddedcount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songfavouriteaddedcount = response;
    });
    this.spinnerService.show();
    self.api.songdestributioncount(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songdestributioncount = response;
    });
    self.api.songAvgrating(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.songAvgrating = response;
    });
    this.spinnerService.show();
    self.api.getpromember().subscribe(response => { 
      this.spinnerService.hide();
      if (response) {
         this.inpromember=true;
      }
    });
    this.spinnerService.show();
    self.api.getSongFeedbackinfo(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
          self.pagedSongs = response;
          self.sd.hideProgressBar();

    });
   
  }
   ngAfterViewInit(){
    let self = this;
    
         // self.configurePager();
      
  }
  /*private configurePager(){
      let self = this;
      self.api.SongFeedbackinfocount(self.editsongid).subscribe(response => {
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
      })
     
    }
    onLoadPageHandler(){
      let self = this;
      self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
        
        self.getSongFeedbackinfo().subscribe(response => {
          self.pagedSongs = response;
          self.sd.hideProgressBar();

        });
     
    }

    getSongFeedbackinfo(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getSongFeedbackinfo(self.editsongid,skip, take);
    }*/
    SendMesageToIndividual(Rec_UserId){
      console.log("Rec_UserId",Rec_UserId);
      let d = this.dialog.open(SongMessageDialogComponent, {
       panelClass: 'custom-dialog-container',
       data: { Rec_UserId: Rec_UserId, SongId : this.editsongid },
       
      });
      d.afterClosed().subscribe(s => {
       this.ngOnInit();
      });

    }
    SendGroupMesage(){
      
      if(this.groupids.length > 0){
        console.log("Group Message",this.groupids);
        let d = this.dialog.open(SongMessageDialogComponent, {
         panelClass: 'custom-dialog-container',
         data: { Rec_UserId: this.groupids.toString(), SongId : this.editsongid },
         
        });
        d.afterClosed().subscribe(s => {
          this.ngOnInit();
        });
      }else{
        alert("Please Select Users Checkbox");
      }
    }
    updateCheckedOptions(UserId,event){
      console.log("Group Message",UserId,event);
      if(event.target.checked){
        this.groupids.push(UserId);
      }
      else if (!event.target.checked){
        let indexx = this.groupids.indexOf(UserId);
        this.groupids.splice(indexx,1);
      }
     
    }
    SendgeographicalMesage(){
      this.editsongid;
      
      let d = this.dialog.open(GeolocationMessageDialogComponent, {
       panelClass: 'custom-dialog-container',
       data: { SongId : this.editsongid },
       
      });
      
      d.backdropClick().subscribe(() => {
        // Close the dialog
        d.close();
      });
      d.afterClosed().subscribe(s => {
       this.ngOnInit();
      });

    }
    exportdatahtmltopdf(){
      this.spinnerService.show();
      this.api.exportdatatopdf(this.editsongid);
      this.spinnerService.hide();
/*      
      $(".messsagenone").remove();
      $(".groupnone").remove();
         
      var pdf = new jsPDF('p', 'mm', 'a4');
    let source = $('#exportreports').html();
var specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        '#bypassme': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
        }
    };
    var margins = {
        top: 10,
        bottom: 10,
        left: 10,
        width: 1200
    };
    pdf.fromHTML(
    source, // HTML string or DOM elem ref.
    margins.left, // x coord
    margins.top, { // y coord
        //'width': margins.width, // max width of content on PDF
        'elementHandlers': specialElementHandlers
    },

    function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF 
        //          this allow the insertion of new lines after html
        pdf.save('Test.pdf');
    }, margins);

    window.location.reload();*/
    
      
    }

  

}
