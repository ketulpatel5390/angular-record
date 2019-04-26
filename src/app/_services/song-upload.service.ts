import { Injectable } from '@angular/core';
import { Song } from '../_models/songbook-life';

import * as Collections from 'typescript-collections';
import { MatDialog } from '@angular/material';
import { ObservableProperty } from '../_models/observable-property';

export class SongWithData  {
  constructor(public songId: number, public title: string = '', public artistName: string = '', public genre: string = ''){}
  subGenre = '';
  label = '';
  artistCityState = '';
  artistCountry = '';
  albumName = '';
  copyrightYear: string = '';
  copyrightOwner = '';
  albumId :string = '';
   filesize :number;
  file: {
    data: string; 
    filename: string;
  }
  artist_image = '';
}

@Injectable()
export class SongUploadService {

  constructor(private dialog: MatDialog) {
    let self = this;
    self.songsToEdit = new Collections.Queue<SongWithData>(); 
    self.dialog.afterAllClosed.subscribe(()=>self.processQueue());
  }

  songToEdit = new ObservableProperty<SongWithData>();
  songToDistribute = new ObservableProperty<SongWithData>();

  private songsToEdit = new Collections.Queue<SongWithData>(); 
  private songsToDistribute = new Collections.Queue<SongWithData>(); 

  enqueueSong(song: SongWithData) {
    let self = this;
    if (self.dialog.openDialogs == null || self.dialog.openDialogs.length <= 0) {
      //no dialogs open so go straight to edit
      self.songToEdit.value = song;
    }
    else {
      self.songsToEdit.enqueue(song);
    }
  }

  distributeSong(song: SongWithData){
    let self = this;
    if (self.dialog.openDialogs == null || self.dialog.openDialogs.length <= 0) {
      //no dialogs open so go straight to distribute
      self.songToDistribute.value = song;
    }
    else {
      self.songsToDistribute.enqueue(song);
    }

  }

  private processQueue() {
    let self = this;
    if (!self.songsToEdit.isEmpty()) {
      let song = self.songsToEdit.dequeue();
      self.songToEdit.value = song;
      console.log('Editing', song);
    }
    else if (!self.songsToDistribute.isEmpty()) {
      let song =self.songsToDistribute.dequeue();
      self.songToDistribute.value = song;
      console.log('Distributing', song);
   
    }
  }
  dequeueSong() {
    let self = this;
    self.songsToEdit.dequeue();
  }
}
