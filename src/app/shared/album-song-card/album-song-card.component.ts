import { Component, OnDestroy, OnInit, Input, Output, EventEmitter,AfterViewInit} from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, MusicEvent, MusicEventActions } from '../../_services/shared-data.service';
import {environment} from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmFeedbackDialogComponent } from '../../dialogs/confirm-feedback-dialog/confirm-feedback-dialog.component';
import { ISubscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertDialogComponent } from '../../dialogs/alert-dialog/alert-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
@Component({
  selector: 'app-album-song-card',
  templateUrl: './album-song-card.component.html',
  styleUrls: ['./album-song-card.component.css']
})
export class AlbumSongCardComponent implements OnInit, OnDestroy,AfterViewInit {

albumid:any;
  constructor(private router: Router,private api: WebApiService, private sd: SharedDataService, 
    private dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService,private route: ActivatedRoute) { 
      this.albumid= this.route.snapshot.params['id'];
  }

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

  private _subscriptions: ISubscription[] = [];

  ngOnInit() {
    let self = this;
    let baseulrs=environment.baseulrs;
    //self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;
    self.externalimage = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/grid-world.png`;

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
  }

  ngOnDestroy(){
    let self = this;
    //console.log('Unsubscribing getArtistImage ', self.song.artist_image);
   /* self._subscriptions.forEach(s => {
      s.unsubscribe();
    });*/
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
    console.log('Oveall Rating Submit', $event);
    //alert($event);
     window.scrollTo(0, 0);
    if($event== 0){
      let d = self.dialog.open(AlertDialogComponent, { panelClass: 'custom-dialog-container', 
                    data: { title :'Please give start rating for the song after Submit Your Feedback.' } });
      //alert("Please rate the song");
    }else{
      self.showConfirmFeedbackDialog($event);
    }
    
  }

  showConfirmFeedbackDialog($event){
    let self = this;
    let d = self.dialog.open(ConfirmFeedbackDialogComponent, { panelClass: 'custom-dialog-container'});
    d.afterClosed().subscribe(response => {
      if(response){
      console.log('Dialog', response);
      console.log('Dialog .addLink', response.addLink);
      this.spinnerService.show();
      self.api.postFeedback(self.song.SongId, $event)
      .subscribe(response => {
        this.spinnerService.hide();
        console.log('Feedback Response', response);
        if (response) {
          self.song.OverallRating = $event;
          
        }
      });
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
            //console.log(`Song ${self.song.SongId} added to crate with id ${response}`);
          });
      }
      }
      self.api.getalbumSongsToReviewCount(this.albumid).subscribe(response => {
        if(response > 0 ){
          this.onLoadPage.emit();
        }else{
          this.router.navigate(['/getMusic/reviewMusic']);
        }
      })
       //this.onLoadPage.emit();
      
    });
  }


}
