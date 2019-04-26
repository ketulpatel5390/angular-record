import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Song,Albuminfo,Siteconfiginfo } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, MusicEvent, MusicEventActions  } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { Router,ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UploadSongDialogComponent } from '../../dialogs/upload-song-dialog/upload-song-dialog.component';
import { EditSongDialogComponent } from '../../dialogs/edit-song-dialog/edit-song-dialog.component';
import { DistributeSongDialogComponent } from '../../dialogs/distribute-song-dialog/distribute-song-dialog.component';
import { SongUploadService, SongWithData } from '../../_services/song-upload.service';
import { AlertDialogComponent } from '../../dialogs/alert-dialog/alert-dialog.component';
import {environment} from '../../../environments/environment';
import { UploadAlbumDialogComponent } from '../../dialogs/upload-album-dialog/upload-album-dialog.component';
import { AlbumdetailDialogComponent } from '../../dialogs/albumdetail-dialog/albumdetail-dialog.component';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import swal from 'sweetalert2';
@Component({
  selector: 'app-AlbumReports',
  templateUrl: './AlbumReports.component.html',
  styleUrls: ['./AlbumReports.component.css']
})
export class AlbumReportsComponent implements OnInit, AfterViewInit {
  albumid:any;
  nalbumid:any;
  albumtype:any;
   albumnid:any;
  albumstatus:any;
  albuminfo: Albuminfo;
  albumcount:any;
   siteconfig:Siteconfiginfo;
   siteconfiglimit : any;
  constructor(private location: Location,private api: WebApiService,private dialog: MatDialog, private sd: SharedDataService,
    private router: Router, private sus: SongUploadService,
    private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService ) { 
    let self = this;
    self.sd.pageTitle.value = 'My Music Portfolio';
     self.nalbumid= this.route.snapshot.params['id'];
     
  }
 @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
  totalsongcount : any;
  

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  error = '';
  inpromember: boolean=false;
  canPlay: boolean = true;
  canPause: boolean;

  @Input() inLibrary = true;
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    //this.albumid= this.route.snapshot.params['id'];
    //this.nalbumid= this.route.snapshot.params['id'];
    console.log("this.albumid",this.nalbumid);

    let self = this;

    this.spinnerService.show();
    self.api.getpromember().subscribe(response => { 
      this.spinnerService.hide();
      if (response) {
         this.inpromember=true;
      }
    });
    this.spinnerService.show();
    self.api.getalbumdetail(this.nalbumid).subscribe(response => { 
     
      if (response) {
         this.albuminfo=response;
         this.albumtype=response.album_type;
         this.albumstatus=response.album_status;
        //this.spinnerService.show();
         self.api.albumsonguploadsCountByUser(response.album_id,response.album_type).subscribe(response => {
          // this.spinnerService.hide();
          self.albumcount = response;

           console.log(this.albumcount);
        });
        // this.spinnerService.show();
        this.api.getinfoSiteconfig().subscribe(response => {
          
          this.siteconfig = response;
          if(this.albumtype == 'EP'){
            this.siteconfiglimit= response.ep_limit;
          }else if(this.albumtype == 'Album'){
            this.siteconfiglimit= response.album_limit;
          }
          this.spinnerService.hide();
          });
         //this.spinnerService.hide();

      }
    });
    this.spinnerService.show();
    self.api.songuploadsRemainingCountByUser().subscribe(response => {
      this.spinnerService.hide();
          self.totalsongcount = response;
    });
    /*self.sus.songToEdit.onPropertyChanged.subscribe(s => {
      if (s) self.editSong(s);
    });

    self.sus.songToDistribute.onPropertyChanged.subscribe(s => {
      if (s) self.distributeSong(s);
    });*/



