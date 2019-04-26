import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { Song } from '../../_models/songbook-life';
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
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import swal from 'sweetalert2';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  constructor(private api: WebApiService,private dialog: MatDialog, private sd: SharedDataService,
    private router: Router, private sus: SongUploadService , private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'My Music Portfolio';

  }
 @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;
  totalsongcount : any;
  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  pagedSongsEp: Song[];
  pagedSongsAlbum: Song[];
  error = '';
   inpromember: boolean=false;
   canPlay: boolean = true;
  canPause: boolean;
  @Input() inLibrary = true;
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    this.spinnerService.show();
    self.api.getpromember().subscribe(response => { 
      this.spinnerService.hide();
      if (response) {
         this.inpromember=true;
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
    
        //  self.configurePager();
        this.spinnerService.show();
        self.api.getPortfolionew().subscribe(response => {
        self.pagedSongs = response;
        this.spinnerService.hide();
        });
        this.spinnerService.show();
        self.api.getPortfolioEp().subscribe(response => {
        self.pagedSongsEp = response;
        this.spinnerService.hide();
        })
        this.spinnerService.show();
        self.api.getPortfolioAlbum().subscribe(response => {
        self.pagedSongsAlbum = response;
        this.spinnerService.hide();
        })
      
  }
   configurePager(){
      let self = this;
      self.sd.showProgressBar('Retrieving songs count');
      this.spinnerService.show();
      self.api.getPortfolioCount().subscribe(response => {
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
        self.getPortfolio().subscribe(response => {
          this.spinnerService.hide();
          self.pagedSongs = response;
          self.sd.hideProgressBar();
        });
      }

    getPortfolio(){
      let self = this;
      let skip = self.pager.startIndex;
      let take = self.pager.endIndex - self.pager.startIndex + 1;
      return self.api.getPortfolio(skip, take);
    }
    editYourSong(songid){
      let self = this;
      console.log("Edit Your Song.")
      this.router.navigate(['/shareMusic/editsong',{ id: songid}]);
    }
    deleteYourSong(songid,status){
       let self = this;
       if(status == "QA"){
         swal({
              title: "Are you sure? You want to delete song.",
              text: "",
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
                    'Song has been deleted.',
                    "",
                    'success'
                    );
                   self.ngOnInit();
                   self.ngAfterViewInit();
                  });
              }
              
          });
       }else{

       swal({
              title: "The song will be removed from user's listening rooms and won't be distributed any further.",
              text: "The song will also not show up in searches and will no longer accept any feedback.",
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
                if(this.inpromember){
                    swal(
                    'Song has been deleted.',
                    "Completely remove the song from Record Drop they'll need to contact an admin.",
                    'success'
                    );

                }else{
                        swal({
                            title: "Song has been deleted.",
                            text: "",
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok'
                        }).then((result) => {
                            if (result.value) 
                            {
                                swal({
                                      title: "You want to retain the reports",
                                      text: "",
                                      type: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'Yes'
                                  }).then((result) => {
                                      if (result.value) 
                                      {
                                        swal(
                                            'Warning!',
                                            'You need to upgrade your account.',
                                            'warning'
                                          ); 
                                      }
                                }); 
                            }
                        });
                  }
                  
                  
                   /*self.ngOnInit(); 
                   self.configurePager();
                   self.onLoadPageHandler();*/
                   self.ngOnInit();
                   self.ngAfterViewInit();
                  });
              }
        })
      }
    }
    
  private distributeSong(song: SongWithData){
    let self = this;
    //console.log('Opening song distribution dialog', song);
    if(self.dialog.openDialogs.length <= 0)
    {
    self.sus.songToDistribute.value = null;
    let d = self.dialog.open(DistributeSongDialogComponent, {
       panelClass: 'custom-dialog-container',
      data: song,
      disableClose: true
    });
    d.afterClosed().subscribe(s => {
      //console.log('Song distributed', s);
      //self.alertdialog();
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
               self.ngAfterViewInit();
              
            }
          })
      

    });
   }
  }
 
  
  private editSong(song: SongWithData){
    let self = this;
    //console.log('Opening song edit dialog', song);

    self.sus.songToEdit.value = null;
    if(self.dialog.openDialogs.length <= 0)
    {
    let d = self.dialog.open(EditSongDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: song,
      disableClose: true
    });
    d.afterClosed().subscribe(s => { 
       if(this.inpromember){
        //self.sus.distributeSong(s);
        if(s){
          self.distributeSong(s);
        }
        
      }else{
        //self.alertdialog();
         swal(
            'Your Song Successfully Uploaded!',
            '',
            'success'
          );
           /*self.ngOnInit(); 
           self.configurePager();
           self.onLoadPageHandler();*/
           self.ngOnInit();
           self.ngAfterViewInit();
      }
    });
    }
  }
  uploadMusic()
  {
    let self = this;
    if(this.totalsongcount > 0)
    {
      
        if(self.dialog.openDialogs.length <= 0){
        let d = self.dialog.open(UploadAlbumDialogComponent , {  hasBackdrop: true,disableClose: true,
                  backdropClass: 'cdk-overlay-transparent-backdrop', panelClass: 'custom-dialog-container'});
        d.afterClosed().subscribe(response => {
           console.log(response);
          if (response == 'Single Release')
          {
            let upload = self.dialog.open(UploadSongDialogComponent , {  
              data : { albumId : '' },
              hasBackdrop: true,
              disableClose: true,
                  backdropClass: 'cdk-overlay-transparent-backdrop', panelClass: 'custom-dialog-container'});
              upload.afterClosed().subscribe(response => {
                if (response){
                  self.editSong(response)
                }
              });
          }else if(response == 'EP' || response == 'Album'){

            let album = self.dialog.open(AlbumdetailDialogComponent , {  
                  data : { albumtype : response },
                  hasBackdrop: true,
                  disableClose: true,
                  backdropClass: 'cdk-overlay-transparent-backdrop', 
                  panelClass: 'custom-dialog-container'
              });
              album.afterClosed().subscribe(response => {
                console.log(response);
                if (response){
                  let redirecturl='/shareMusic/getAlbumbyId/'+response+'';
                  //this.router.navigate(['/shareMusic/getAlbumbyId',response]);
                  //this.router.navigateByUrl(redirecturl);
                  //window.location.href = (redirecturl);
                  var currentUrl = this.router.url;
                this.router.navigateByUrl(currentUrl).then(() => this.router.navigateByUrl(redirecturl));
                   /*this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['/shareMusic/getAlbumbyId',response]));*/
                 
                }
              });
          }

        });

        }
    }else{
       this.songuploadlimitdialog();
    }   
  }
  uploadMusicsingle()
  {
    let self = this;
    if(this.totalsongcount > 0)
    {
        if(self.dialog.openDialogs.length <= 0){
        let upload = self.dialog.open(UploadSongDialogComponent , { 
                  data : { albumId : '' },
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
      this.songuploadlimitdialog();
    }    
  }

  uploadSongss(albumid)
  {
      let self = this;
      console.log("albumid",albumid);
      if(self.dialog.openDialogs.length <= 0){
      let upload = self.dialog.open(UploadSongDialogComponent , {  
          data : { albumId : albumid },
          hasBackdrop: true,
          disableClose: true,
              backdropClass: 'cdk-overlay-transparent-backdrop', panelClass: 'custom-dialog-container'});
          upload.afterClosed().subscribe(response => {
            if (response){
            }
          });
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
   songuploadlimitdialog()
   {
      let d = this.dialog.open(AlertDialogComponent , {  
        hasBackdrop: true,
        disableClose: true,
        backdropClass: 'cdk-overlay-transparent-backdrop', 
        panelClass: 'custom-dialog-container',
        data: { title : "Your Song Upload Limit is Finish." },
      });
      d.afterClosed().subscribe(response => {
        this.ngOnInit();
        this.ngAfterViewInit();
      });
  }
  deleteSongByAlbum(albumId){
    let self = this;
    console.log(albumId);
    swal({
              title: "All Album's song will be removed from user's listening rooms and won't be distributed any further.",
              text: "All Album's song will also not show up in searches and will no longer accept any feedback.",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
              if (result.value) 
              {
                 this.spinnerService.show();
                  self.api.deletesongsbyalbum(albumId).subscribe(response => {
                  this.spinnerService.hide();
                
                    swal(
                    "All Album's song has been deleted.",
                    "Completely remove All Album's song from Record Drop they'll need to contact an admin.",
                    'success'
                    );
                   /*self.ngOnInit(); 
                   self.configurePager();
                   self.onLoadPageHandler();*/
                   self.ngOnInit();
                   self.ngAfterViewInit();
                  });
              }
        })
  }


}
