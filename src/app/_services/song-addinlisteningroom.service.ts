import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Song, KVP } from '../_models/songbook-life';
import { ObservableProperty } from '../_models/observable-property';

@Injectable()
export class Addtolisteningroom {
  private data:any[]=[];
  addData(msg:any,SongId)
  {
    var token = localStorage.getItem('songlisteningroom');
    if(token){
        this.data = JSON.parse(localStorage.getItem("songlisteningroom"));
        var index = this.data.findIndex(obj => obj.SongId==SongId);
        if (index !== -1) {
          
        }else{
          this.data.push(msg);
        }  
    }else{
        this.data.push(msg);
    }
    localStorage.setItem("songlisteningroom",JSON.stringify(this.data));
      
  }
  getData()
  {
      return localStorage.getItem("songlisteningroom");
  }
  deleteMsg(SongId:any) {
    console.log(SongId);
    //const index: number = this.data.indexOf(msg => msg);
   // console.log("index",index);
   this.data = JSON.parse(localStorage.getItem("songlisteningroom"));
   var index = this.data.findIndex(obj => obj.SongId==SongId);
   //console.log(index);
   
    if (index !== -1) {
        this.data.splice(index, 1);
        
    }   
    localStorage.setItem("songlisteningroom",JSON.stringify(this.data));   
  }
    getsonginindex(SongId:any){
    var token = localStorage.getItem('songlisteningroom');
    var arr = JSON.parse(localStorage.getItem("songlisteningroom"));
    //console.log(token,SongId);
    if(arr != null){
      this.data = JSON.parse(localStorage.getItem("songlisteningroom"));
      var index = this.data.findIndex(obj => obj.SongId==SongId);
      //console.log(index);
      if (index !== -1) {
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }

  }




}
