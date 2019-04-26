import { Component, OnDestroy, OnInit, Input ,Output ,EventEmitter, AfterViewInit } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, MusicEvent, MusicEventActions } from '../../_services/shared-data.service';
import {environment} from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmFeedbackDialogComponent } from '../../dialogs/confirm-feedback-dialog/confirm-feedback-dialog.component';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../dialogs/alert-dialog/alert-dialog.component';
import { EditfeedbackDialogComponent } from '../../dialogs/edit-feedback-dialog/edit-feedback-dialog.component';
import {OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent} from "angular-star-rating";
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Addtosongplaylist  } from '../../_services/song-play-list.service';
import * as $ from 'jquery';
import swal from 'sweetalert2';
@Component({
  selector: 'app-library-song-card',
  templateUrl: './library-song-card.component.html',
  styleUrls: ['./library-song-card.component.css']
})
export class LibrarySongCardComponent implements OnInit, OnDestroy,AfterViewInit {


  constructor(private router: Router,private api: WebApiService, 
    private sd: SharedDataService, private dialog: MatDialog, 
    private spinnerService: Ng4LoadingSpinnerService,
    private dataService:Addtosongplaylist) { }

  @Input() inLibrary = true;
  @Input() song: Song;
 @Output() onLoadPage = new EventEmitter();
 @Input() inpromember: boolean;
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
  //inpromember: boolean=false;
   albumimageSource: string;
   canAdd: boolean = true;
  canRemove: boolean;
  //inpromembernot: boolean=false;

  private _subscriptions: ISubscription[] = [];

  ngOnInit() {
    let self = this;
   
   // this.inpromembernot=true;
   /*self.api.getpromember().subscribe(response => { 
      if (response == 1) {
        console.log(response);
         this.inpromember = true;
      }
    });*/
    
    let baseulrs=environment.baseulrs;
    //self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;
    self.externalimage = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/grid-world.png`;



    /*self.sd.onMusicEvent.subscribe(response => {
      if (response) {
        switch(response.action) {
          case MusicEventActions.Play:
          
          if (response.song.SongId == self.song.SongId) {
            let songplay_= "#songplay_"+self.song.SongId;
            let songpause_= "#songpause_"+self.song.SongId;
              console.log(songplay_,songpause_);
               $(songplay_).hide();
               $(songpause_).show();
            }
            else {
               //$("#songpause_" + self.song.SongId).hide();
               //$("#songplay_" + self.song.SongId).show();
               let songplay_= "#songplay_"+self.song.SongId;
            let songpause_= "#songpause_"+self.song.SongId;
              console.log(songplay_,songpause_);
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
    }); */

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
        self.imageSource = self.song.ImageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}images/artist_images/`+self.song.artist_image;
      }else{
        self.imageSource = self.song.ImageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;
      }
    }
    else{
      self.imageSource = self.song.ImageSource =  baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}images/artist_images/`+self.song.artist_image;
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
    let available = this.dataService.getsonginindex(self.song.SongId);

    if(available){
      //console.log(available);
      this.canAdd = false;
      this.canRemove = true;
    }else{
      this.canAdd = true;
      this.canRemove = false;
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
   /* self._subscriptions.forEach(s => {
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
    /*let baseulr=environment.baseulrs;
    let artistimage= baseulr + `${baseulr.endsWith('/') ? '' : '/'}images/artist_images/` + self.song.artist_image;
    let data:any={'SongId':self.song.SongId,'Event':MusicEventActions.Queue,'songdata':self.song,
    'artistimage':artistimage,'inLibrary':self.inLibrary};
      this.dataService.addData(data,self.song.SongId);*/
    self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Play, self.song, self.imageSource,
      self.inLibrary));
    $(".songplay_").show();
    $(".songpause_").hide();
    $("#songplay_"+this.song.SongId).hide();
    $("#songpause_"+this.song.SongId).show();
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
    $("#songplay_"+this.song.SongId).show();
    $("#songpause_"+this.song.SongId).hide();
   
  }


  onSubmitHandler($event: number){
    let self = this;
    //console.log('Oveall Rating Submit', $event);
    //alert($event);
    window.scrollTo(0, 0);
    if($event== 0){
      let d = self.dialog.open(AlertDialogComponent, { panelClass: 'custom-dialog-container', 
                    data: { title :'Please give start rating for the song after Submit Your Feedback.' } });
      //alert("Please rate the song");
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
      
      //this.router.navigate(['/getMusic/reviewMusic']); 
      //this.router.navigate(['/mysongcrate/songinmycrate']); 
      this.onLoadPage.emit();
      //if (response.download) self.api.downloadSong(self.song.SongId, self.song.Filename || self.song.SongFile); 
    });
  }

  editfeedback(){
    let self = this;
    //console.log("Edit Song Rating");
    window.scrollTo(0, 0);
     let d = self.dialog.open(EditfeedbackDialogComponent, { panelClass: 'custom-dialog-container',
       data: { SongId :self.song.SongId , OverallRating :self.song.OverallRating } });
     d.afterClosed().subscribe(response => {
       console.log(response);
       this.onLoadPage.emit();
      });
  }
  downloadsong(){
    let self = this;
    console.log("Download the Song ",self.song.SongId);
    self.api.downloadSong(self.song.SongId, self.song.Filename || self.song.SongFile);

    
  }
  sendmesage(){
    let self = this;
    //console.log("Send Message For the Song ",self.song.SongId);
    window.scrollTo(0, 0);
    let d = self.dialog.open(MessageDialogComponent, { panelClass: 'custom-dialog-container',
       data: { SongId :self.song.SongId } });
     d.afterClosed().subscribe(response => {
       //this.router.navigate(['/getMusic/library']); 
       //this.router.navigate(['/mysongcrate/songinmycrate']); 
       this.onLoadPage.emit();
      });
  }
   onQueueHandler(song){
    let self = this;
    let baseulr=environment.baseulrs;
    

    let artistimage= baseulr + `${baseulr.endsWith('/') ? '' : '/'}images/artist_images/` + song.artist_image;
    let data:any={'SongId':song.SongId,'Event':MusicEventActions.Play,'songdata':song,'artistimage':artistimage,'inLibrary':self.inLibrary};
    
    let emptycount = this.dataService.getData();
    //console.log(emptycount);
    if(!emptycount) {
        //console.log(emptycount);
        //self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Play, song, artistimage,self.inLibrary));
      }
    this.dataService.addData(data,song.SongId);
    
    this.canAdd = false;
    this.canRemove = true;
     swal({
      title: "Song Added To Playlist",
      text: "",
      timer: 1000,
      showConfirmButton:false
    }); 
      
   // console.log("addsong",this.dataService.getData());
  }
  onRemoveHandler(song){
    let self = this;
    let baseulr=environment.baseulrs;
    let artistimage= baseulr + `${baseulr.endsWith('/') ? '' : '/'}images/artist_images/` + song.artist_image;
    let data:any={'SongId':song.SongId,'Event':MusicEventActions.Play,'songdata':song,'artistimage':artistimage,'inLibrary':self.inLibrary};
    
    this.canAdd = true;
    this.canRemove = false;
    this.dataService.deleteMsg(song.SongId);
    //console.log("removesong",this.dataService.getData());
    swal({
      title: "Remove Song From Playlist",
      text: "",
      timer: 1000,
      showConfirmButton:false
    });

  }


}
