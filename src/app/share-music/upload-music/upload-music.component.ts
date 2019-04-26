import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { QuestionBase } from '../../question-base';
import { TextboxQuestion } from '../../textbox-question';
import { Validators } from '@angular/forms';
import { DropdownQuestion } from '../../dropdown-question';
import { InduvidualFans,KVPG } from '../../_models/songbook-life';
import * as ID3 from 'id3-parser';
import universalParse from 'id3-parser/lib/universal';
import { IID3Tag } from 'id3-parser/lib/interface';
import { WebApiService } from '../../_services/web-api.service';
import { FileUpload } from 'primeng/primeng';
import { SharedDataService } from '../../_services/shared-data.service';
import { MatDialog } from '@angular/material';
import { UploadSongDialogComponent } from '../../dialogs/upload-song-dialog/upload-song-dialog.component';
import { EditSongDialogComponent } from '../../dialogs/edit-song-dialog/edit-song-dialog.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/concat';
import { SongUploadService, SongWithData } from '../../_services/song-upload.service';
import { DistributeSongDialogComponent } from '../../dialogs/distribute-song-dialog/distribute-song-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-upload-music',
  templateUrl: './upload-music.component.html',
  styleUrls: ['./upload-music.component.css']
})
export class UploadMusicComponent implements OnInit {
  totalsongcount : any;
  inpromember: boolean=false;
  Applicationlist:KVPG[];
  StateorProvinancelist:KVPG[];
  constructor(private api: WebApiService, private sd: SharedDataService, private cdr: ChangeDetectorRef,
    private dialog: MatDialog, private sus: SongUploadService, private spinnerService: Ng4LoadingSpinnerService) { 
      let self = this;
      self.sd.pageTitle.value = 'Upload Music';
      this.spinnerService.show();
      self.api.songuploadsRemainingCountByUser().subscribe(response => {
        this.spinnerService.hide();
          self.totalsongcount = response;
      });
      this.spinnerService.show();
      self.api.getpromember().subscribe(response => { 
        this.spinnerService.hide();
      if (response) {
         this.inpromember=true;
      }
      });
  
    }

  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    this.spinnerService.show();
     self.api.getFavouriteMember().subscribe(response => { 
       this.spinnerService.hide();
        self.Applicationlist = response;
        console.log("getFavouriteMember",self.Applicationlist);
      });
     this.spinnerService.show();
     self.api.getFavouriteMemberStateOrProvinance().subscribe(response => { 
       this.spinnerService.hide();
        self.StateorProvinancelist = response;
        console.log("StateOrProvinance",self.StateorProvinancelist);
      });
    self.sus.songToEdit.onPropertyChanged.subscribe(s => {
      if (s) self.editSong(s);
    });

    self.sus.songToDistribute.onPropertyChanged.subscribe(s => {
      if (s) self.distributeSong(s);
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



  uploadMusic(){
    let self = this;
    let d = self.dialog.open(UploadSongDialogComponent , {  hasBackdrop: true,
              backdropClass: 'cdk-overlay-transparent-backdrop', panelClass: 'custom-dialog-container'});
    d.afterClosed().subscribe(response => {
      if (response){
      
      }

    });
  }

  uploadSong($event){
    let self = this;
    console.log('Upload Song', $event.files);

  }
}
