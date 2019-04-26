import { Component, OnDestroy, OnInit, Input, Output, EventEmitter,AfterViewInit } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, MusicEvent, MusicEventActions } from '../../_services/shared-data.service';
import {environment} from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmFeedbackDialogComponent } from '../../dialogs/confirm-feedback-dialog/confirm-feedback-dialog.component';
import { AlertDialogComponent } from '../../dialogs/alert-dialog/alert-dialog.component';
import { ISubscription } from 'rxjs/Subscription';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Addtolisteningroom  } from '../../_services/song-addinlisteningroom.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-browsesearch-song-card',
  templateUrl: './browsesearch-song-card.component.html',
  styleUrls: ['./browsesearch-song-card.component.css']
})
export class BrowsesearchSongCardComponent implements OnInit, OnDestroy,AfterViewInit {


  constructor(private api: WebApiService, private sd: SharedDataService, private dialog: MatDialog, 
    private spinnerService: Ng4LoadingSpinnerService,private dataService:Addtolisteningroom) { }

  @Input() inLibrary = false;
  @Input() song: Song;
 @Output() onLoadPage = new EventEmitter();
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
 inyourcrate: boolean = false;
 inyourroom: boolean = false;
 isChecked = false;
 availableisChecked = false;
 inyourcratecount: any;
  private _subscriptions: ISubscription[] = [];

  ngOnInit() {


    let self = this;
    let baseulrs=environment.baseulrs;
    //self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;
    self.externalimage = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/grid-world.png`;
    let available = this.dataService.getsonginindex(self.song.SongId);

    if(available){
     // console.log(available);
     this.isChecked = true;
    }else{
     this.isChecked = false;
    }

    /*self.sd.onMusicEvent.subscribe(response => {
      if (response) {
        switch(response.action) {
          case MusicEventActions.Play:
           if (response.song.SongId == self.song.SongId) {
                $(".songplay_").show();
                $(".songpause_").hide();
                $("#songplay_"+response.song.SongId).hide();
                $("#songpause_"+response.song.SongId).show();
            }
            else {
               $(".songplay_").show();
               $(".songpause_").hide();
               $("#songplay_"+response.song.SongId).show();
               $("#songpause_"+response.song.SongId).hide();
             
            }
            break;
          case MusicEventActions.Stop:
            $(".songplay_").show();
            $(".songpause_").hide();
            $("#songplay_"+response.song.SongId).show();
            $("#songpause_"+response.song.SongId).hide();
            break;
          case MusicEventActions.Pause:
            $(".songplay_").show();
            $(".songpause_").hide();
            $("#songplay_"+response.song.SongId).show();
            $("#songpause_"+response.song.SongId).hide();
            break;
          
        }
      }
    }); */
    self.api.songcrateaddedcountinuser(self.song.SongId).subscribe(response => {
      console.log(response);
      if(response > 0){
        this.inyourcrate = true;
        this.inyourcratecount = response;
      }
    });
    self.api.songinuserlisteningroom(self.song.SongId).subscribe(response => {
      console.log(response);
      if(response > 0){
        this.inyourroom = true;
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
      /*this.spinnerService.show();
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
      );*/
      self.albumimageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}`+self.song.album_image;
    }
  }