    self.sd.onMusicEvent.subscribe(response => {
      if (response) {
        switch(response.action) {
          case MusicEventActions.Play:
              self.canPlay = true;
              self.canPause =  false;
              break;
          case MusicEventActions.Stop:
            self.canPlay = true;
            self.canPause =  false;
            break;
          case MusicEventActions.Pause:
            self.canPlay = true;
            self.canPause = false;
            break;
          
        }
      }
    });
     
  }

  ngAfterViewInit(){
    let self = this;
    //self.albumid= this.route.snapshot.params['id'];
    //self.nalbumid= this.route.snapshot.params['id'];
    
          self.configurePager();
      
  }
   configurePager(){
      let self = this;
      self.sd.showProgressBar('Retrieving songs count');
      
      this.spinnerService.show();
      self.api.getPortfolioCountbyalbumid(this.nalbumid).subscribe(response => {
        this.spinnerService.hide();
        self.pager = self.pagerCtrl.getPager(response);
        self.pagerCtrl.setPage(1);
        self.sd.hideProgressBar();
      })
     
    }
    onLoadPageHandler(nalbumid){
      let self = this;
     this.spinnerService.show();
        self.sd.showProgressBar(`Retrieving songs ${self.pager.startIndex} to ${self.pager.endIndex}`);
        self.getPortfolio(nalbumid).subscribe(response => {
          this.spinnerService.hide();
          self.pagedSongs = response;
          self.sd.hideProgressBar();
        });
     
    }

    getPortfolio(nalbumid){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getPortfoliobyalbumid(nalbumid,skip, take);
    }
    editYourSong(songid){
      let self = this;
      console.log("Edit Your Song.")
      this.router.navigate(['/shareMusic/editsong',{ id: songid}]);
    }
    deleteYourSong(songid){
       let self = this;
       if(self.albumcount > 1){
          swal({
              title: 'Are you sure you want to delete this Song?',
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
              if (result.value) 
              {
                  this.spinnerService.show();
                  self.api.deletesongs(songid).subscribe(response => {
                    this.spinnerService.hide();
                    swal(
                    'Deleted!',
                    'Song has been deleted.',
                    'success'
                  );
                   self.ngOnInit(); 
                   self.configurePager();
                   self.onLoadPageHandler(this.nalbumid);
                  });
              }
        })
      }else{
          swal({
              title: 'Deleting this song will remove Album also Do You want to continue?',
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) 
            {
                this.spinnerService.show();
                self.api.deletesongswithalbum(songid,this.nalbumid).subscribe(response => {
                  this.spinnerService.hide();
                  swal(
                  'Deleted!',
                  'Song and Album has been deleted.',
                  'success'
                );
                  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/shareMusic/portfolio']));
                  //self.ngOnInit();
                  //self.configurePager();
                });
            }
          })
      } 
      

      
       
    }
    
  private distributeSong(song: SongWithData){
    let self = this;
    //console.log('Opening song distribution dialog', song);
     //window.scrollTo(0, 0);
    if(self.dialog.openDialogs.length <= 0){
    self.sus.songToDistribute.value = null;
    let d = self.dialog.open(DistributeSongDialogComponent, {
       panelClass: 'custom-dialog-container',
      data: song,
      disableClose: true,

    });
    d.afterClosed().subscribe(s => {
      console.log('Song distributed');
      //self.alertdialog();
     // alert(123);
     
     swal({
              title: 'Your Song Successfully Uploaded!',
              text: "",
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) 
            {
                self.ngOnInit(); 
               self.configurePager();
               self.onLoadPageHandler(this.nalbumid);
               //self.onLoadPageHandler(this.nalbumid);
                //window.location.reload();
            }
          })
      
           
                 

    });
  }
 }

  
  private editSong(song: SongWithData)
  {
    let self = this;
     //window.scrollTo(0, 0);
    //console.log('Opening song edit dialog', song);
    if(self.dialog.openDialogs.length <= 0){
    self.sus.songToEdit.value = null;
    let d = self.dialog.open(EditSongDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: song,
      disableClose: true,

    });
    d.afterClosed().subscribe(s => { 
      //self.sus.distributeSong(s);
      if(s){
        self.distributeSong(s);
      }
      
    });
  }
  }

  
  uploadSongss(albumid)
  {
     //window.scrollTo(0, 0);
      let self = this;
      console.log("albumcount",self.albumcount);
      console.log("siteconfiglimit",this.siteconfiglimit);
      console.log("totalsongcount",this.totalsongcount);
      if( parseInt(self.albumcount) < parseInt(this.siteconfiglimit) && parseInt(this.totalsongcount) > 0)
      {
        if(this.dialog.openDialogs.length <= 0)
        {
            let upload = self.dialog.open(UploadSongDialogComponent , {  
            data : { albumId : albumid },
            hasBackdrop: true,
            disableClose: true,
                backdropClass: 'cdk-overlay-transparent-backdrop', panelClass: 'custom-dialog-container'});
            upload.afterClosed().subscribe(response => {
              if (response){
                self.editSong(response);
              }
            });
        }
      }else{
        this.albumuploadlimitdialog();
      }
    }
  onPlayHandler(song){
    let self = this;
     let baseulr=environment.baseulrs;

     let artistimage= baseulr + `${baseulr.endsWith('/') ? '' : '/'}images/artist_images/` + song.artist_image;

      //self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;

    self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Play, song, artistimage,self.inLibrary));
    $(".songplay_").show();
    $(".songpause_").hide();
    $("#songplay_"+song.SongId).hide();
    $("#songpause_"+song.SongId).show();
    
  }
  onStopHandler(song){
    let self = this;
    let baseulr=environment.baseulrs;

     let artistimage= baseulr + `${baseulr.endsWith('/') ? '' : '/'}images/artist_images/` + song.artist_image;

    self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Stop, song, artistimage,self.inLibrary));
    $(".songplay_").show();
    $(".songpause_").hide();
    $("#songplay_"+song.SongId).show();
    $("#songpause_"+song.SongId).hide();

  }
   albumuploadlimitdialog()
   {
      window.scrollTo(0, 0);
      let d = this.dialog.open(AlertDialogComponent , {  
        hasBackdrop: true,
        disableClose: true,
        backdropClass: 'cdk-overlay-transparent-backdrop', 
        panelClass: 'custom-dialog-container',
        data: { title : "Your Album Upload Limit is Finish or Total song upload limit is finish." },
      });
      d.afterClosed().subscribe(response => {
        this.ngOnInit();
        this.ngAfterViewInit();
      });
  }
  finishalbum(albumid){
    console.log("finished album",albumid);
      this.spinnerService.show();
      this.api.finishsongswithalbumid(albumid).subscribe(response => {
        this.spinnerService.hide();
        this.ngOnInit();
        this.configurePager();
      }); 

  }

}

