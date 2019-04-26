import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Song, KVP } from '../_models/songbook-life';
import { ObservableProperty } from '../_models/observable-property';

@Injectable()
export class Addtosongplaylist {
  private data:any[]=[];
  pagedSongs: Song[];
  addData(msg:any,SongId)
  {
    var token = localStorage.getItem('songplaylist');
    if(token){
        this.data = JSON.parse(localStorage.getItem("songplaylist"));
        var index = this.data.findIndex(obj => obj.SongId==SongId);
        if (index !== -1) {
          
        }else{
          this.data.push(msg);
        }  
    }else{
        this.data.push(msg);
    }
    localStorage.setItem("songplaylist",JSON.stringify(this.data));
      
  }
  getData()
  {
      return localStorage.getItem("songplaylist");
  }
  deleteMsg(SongId:any) {
    //console.log(SongId);
    //const index: number = this.data.indexOf(msg => msg);
   // console.log("index",index);
   this.data = JSON.parse(localStorage.getItem("songplaylist"));
   var index = this.data.findIndex(obj => obj.SongId==SongId);
   //console.log(index);
   
    if (index !== -1) {
        this.data.splice(index, 1);
        
    }   
    localStorage.setItem("songplaylist",JSON.stringify(this.data));   
  }
  getzeroindex(SongId:any){
     var arr = JSON.parse(localStorage.getItem("songplaylist"));
      var index = this.data.findIndex(obj => obj.SongId==SongId);
      //console.log(index);
      if (index !== -1) {
        if(index + 1 >= arr.length ){
          return false;
        }else{
          return arr[index + 1 ];
            
        }
       
      }else{
        return false;
      }
  }
  getsonginindex(SongId:any){
    var token = localStorage.getItem('songplaylist');
    var arr = JSON.parse(localStorage.getItem("songplaylist"));
    //console.log(token,SongId);
    if(arr != null){
      this.data = JSON.parse(localStorage.getItem("songplaylist"));
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
  getbackward(SongId:any){
     var arr = JSON.parse(localStorage.getItem("songplaylist"));
      var index = this.data.findIndex(obj => obj.SongId==SongId);
      //console.log(index);
      if (index !== -1) {
        if(index - 1 >= arr.length ){
          return false;
        }else{
          return arr[index - 1 ];
            
        }
       
      }else{
        return false;
      }
  }
  getforward(SongId:any){
     var arr = JSON.parse(localStorage.getItem("songplaylist"));
      var index = this.data.findIndex(obj => obj.SongId==SongId);
      //console.log(index);
      if (index !== -1) {
        if(index + 1 >= arr.length ){
          return false;
        }else{
          return arr[index + 1 ];
            
        }
       
      }else{
        return false;
      }
  }
  getplaylistData(){
    return JSON.parse(localStorage.getItem("songplaylist"));
    
  }
  getcurrentindex(SongId:any){
     var arr = JSON.parse(localStorage.getItem("songplaylist"));
      var index = this.data.findIndex(obj => obj.SongId==SongId);
      if (index !== -1) {
          return index + 1;
      }else{
        return 1;
      }
     
  }
  gettotallength(){
     var arr = JSON.parse(localStorage.getItem("songplaylist"));
     //console.log(arr.length);
     if(arr !== null){
       return arr.length;
     }else{
        return 1;
      }
  }
  getplayallindex(){
    var token = localStorage.getItem('songplaylist');
    var arr = JSON.parse(localStorage.getItem("songplaylist"));
    //console.log(token,SongId);
    if(arr != null){
      return arr[0];
    }else{
      return false;
    }

  }
  getplaylisttotallength(){
     var arr = JSON.parse(localStorage.getItem("songplaylist"));
     //console.log(arr.length);
    return arr.length;
      
  }

}
