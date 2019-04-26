import { Component, OnInit,AfterViewChecked,Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { WebApiService } from '../_services/web-api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {FormControl, FormGroup,AbstractControl, Validators} from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Addtosongplaylist  } from '../_services/song-play-list.service';
import { Song,songlist } from '../_models/songbook-life';
import { SharedDataService, MusicEvent, MusicEventActions } from '../_services/shared-data.service';
import {environment} from '../../environments/environment';
import {Location} from '@angular/common';

@Component({
  selector: 'app-songplaylist',
  templateUrl: './songplaylist.component.html',
  styleUrls: ['./songplaylist.component.css']
})
export class SongplaylistComponent implements OnInit {


  //public routerLinkVariable = "/editprofile";
   @Input() inLibrary = true; 
  songplaylist:Song[];
  data:any[]=[];
  canPlay: boolean = true;
  canPause: boolean;
  constructor(
      private router: Router,
      private api: WebApiService, 
      private dialog: MatDialog,private sd: SharedDataService,
      private spinnerService: Ng4LoadingSpinnerService,
      private dataService:Addtosongplaylist,
      private _location: Location
      ) { 
    
  }

 
 
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    this.data = this.dataService.getplaylistData();
    var tempData = [];
    for (var i in this.data){
        tempData.push(this.data[i].songdata);
         
      }
     this.songplaylist=tempData;
     //console.log(this.songplaylist);

     this.sd.onMusicEvent.subscribe(response => {
      if (response) {
        switch(response.action) {
          case MusicEventActions.Play:
            $(".songplay_").show();
            $(".songpause_").hide();
            $("#songplay_"+response.song.SongId).hide();
            $("#songpause_"+response.song.SongId).show();
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
  onRemoveHandler(song){
    let self = this;
    let baseulr=environment.baseulrs;
    let artistimage= baseulr + `${baseulr.endsWith('/') ? '' : '/'}images/artist_images/` + song.artist_image;
    let data:any={'SongId':song.SongId,'Event':MusicEventActions.Play,'songdata':song,'artistimage':artistimage,'inLibrary':self.inLibrary};
    
    
    this.dataService.deleteMsg(song.SongId);
    //console.log("removesong",this.dataService.getData());
    this.ngOnInit();
    swal({
      title: "Remove Song From Playlist",
      text: "",
      timer: 1000,
      showConfirmButton:false
    });
    let getplaylistcount:any;
    getplaylistcount = this.dataService.getplaylisttotallength();
    if(getplaylistcount > 0){
      
    }else{
      this.router.navigate(['/mysongcrate/songinmycrate']);
    }


  }
 
  historyback(){
    this._location.back();
  }
  playall(){
    var songarray :songlist;
    songarray =  this.dataService.getplayallindex();
    if(songarray && songarray.inLibrary){
    //console.log(songarray);
    this.sd.emitMusicEvent(new MusicEvent(MusicEventActions.Play, songarray.songdata, songarray.artistimage,songarray.inLibrary));
    $(".songplay_").show();
    $(".songpause_").hide();
    $("#songplay_"+songarray.songdata.SongId).hide();
    $("#songpause_"+songarray.songdata.SongId).show();
    }
  }
}
