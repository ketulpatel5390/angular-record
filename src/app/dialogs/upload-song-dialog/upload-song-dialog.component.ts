import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FileUpload } from 'primeng/primeng';
import * as ID3 from 'id3-parser';
import { parse, parseV1Tag, parseV2Tag } from 'id3-parser';
import universalParse from 'id3-parser/lib/universal';
import { IID3Tag } from 'id3-parser/lib/interface';
import { WebApiService } from '../../_services/web-api.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { SongWithData, SongUploadService } from '../../_services/song-upload.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import swal from 'sweetalert2';
import * as $ from 'jquery';

export class InputDialogData {
  albumId? = 'Input Box';
  
}
@Component({
  selector: 'app-upload-song-dialog',
  templateUrl: './upload-song-dialog.component.html',
  styleUrls: ['./upload-song-dialog.component.css']
})
export class UploadSongDialogComponent implements OnInit {
   error = '';
   fileuploadsize :any;
   fileuploadsizeinbytes :any;
   delsongid:any;
   totalsongcount : any;
  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<UploadSongDialogComponent>,
    private sus: SongUploadService,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData, private spinnerService: Ng4LoadingSpinnerService) { }

  @ViewChild('fileUpload') fileUpload:FileUpload;
  songFiles: SongWithData[] = [];

  ngOnInit() {
    this.spinnerService.show();
    this.api.songuploadsRemainingCountByUser().subscribe(response => {
      this.spinnerService.hide();
          this.totalsongcount = response;
      });
    this.spinnerService.show();
      this.api.getinfoSiteconfig().subscribe(response => {
      this.spinnerService.hide();
      this.fileuploadsize = response.fileuploadsize;
      this.fileuploadsizeinbytes = response.fileuploadsize * 1024 * 1024;
          
      });
  }

  onNoClick(){
    let self = this;
    self.closeDialog();
  }

  closeDialog(){
    let self = this; 
    self.dialogRef.close(self.songFiles[0]);
  }
  cancelDialog(){
    let self = this;
    if(this.delsongid){
      self.sus.dequeueSong();
        self.api.deletesongs(this.delsongid).subscribe(response => {
         self.dialogRef.close(); 
      });
    }else{
      self.dialogRef.close();
    }
    
    //self.dialogRef.close();
  }
  selectSong($event){
    let self = this;
    var FileSize = $event.files[0].size / 1024 / 1024; // in MB
    if(FileSize >this.totalsongcount){
      swal(
          'Your Song Uploads Limit Remaining Filesize is ' +this.totalsongcount+ ' MB or below',
          'Please Upload New Song File',
          'warning'
        );
    }else{
       if (FileSize > this.fileuploadsize) {
        //alert('File size exceeds 10 MB'); I4hYlspc
         swal(
          'Filesize must '+this.fileuploadsize+ 'MB or below',
          'Please Upload New Song File',
          'warning'
        );
    } else {
      this.spinnerService.show();
      Array.from($event.files).forEach(f => 
        self.readID3Tag(<File>f)
      );
      this.spinnerService.hide();
    }
    }
   
    /*Array.from($event.files).forEach(f => 
      self.readID3Tag(<File>f)

      );*/

  }


  private readID3Tag(file: File) {

    let self = this;
    //self.sus.dequeueSong();
    if(this.delsongid){
      self.sus.dequeueSong();
        self.api.deletesongs(this.delsongid).subscribe(response => {
      });
    }
    var FileSize = file.size / 1024 / 1024; // in MB
    console.log(FileSize);
    (<any>file).status = 'Reading metadata...';
    universalParse(file).then(tag => {
      console.log('ID3Tag', tag);
      /*if (!tag.title || !tag.artist || !tag.genre) {
        //alert(`File: ${file.name} must contain tags for title, artist, and genre.`);
        var errorval=`File: ${file.name} must contain tags for title, artist, and genre.`;
        this.error = errorval;
        (<any>file).status = 'Error: Missing info.';
      }
      else {*/
        //console.log('ID3Tag', tag);

        //read bytes
      var image = tag.image;
      if (image) {
        var base64String = "";
        for (var i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
        }
        var base64 = "data:" + image.mime + ";base64," +
                window.btoa(base64String);
        console.log(base64);        
      }

        let fr = new FileReader();
        fr.onload = () => {
          let song = new SongWithData(0, tag.title, tag.artist, tag.genre);
          song.albumName = tag.album || '';
          song.copyrightYear = tag.year || '';
          console.log("fr.result",fr.result);
          song.filesize = FileSize;
          song.file = {
              data: fr.result, 
              filename: file.name
            };
            console.log(this.data.albumId);
          song.albumId=this.data.albumId;
          song.artist_image=base64 || '';
          self.songFiles.push(song);
          //this.spinnerService.show();
          
          self.uploadSong(song, file).subscribe(response => {
            console.log(response)
            if(response){
              song.songId = response;
              //this.spinnerService.hide();
              this.delsongid = response;
              //self.sus.enqueueSong(song);
              console.log('SongId ', song.songId);
            }
            
            
          });
        };
         //this.spinnerService.show();
        fr.readAsDataURL(file);
        (<any>file).status = 'Uploading...';
         //this.spinnerService.hide();
      //}
    },
    error => {
      console.log(`Error parsing file: ${file.name}`, error);
      (<any>file).status = 'Error: Parsing';
    });
  }

  private uploadSong(song, file): Observable<number> {
    let self = this;
      console.log(song);
    
    return Observable.create(observer => {
    this.spinnerService.show();
      self.api.uploadSongWithProgress(song).subscribe(event => {
        switch (event.type){
          case HttpEventType.Sent:
            console.log('Request sent!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header received!');
            break;
          case HttpEventType.DownloadProgress:
            const pctLoaded = Math.round(100 * event.loaded / event.total );
            console.log(`Upload in progress! ${ pctLoaded }% loaded`);
            //file.status = `Uploaded ${pctLoaded}%`;
            break;
          case HttpEventType.Response:
            console.log('😺 Done!', event.body);
            file.status = 'Done';
             /*if(file.status == 'Done'){
              this.spinnerService.hide();
            }*/
            observer.next(this.spinnerService.hide());
            observer.next(Number(event.body));
            observer.complete();
            break;
        }
       
      });
    
    });
  }
}