ngAfterViewInit(){
let self = this;
  self.sd.onMusicEvent.subscribe(response => {
      if (response) {
        switch(response.action) {
          case MusicEventActions.Play:
          
          if (response.song.SongId == self.song.SongId) {
            let songplay_= "#songplay_"+self.song.SongId;
            let songpause_= "#songpause_"+self.song.SongId;
            
               $(songplay_).hide();
               $(songpause_).show();
            }
            else {
              let songplay_= "#songplay_"+self.song.SongId;
              let songpause_= "#songpause_"+self.song.SongId;
             
               $(songplay_).show();
               $(songpause_).hide();
               
             
            }
           
            break;
          case MusicEventActions.Stop:
            $(".songplay_").show();
            $(".songpause_").hide();
            $("#songplay_"+response.song.SongId).show();
            $("#songpause_"+response.song.SongId).hide();
            break;
          case MusicEventActions.Pause:
             $(".songplay_").show();
            $(".songpause_").hide();
            $("#songplay_"+response.song.SongId).show();
            $("#songpause_"+response.song.SongId).hide();
            break;
          
        }
      }
    }); 

}
  ngOnDestroy(){
    let self = this;
    //console.log('Unsubscribing getArtistImage ', self.song.artist_image);
    /*self._subscriptions.forEach(s => {
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
    $(".songplay_").show();
    $(".songpause_").hide();
    $("#songplay_"+self.song.SongId).hide();
    $("#songpause_"+self.song.SongId).show();
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
    $(".songplay_").show();
    $(".songpause_").hide();
    $("#songplay_"+self.song.SongId).show();
    $("#songpause_"+self.song.SongId).hide();
   
  }


  onSubmitHandler($event: number){
    let self = this;
    //console.log('Oveall Rating Submit', $event);
     //window.scrollTo(0, 0);
    //alert($event);
    if($event== 0){
      alert("Please rate the song");
    }else{
      this.spinnerService.show();
      self.api.postFeedback(self.song.SongId, $event)
      .subscribe(response => {
        this.spinnerService.hide();
        console.log('Feedback Response', response);
        if (response) {
          self.song.OverallRating = $event;
          self.showConfirmFeedbackDialog();
        }
      });
    }
    
  }

  showConfirmFeedbackDialog(){
    let self = this;
    let d = self.dialog.open(ConfirmFeedbackDialogComponent, { panelClass: 'custom-dialog-container'});
    d.afterClosed().subscribe(response => {
      console.log('Dialog', response);
      console.log('Dialog .addLink', response.addLink);
      this.spinnerService.show();
      self.api.postFeedbackcomment(self.song.SongId, response.comment) .subscribe(response => {
        this.spinnerService.hide();
        console.log('Feedback Response', response);
       });
      if (response.addLink == 'Yes') {
        this.spinnerService.show();
        self.api.addSongToCrate(self.song.SongId,response.favourite)
          .subscribe(response => {
            this.spinnerService.hide();
            console.log(`Song ${self.song.SongId} added to crate with id ${response}`);
          });
      }
      
       
      //if (response.download) self.api.downloadSong(self.song.SongId, self.song.Filename || self.song.SongFile); 
    });
  }

  addtolisteningroom(){
    let self = this;
   // console.log("Song add To Listening Room.");
    //window.scrollTo(0, 0);
    this.spinnerService.show();
    self.api.addSongToListeningRoom(self.song.SongId)
          .subscribe(response => {
            this.spinnerService.hide();
            this.onLoadPage.emit();
            //console.log(`Song ${self.song.SongId} added to crate with id ${response}`);
            //alert(response); AlertDialogComponent
            if(response == 1){
             // alert("The song has already been reviewed and is in your Song Crate");
              let d = self.dialog.open(AlertDialogComponent, { panelClass: 'custom-dialog-container', 
                    data: { title :'The song has already been reviewed and is in your Song Crate.' } });
            }else if(response == 2){
              //alert("The song is already in your Listening Room waiting for you review");
              let d = self.dialog.open(AlertDialogComponent, { panelClass: 'custom-dialog-container', 
                    data: { title :'The song is already in your Listening Room waiting for you review.' } });
            }else if(response == 3){
              //alert("You have already submitted feedback on this song, would you like to add it to your Song Crage” Y/N");
              let d = self.dialog.open(AlertDialogComponent, { panelClass: 'custom-dialog-container', 
            data: { title :'You have already submitted feedback on this song, would you like to add it to your Song Crage” Y/N' } });
            }else if(response == 4){
              //alert("The song is add in your Listening Room waiting for you review");
              let d = self.dialog.open(AlertDialogComponent, { panelClass: 'custom-dialog-container' , 
                    data: { title :'The song is added in your Listening Room Successfully.' } });
            }

          });

  }
  onFilterChange(SongId){
    //console.log(SongId.target.checked)
    let datapass : any;
     if(SongId.target.checked){
       let data:any={'SongId':this.song.SongId };
         this.dataService.addData(data,this.song.SongId);
     }else{
      let data:any={'SongId':this.song.SongId };
        this.dataService.deleteMsg(this.song.SongId);
     }
    
  }



}
