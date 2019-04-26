import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/primeng';
import * as ID3 from 'id3-parser';
import { parse, parseV1Tag, parseV2Tag } from 'id3-parser';
import universalParse from 'id3-parser/lib/universal';
import { IID3Tag } from 'id3-parser/lib/interface';
import { WebApiService } from '../../_services/web-api.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { SongWithData, SongUploadService } from '../../_services/song-upload.service';
import { FormControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-upload-album-dialog',
  templateUrl: './upload-album-dialog.component.html',
  styleUrls: ['./upload-album-dialog.component.css']
})
export class UploadAlbumDialogComponent implements OnInit {
   error = '';
   successerror = '';
   albumform: FormGroup;
  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<UploadAlbumDialogComponent>,
    private sus: SongUploadService, private spinnerService: Ng4LoadingSpinnerService) { }



  ngOnInit() {
    this.albumform = new FormGroup({
      albumtype: new FormControl("", Validators.compose([Validators.required]))
    });
  }

  onNoClick(){
    let self = this;
    self.closeDialog();
  }

  closeDialog(){
    let self = this;
    this.error = '';
    if (self.albumform.valid){
      this.error = '';
      self.dialogRef.close(self.albumform.value.albumtype);
    }else{
      this.error = '';
      this.error = 'Please Select Album Type';
    }
    
  }
  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }

}
