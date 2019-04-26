import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, MusicEvent, MusicEventActions } from '../../_services/shared-data.service';
import {environment} from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmFeedbackDialogComponent } from '../../dialogs/confirm-feedback-dialog/confirm-feedback-dialog.component';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../dialogs/alert-dialog/alert-dialog.component';
import { SongUploadService, SongWithData } from '../../_services/song-upload.service';
import { UploadSongDialogComponent } from '../../dialogs/upload-song-dialog/upload-song-dialog.component';
import { EditSongDialogComponent } from '../../dialogs/edit-song-dialog/edit-song-dialog.component';
import { DistributeSongDialogComponent } from '../../dialogs/distribute-song-dialog/distribute-song-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-portfolio-list-card',
  templateUrl: './portfolio-list-card.component.html',
  styleUrls: ['./portfolio-list-card.component.css']
})
export class PortfolioListComponent implements OnInit, OnDestroy {


  constructor(private router: Router,private api: WebApiService, private sd: SharedDataService, 
    private dialog: MatDialog
    ,private sus: SongUploadService, private spinnerService: Ng4LoadingSpinnerService) { }

  @Input() inLibrary = true;
  @Input() song: Song;
   //@Input() myMethod: Function;
inpromember: boolean=false;
  audioSource: string;
  imageSource: string;
externalimage: string;
  canPlay: boolean = true;
  canPause: boolean;
  canStop: boolean;
  canSkip: boolean;
  canQueue: boolean = true;
  canDequeue: boolean;
  canMute: boolean;
  canLoop: boolean;

  private _subscriptions: ISubscription[] = [];

  ngOnInit() {
    let self = this;
     self.sus.songToEdit.onPropertyChanged.subscribe(s => {
      if (s) self.editSong(s);
    });

    self.sus.songToDistribute.onPropertyChanged.subscribe(s => {
      if (s) self.distributeSong(s);
    });


    let baseulrs=environment.baseulrs;
    self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;
    self.externalimage = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/grid-world.png`;
    this.spinnerService.show();
 self.api.getpromember().subscribe(response => { 
   this.spinnerService.hide();
      if (response) {
         this.inpromember=true;
      }
    });
    self.sd.onMusicEvent.subscribe(response => {
      if (response) {
        switch(response.action) {
          case MusicEventActions.Play:
            if (response.song.SongId == self.song.SongId) {
                self.canPlay = false;
                self.canPause = self.canStop = self.canMute = self.canLoop = true;
            }
            else {
              self.canPlay = true;
              self.canPause = self.canStop = self.canMute = self.canLoop = false;
            }
            break;
          case MusicEventActions.Stop:
            self.canPlay = true;
            self.canPause = self.canStop = self.canMute = self.canLoop = false;
            break;
          case MusicEventActions.Pause:
            self.canPlay = true;
            self.canPause = self.canStop = self.canMute = self.canLoop = false;
            break;
          
        }
      }
    }); 

    if (self.song.ImageSource == null){
      this.spinnerService.show();
      self._subscriptions.push(self.api.getArtistImage(self.song.artist_image)
        .subscribe(response => {
          this.spinnerService.hide();
          if (response.endsWith(',')){
            console.error('No image for ', self.song.artist_image);
            
          }
          else{

             self.imageSource = self.song.ImageSource = response;
          }
        })
      );
    }
    else{
      self.imageSource = self.song.ImageSource;
    }
  }

  ngOnDestroy(){
    let self = this;
    console.log('Unsubscribing getArtistImage ', self.song.artist_image);
    self._subscriptions.forEach(s => {
      s.unsubscribe();
    });
  }

  onDequeueHandler(){
    let self = this;
  }

  onLoopHandler(){
    let self = this;
  }

  onMuteHandler(){
    let self = this;
    self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Mute, self.song, self.imageSource,
      self.inLibrary));
  }

  onPauseHandler(){
    let self = this;
    self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Pause, self.song, self.imageSource,
      self.inLibrary));
    
    
  }

  onPlayHandler(){
    let self = this;

    self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Play, self.song, self.imageSource,
      self.inLibrary));
  }

  onQueueHandler(){
    let self = this;
  }

  onSkipHandler(){
    let self = this;
  }

  onStopHandler(){
    let self = this;

     self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Stop, self.song, self.imageSource,
      self.inLibrary));
   
  }

deleteYourSong(songid){
       let self = this;
       if(confirm("Are you sure to delete "+songid)) {
         this.spinnerService.show();
           self.api.deletesongs(songid).subscribe(response => {
             this.spinnerService.hide();
            //console.log("response",response);
             /*self.configurePager();
             this.error ="Your Song SuccessFully Deleted From Your Portfoliyo.";
              setTimeout(()=>{   
                 self.error = '';
                 }, 4000);*/
                // this.myMethod()
          });
        }
      
       
    }
    uploadSong(albumid){
      let self = this;
      console.log("albumid",albumid);
      let upload = self.dialog.open(UploadSongDialogComponent , {  
          data : { albumId : albumid },
          hasBackdrop: true,
              backdropClass: 'cdk-overlay-transparent-backdrop', panelClass: 'custom-dialog-container'});
          upload.afterClosed().subscribe(response => {
            if (response){
            }
          });
    }
     private editSong(song: SongWithData){
    let self = this;
    //console.log('Opening song edit dialog', song);
    self.sus.songToEdit.value = null;
    let d = self.dialog.open(EditSongDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: song,
      disableClose: true
    });
    d.afterClosed().subscribe(s => { 
      self.sus.distributeSong(s);
    });
  }
    private distributeSong(song: SongWithData){
    let self = this;
    //console.log('Opening song distribution dialog', song);
    self.sus.songToDistribute.value = null;
    let d = self.dialog.open(DistributeSongDialogComponent, {
       panelClass: 'custom-dialog-container',
      data: song,
      disableClose: true
    });
    d.afterClosed().subscribe(s => {
      console.log('Song distributed', s);
      self.alertdialog();

    });
  }
  alertdialog(){

    let d = this.dialog.open(AlertDialogComponent , {  
              hasBackdrop: true,
              backdropClass: 'cdk-overlay-transparent-backdrop', 
              panelClass: 'custom-dialog-container',
              data: { title : "Your Song Successfully Uploaded." },
            });
    d.afterClosed().subscribe(response => {
      if (response){
        
      }

    });
    
  }




}
