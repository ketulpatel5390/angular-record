import { Component, OnDestroy, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, MusicEvent, MusicEventActions } from '../../_services/shared-data.service';
import {environment} from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmFeedbackDialogComponent } from '../../dialogs/confirm-feedback-dialog/confirm-feedback-dialog.component';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../dialogs/alert-dialog/alert-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-admin-song-card',
  templateUrl: './admin-song-card.component.html',
  styleUrls: ['./admin-song-card.component.css']
})
export class AdminSongCardComponent implements OnInit, OnDestroy {


  constructor(private router: Router,private api: WebApiService, private sd: SharedDataService,
   private dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService) { }

  @Input() inLibrary = true;
  @Input() song: Song;
  @Output() onLoadPage = new EventEmitter();
  @Input() filter;

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
  albumimageSource: string;
 songreviewedcount:any;
  songlisteningroomcount:any;
  private _subscriptions: ISubscription[] = [];

  ngOnInit() {
    let self = this;
    let baseulrs=environment.baseulrs;
    self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;
    self.externalimage = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/grid-world.png`;

    this.spinnerService.show();
    self.api.adminsongreviewedcount(self.song.SongId).subscribe(response => {
      this.spinnerService.hide();
      self.songreviewedcount = response;
    });
    this.spinnerService.show();
    self.api.adminsonglisteningroomcount(self.song.SongId).subscribe(response => {
      this.spinnerService.hide();
      self.songlisteningroomcount = response;
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
      /*this.spinnerService.show();
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
      );*/
    if(self.song.artist_image != "" || self.song.artist_image != null ){
        self.imageSource =  baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}images/artist_images/`+self.song.artist_image;
      }else{
        self.imageSource =baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;
      }
    }
    else{
      self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}images/artist_images/`+self.song.artist_image;
    }

    if (self.song.albumId){
      this.spinnerService.show();
      self._subscriptions.push(self.api.getAlbumImage(self.song.albumId)
        .subscribe(response => {
          this.spinnerService.hide();
          if (response.endsWith(',')){
            console.error('No image for ', response);
            
          }
          else{

             self.albumimageSource =  response;
          }
        })
      );
    }

  }

  ngOnDestroy(){
    let self = this;
    /*console.log('Unsubscribing getArtistImage ', self.song.artist_image);
    self._subscriptions.forEach(s => {
      s.unsubscribe();
    });*/
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


  onStopHandler(){
    let self = this;

     self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Stop, self.song, self.imageSource,
      self.inLibrary));
   
  }
  approvesong(){
    console.log("approvesong.song.SongId",this.song.SongId);
    this.spinnerService.show();
    this.api.getApprovesong(this.song.SongId,this.song.UserId).subscribe(response => {
      this.spinnerService.hide();
         // window.location.reload();
         this.onLoadPage.emit();
    });

  }
  rejectsong(){
    this.spinnerService.show();
    this.api.getRejectsong(this.song.SongId,this.song.UserId).subscribe(response => {
      this.spinnerService.hide();
          //window.location.reload();
          this.onLoadPage.emit();
    });

  }
  deletesong(SongId){
    this.spinnerService.show();
    this.api.deletesongsbyadmin(SongId).subscribe(response => {
      this.spinnerService.hide();
          //window.location.reload();
          this.onLoadPage.emit();
    });

  }




}
