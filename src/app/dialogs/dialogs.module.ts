import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmFeedbackDialogComponent } from './confirm-feedback-dialog/confirm-feedback-dialog.component';
import { UploadSongDialogComponent } from './upload-song-dialog/upload-song-dialog.component';
import { MaterialDesignModule } from '../material-design-module';
import { FileUploadModule } from 'primeng/primeng';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditSongDialogComponent } from './edit-song-dialog/edit-song-dialog.component';
import { DistributeSongDialogComponent } from './distribute-song-dialog/distribute-song-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { EditGeneralinfoDialogComponent } from './edit-generalinfo/edit-generalinfo.component';
import { EditGetmusicDialogDialogComponent } from './edit-getmusic-dialog/edit-getmusic-dialog.component';


import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { EditfeedbackDialogComponent } from './edit-feedback-dialog/edit-feedback-dialog.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SongMessageDialogComponent } from './song-message-dialog/song-message-dialog.component';
import { SongcrateDialogComponent } from './songcrate-dialog/songcrate-dialog.component';

import { GeolocationMessageDialogComponent } from './geolocation-message-dialog/geolocation-message-dialog.component';

import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { UploadAlbumDialogComponent } from './upload-album-dialog/upload-album-dialog.component';
import { AlbumdetailDialogComponent } from './albumdetail-dialog/albumdetail-dialog.component';
import { GenresdisplayDialogComponent } from './genres-display-dialog/genres-display-dialog.component';
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialDesignModule,
    FileUploadModule,
    SharedModule,
    MultiselectDropdownModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  declarations: [
    ConfirmFeedbackDialogComponent,
    UploadSongDialogComponent,
    EditSongDialogComponent,
    DistributeSongDialogComponent,
    InputDialogComponent,
    ChangePasswordDialogComponent,
    LoginDialogComponent,
    EditGeneralinfoDialogComponent,
    EditGetmusicDialogDialogComponent,
    AlertDialogComponent,
    EditfeedbackDialogComponent,
    MessageDialogComponent,
    SongMessageDialogComponent,
    GeolocationMessageDialogComponent,
    SongcrateDialogComponent,
    UploadAlbumDialogComponent,
    AlbumdetailDialogComponent,
    GenresdisplayDialogComponent,
  ],
  entryComponents:[
    ConfirmFeedbackDialogComponent,
    UploadSongDialogComponent,
    EditSongDialogComponent,
    DistributeSongDialogComponent,
    InputDialogComponent,
    ChangePasswordDialogComponent,
    LoginDialogComponent,
    EditGeneralinfoDialogComponent,
    EditGetmusicDialogDialogComponent,
    AlertDialogComponent,
    EditfeedbackDialogComponent,
    MessageDialogComponent,
    SongMessageDialogComponent,
    GeolocationMessageDialogComponent,
    SongcrateDialogComponent,
    UploadAlbumDialogComponent,
    AlbumdetailDialogComponent,
    GenresdisplayDialogComponent,
  ]
})
export class DialogsModule { }
