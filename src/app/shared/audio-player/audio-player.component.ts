import { Component, ElementRef, EventEmitter, OnInit, Input, Output, ViewChild, OnDestroy  } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, MusicEventActions, MusicEvent } from '../../_services/shared-data.service';
import {environment} from '../../../environments/environment';
import { Song,songlist } from '../../_models/songbook-life';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import { Addtosongplaylist  } from '../../_services/song-play-list.service';
@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit,OnDestroy {

  constructor(private api: WebApiService, private sd: SharedDataService, 
    private spinnerService: Ng4LoadingSpinnerService,private dataService:Addtosongplaylist) {

  }

  @Input() audioSource: string;
  @Output() onPlay = new EventEmitter();

  song: Song = null;
  imageSource: string;
  playershow=true;
  playerhide=false;
   onplaysong=true;
  onpausesong=false;
  songplaylist:Song[];
  data:any[]=[];
  totallist;
  songplayindex;
  songinlibrary:boolean;
  @ViewChild('audioCtrl') audioCtrl: ElementRef;
  private songSubscription: any;
  get myAudioCtrl(): HTMLAudioElement { return this.audioCtrl.nativeElement;}

  ngOnInit() {
    let self = this;
     this.playershow=true;
    this.playerhide=false;
     self.myAudioCtrl.onended = ()=> self.finishafterplay();
     self.myAudioCtrl.onpause = ()=>self.audiopauseAudio();
     self.myAudioCtrl.onplay = ()=>self.audioplayAudio();
     
     /*self.myAudioCtrl.pause = ()=>self.pauseAudio();*/

    //self.myAudioCtrl.onended = ()=> self.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Stop, self.song));

    this.songSubscription = self.sd.onMusicEvent.subscribe(response => {
      console.log('Music Event Detected', response);
      if (response){
        switch(response.action) {
          case MusicEventActions.Play:
            self.playSong(response);
            break;
          case MusicEventActions.Stop:
            self.stopAudio();
            break;
          case MusicEventActions.Pause:
            self.pauseAudio();
            break;
          
            
        }
      }
    });
    
  }
  ngOnDestroy() {
    this.songSubscription.unsubscribe();
   
    console.log("Player subscription destroyed");
  }

  playAudio(){
    let self = this;
    //self.myAudioCtrl.play();
    
    //console.log("Play Song Function",self.myAudioCtrl);
   // console.log("Available Song ", self.song,self.audioCtrl);

    //var playPromise = self.myAudioCtrl.play();
    var playPromise = document.querySelector('audio').play();

    if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Automatic playback started!
      // Show playing UI.
      this.onplaysong=false;
      this.onpausesong=true;
      $(".songplay_").show();
      $(".songpause_").hide();
      $("#songplay_"+self.song.SongId).hide();
      $("#songpause_"+self.song.SongId).show();
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
      //console.log(error);
      //this.onplaysong=true;
      //this.onpausesong=false;
      //this.finishafterplay();
      this.onplaysong=false;
      this.onpausesong=true;
      $(".songplay_").show();
      $(".songpause_").hide();
      $("#songplay_"+self.song.SongId).hide();
      $("#songpause_"+self.song.SongId).show();
    });
  }

     

    self.sd.hideProgressBar();
  }
  
  playSong(event: MusicEvent){
    let self = this;
    self.sd.showProgressBar(`Playing song ${event.song.SongTitle}`);  //cleared in playAudio

    self.stopAudio();
    
    self.imageSource = event.imageSource;
    self.song = event.song;
      this.songinlibrary=event.inLibrary;
      this.songplayindex=this.dataService.getcurrentindex(this.song.SongId);
     this.totallist=this.dataService.gettotallength();

    let key = `AudioSource ${event.song.SongId} ${event.inLibrary}`;
    let cachedAudioSource = self.sd.cacheManager.get<string>(key);
    if (!cachedAudioSource) {
      if (event.inLibrary){

        self.audioSource = `${environment.apiPrefix}/api/songs/songData/${event.song.SongId}?a=`
          + encodeURIComponent(self.sd.currentUser.token);
        console.log('Audio Source InLibrary', self.audioSource);
        self.sd.cacheManager.set(key, self.audioSource);
        self.audioCtrl.nativeElement.src = self.audioSource;
        //console.log('Audio Source', self.audioCtrl.nativeElement.src);
        self.playAudio();
        /*self.api.getAudioSource(event.song.SongId, event.inLibrary)
          .subscribe(response => {
            console.log('Audio length', response.length);
            self.audioSource = event.inLibrary ? response : environment.apiPrefix + response;
            self.sd.cacheManager.set(key, self.audioSource);
            self.audioCtrl.nativeElement.src = self.audioSource;
            //console.log('Audio Source', self.audioCtrl.nativeElement.src);
            self.playAudio();
          });*/
      }
      else {
        self.audioSource = `${environment.apiPrefix}/api/songs/audioSource/${event.song.SongId}/${event.inLibrary}?a=`
          + encodeURIComponent(self.sd.currentUser.token);
          self.sd.cacheManager.set(key, self.audioSource);
          self.audioCtrl.nativeElement.src = self.audioSource;
          self.playAudio();
        /*this.spinnerService.show();
        self.api.getAudioSource(event.song.SongId, event.inLibrary)
          .subscribe(response => {
            this.spinnerService.hide();
            console.log('Audio length', response.length);
            self.audioSource = event.inLibrary ? response : environment.apiPrefix + response;
            self.sd.cacheManager.set(key, self.audioSource);
            self.audioCtrl.nativeElement.src = self.audioSource;
            //console.log('Audio Source', self.audioCtrl.nativeElement.src);
            self.playAudio();
          });*/
      }
    }
    else {
      self.audioSource = cachedAudioSource;
      self.audioCtrl.nativeElement.src = self.audioSource;
     // console.log('Audio Source',self.audioCtrl.nativeElement.src);
      self.playAudio();
    }
  }

  stopAudio(){
    let self = this;
    self.audioCtrl.nativeElement.pause();
    self.audioCtrl.nativeElement.currentTime = 0;
    this.onplaysong=true;
    this.onpausesong=false;
  }
  pauseAudio(){
      let self = this;
      self.audioCtrl.nativeElement.pause();
      this.onplaysong=true;
      this.onpausesong=false;
      console.log("pause audio");
      if(self.song){
          $(".songplay_").show();
          $(".songpause_").hide();
          $("#songplay_"+self.song.SongId).show();
          $("#songpause_"+self.song.SongId).hide();
      }else{
          $(".songplay_").show();
          $(".songpause_").hide();
      }
     
  }
 
  ngOnChanges(){
    let self = this;
    //console.log('Audio changes', self.audioSource);
    //self.audioCtrl.nativeElement.load();
    //self.audioCtrl.nativeElement.play();
    self.myAudioCtrl.onpause = function(){
      $(".songplay_").show();
      $(".songpause_").hide();
      $("#songplay_"+self.song.SongId).show();
      $("#songpause_"+self.song.SongId).hide();
    };
    self.myAudioCtrl.onplay = function(){
      $(".songplay_").show();
      $(".songpause_").hide();
      $("#songplay_"+self.song.SongId).hide();
      $("#songpause_"+self.song.SongId).show();
    };

    
  }
  onPlayHandler(){
    let self= this;
    self.onPlay.emit();
  }
  playershows(){
    $(".music_show_hode").toggle("slide");
    console.log("show player");
    this.playershow=false;
    this.playerhide=true;
  }
  playerhides(){
     $(".music_show_hode").hide();
     console.log("hide player");
      this.playershow=true;
      this.playerhide=false;
  }
  finishafterplay(){
    this.onplaysong=true;
    this.onpausesong=false;
    this.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Stop, this.song));
    //console.log(this.song.SongId);
    
    var songarray :songlist;
    songarray = this.dataService.getzeroindex(this.song.SongId);

    if(songarray && songarray.inLibrary){
    console.log(songarray);
    this.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Play, songarray.songdata, songarray.artistimage,songarray.inLibrary));
    this.onplaysong=false;
    this.onpausesong=true;
      $(".songplay_").show();
      $(".songpause_").hide();
      $("#songplay_"+this.song.SongId).show();
      $("#songpause_"+this.song.SongId).hide();
    }else{
      $(".songplay_").show();
      $(".songpause_").hide();
      $("#songplay_"+this.song.SongId).show();
      $("#songpause_"+this.song.SongId).hide();
    }
  }
  backward(){
    var songarray :songlist;
    songarray = this.dataService.getbackward(this.song.SongId);
    if(songarray && songarray.inLibrary){
    console.log(songarray);
    this.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Play, songarray.songdata, songarray.artistimage,songarray.inLibrary));
    this.onplaysong=false;
    this.onpausesong=true;
    }
  }
  forward(){
    var songarray :songlist;
    songarray = this.dataService.getforward(this.song.SongId);
    if(songarray && songarray.inLibrary){
    console.log(songarray);
    this.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Play, songarray.songdata, songarray.artistimage,songarray.inLibrary));
    this.onplaysong=false;
    this.onpausesong=true;
    }
  }
  createplaylist(){
    this.data = this.dataService.getplaylistData();
    var tempData = [];
    for (var i in this.data){
        tempData.push(this.data[i].songdata);
         
      }
     this.songplaylist=tempData;
  }
  playlist(){
    this.createplaylist();
     $("#playlistnew").toggle("slide");
    
       console.log(" Create Playlist",this.songplaylist);
   
  }
  audiopauseAudio(){
    //console.log("Self Pause Audio");
    this.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Pause, this.song));
  }
  audioplayAudio(){
    this.onplaysong=false;
    this.onpausesong=true;
    if(this.song){
          $(".songplay_").show();
          $(".songpause_").hide();
          $("#songplay_"+this.song.SongId).hide();
          $("#songpause_"+this.song.SongId).show();
      }else{
          $(".songplay_").show();
          $(".songpause_").hide();
      }
  }
}
