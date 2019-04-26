import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

import { MenuComponent } from './menu/menu.component';
import { MaterialDesignModule } from '../material-design-module';
import { SongCardComponent } from './song-card/song-card.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { StarRaterComponent } from './star-rater/star-rater.component';
import { StarRatingModule } from 'angular-star-rating';
import { HomeSongCardComponent } from './home-song-card/home-song-card.component';
import { BrowsesearchSongCardComponent } from './browsesearch-song-card/browsesearch-song-card.component';
import { LibrarySongCardComponent } from './library-song-card/library-song-card.component';
import { AdminSongCardComponent } from './admin-song-card/admin-song-card.component';
import { PortfolioListComponent } from './portfolio-list-card/portfolio-list-card.component';
import { SongcrateSongCardComponent } from './songcrate-song-card/songcrate-song-card.component';
import { AdminAlbumSongCardComponent } from './admin-album-song-card/admin-album-song-card.component';
import { BrowsesearchalbumSongCardComponent } from './browsesearch-album-song-card/browsesearch-album-song-card.component';
import { AlbumSongCardComponent } from './album-song-card/album-song-card.component';
import { AlbumLibrarySongCardComponent } from './album-library-song-card/album-library-song-card.component';

import { ValidationMessageComponent } from '../shared/validation-message/validation-message.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PagerComponent } from './pager/pager.component';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { PaypalComponent } from './paypal/paypal.component';
import { ListApplicationCardComponent } from './list-application-card/list-application-card.component';
import { SongcrateSongListComponent } from './songcrate-song-list/songcrate-song-list.component';
import { GenrescardComponent } from './genres-card/genres-card.component';
import { MessagelistComponent } from './message-list/message-list.component';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FlexLayoutModule,
    MaterialDesignModule,
    StarRatingModule.forRoot()
    
  ],
  declarations: [
    MenuComponent,
    SongCardComponent,
    HomeSongCardComponent,
    BrowsesearchSongCardComponent,
    AudioPlayerComponent,
    StarRaterComponent,
    ValidationMessageComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    ProgressBarComponent,
    PagerComponent,
    ApplicationCardComponent,
    PaypalComponent,
    LibrarySongCardComponent,
    AdminSongCardComponent,
    PortfolioListComponent,
    SongcrateSongCardComponent,
    AdminAlbumSongCardComponent,
    BrowsesearchalbumSongCardComponent,
    AlbumSongCardComponent,
    AlbumLibrarySongCardComponent,
    ListApplicationCardComponent,
    SongcrateSongListComponent,
    GenrescardComponent,
    MessagelistComponent

  ],

  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialDesignModule,
    StarRatingModule,
    MenuComponent,
    SongCardComponent,
    HomeSongCardComponent,
    BrowsesearchSongCardComponent,
    AudioPlayerComponent,
    StarRaterComponent,
    ValidationMessageComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    ProgressBarComponent,
    PagerComponent,
    ApplicationCardComponent,
    PaypalComponent,
    LibrarySongCardComponent,
    AdminSongCardComponent,
    PortfolioListComponent,
    SongcrateSongCardComponent,
    AdminAlbumSongCardComponent,
    BrowsesearchalbumSongCardComponent,
    AlbumSongCardComponent,
    AlbumLibrarySongCardComponent,
    ListApplicationCardComponent,
    SongcrateSongListComponent,
    GenrescardComponent,
    MessagelistComponent
  ]
})
export class SharedModule { }
