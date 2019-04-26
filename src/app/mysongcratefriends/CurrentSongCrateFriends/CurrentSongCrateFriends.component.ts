import { Component, OnDestroy, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { MatDialog } from '@angular/material';
import { SongcrateDialogComponent } from '../../dialogs/songcrate-dialog/songcrate-dialog.component';
import { Songcratefriendsinfo } from '../../_models/songbook-life';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Userinfo ,Song} from '../../_models/songbook-life';
@Component({
  selector: 'app-CurrentSongCrateFriends',
  templateUrl: './CurrentSongCrateFriends.component.html',
  styleUrls: ['./CurrentSongCrateFriends.component.css']
})
export class CurrentSongCrateFriendsComponent implements OnInit,AfterViewInit{
  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
  pager = new PagerConfig();
  Songcratefriendsinfo :Songcratefriendsinfo[];
  error = '';
  successerror = '';
  currentsongcrateuser='';
   crateuserinfo: Userinfo;
  @ViewChild('cratepagerCtrl') cratepagerCtrl: PagerComponent;
  cratepager = new PagerConfig();
  pagedSongs: Song[]; 
  constructor(private router: Router,private api: WebApiService, private sd: SharedDataService, private dialog: MatDialog, 
    private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    

  }


  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;

  }
  ngAfterViewInit(){
    let self = this;
    self.configurePager();
  }
  private configurePager(){
      let self = this;
      this.spinnerService.show();
      self.api.SongcratefriendsinfoCount().subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
      })
     
    }
    onLoadPageHandler(){
      let self = this;
      this.spinnerService.show();
      self.MySongcratefriendsinfo().subscribe(response => {
        this.spinnerService.hide();
          self.Songcratefriendsinfo = response;
      });
     
    }

    MySongcratefriendsinfo(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.Songcratefriendsinfo(skip, take);
    }
  sharemycrate()
  {
     let self = this;
     if(this.dialog.openDialogs.length <= 0)
     {
    let ds = self.dialog.open(SongcrateDialogComponent, {  panelClass: 'custom-dialog-container'});
    ds.afterClosed().subscribe(s => {
          this.ngOnInit(); 
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/mysongcratefriends/CurrentSongCrateFriends//']));  
    });
    }
  }
 deleteYourCrate(crateId){
   console.log(crateId);
   let self = this;
   this.spinnerService.show();
      self.api.deletesongcratefriend(crateId).subscribe(response => {
        this.spinnerService.hide();
        swal({
              title: 'Your Crate Friends Remove Successfully.',
              text: "",
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
          }).then((result) => {
              if (result.value) 
              {
                  self.configurePager();
                 self.onLoadPageHandler();
              }
        })
        
      });

 }
 showdiv(UserId){
   let self = this;
   //console.log(UserId);
   $(".songcratefriendsinfo").removeClass("active");
   $(".songcrate_row_"+UserId).addClass("active");

   this.currentsongcrateuser = UserId;
   //$( "#songcrate_data" ).toggle( "slide" );
   this.spinnerService.show();
   self.api.Songcratecurrentuserinfo(UserId).subscribe(response => {
     this.spinnerService.hide();
      self.crateuserinfo = response;
      console.log("crateuserinfo ",this.crateuserinfo);
    });
   this.crateconfigurePager(this.currentsongcrateuser);
   this.crateonLoadPageHandler(this.currentsongcrateuser);
   
 if($(".friendcrate").hasClass("Crate_open"))
        $(".friendcrate").removeClass("Crate_open").addClass("Crate_close");
 
      setTimeout(function() {
    $(".friendcrate").removeClass("Crate_close").addClass("Crate_open");
}, 500);
   
   //$(".songcrate_data").hide();
   //$(".friendcrate").addClass("Crate_open");
   //$(".songcrate_data").hide();
  // $("#songcrate_data_"+ UserId).show();

   
  /* $(".right_side_Crate").show( "slide", {direction: "right" }, 2000 );*/
    //$(".right_side_Crate").show( "slide", {direction: "up" }, 5000 );

    /*$(".right_side_Crate").animate({
                width: "toggle",
                direction: "left"
            });*/

 }


 
  private crateconfigurePager(UserId){
      let self = this;
      this.spinnerService.show();
      self.api.getcrateuserSongsCount(UserId).subscribe(response => {
        this.spinnerService.hide();

        self.cratepager = self.cratepagerCtrl.getPager(response);
        self.cratepagerCtrl.setPage(1);
      })
      
    }

    crateonLoadPageHandler(UserId){
      let self = this;
      this.spinnerService.show();
      self.getcrateuserSongs(UserId).subscribe(response => {
        this.spinnerService.hide();
          self.pagedSongs = response;
      });
      
    }

    getcrateuserSongs(UserId){
      let self = this;

      let crateskip = self.cratepager.startIndex;
      let cratetake = self.cratepager.endIndex - self.cratepager.startIndex + 1;
      
        return self.api.getcrateuserSongs(UserId,crateskip, cratetake);
     
      
    }
    hidediv(){
      $(".friendcrate").removeClass("Crate_open").addClass("Crate_close");
    }
 
}
