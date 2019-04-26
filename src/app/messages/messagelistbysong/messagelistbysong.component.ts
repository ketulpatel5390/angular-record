import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import { WebApiService } from '../../_services/web-api.service';
import { ObservableMedia } from '@angular/flex-layout';
import { AlertService} from '../../_services/alert.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { environment } from '../../../environments/environment';
import swal from 'sweetalert2';
import { MessageDetails} from '../../_models/songbook-life';
import { Router,ActivatedRoute } from '@angular/router';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { SongMessageDialogComponent } from '../../dialogs/song-message-dialog/song-message-dialog.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
@Component({
  selector: 'app-messagelistbysong',
  templateUrl: './messagelistbysong.component.html',
  styleUrls: ['./messagelistbysong.component.css']
})
export class MessagelistbysongComponent implements OnInit {


  //public routerLinkVariable = "/editprofile";
  messagelist : MessageDetails[];
  messagelists : MessageDetails;
  song_id : any;
  songtitle : any;
  constructor(private location: Location,
     private router: Router,
      private sd: SharedDataService, 
      private api: WebApiService, 
      private media: ObservableMedia,
       private dialog: MatDialog,private route: ActivatedRoute,
       private alertService: AlertService, private spinnerService: Ng4LoadingSpinnerService
      ) { 
    let self = this;
    //debugger;
    self.sd.pageTitle.value = 'My Account';
    
    
  }
 

  ngOnInit() {
    let self = this;
    self.song_id= this.route.snapshot.params['id'];
    this.spinnerService.show();
        this.api.getsongmessagedetails(self.song_id).subscribe(response => {
          this.spinnerService.hide();
          self.messagelists = response;
         
         self.sd.hideProgressBar();
        });
        this.spinnerService.show();
   this.api.messagelistbyid(this.song_id).subscribe(response =>{
      this.messagelist = response;
      // console.log(this.messagelist);
    self.sd.hideProgressBar();
        });
  }
  sendmesage(Rec_UserId){
    let self = this;
    //console.log("Send Message For the Song ",self.song.SongId);
    //window.scrollTo(0, 0);
    let d = self.dialog.open(SongMessageDialogComponent, { panelClass: 'custom-dialog-container' , disableClose: true,
       data: { Rec_UserId: Rec_UserId, SongId : this.song_id } });
     d.afterClosed().subscribe(response => {
       //this.ngOnInit();
       this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
this.router.navigate([this.location.path()]));
      });
  }

}
