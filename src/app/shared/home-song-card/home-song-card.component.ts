import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, MusicEvent, MusicEventActions } from '../../_services/shared-data.service';
import {environment} from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmFeedbackDialogComponent } from '../../dialogs/confirm-feedback-dialog/confirm-feedback-dialog.component';
import { ISubscription } from 'rxjs/Subscription';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-home-song-card',
  templateUrl: './home-song-card.component.html',
  styleUrls: ['./home-song-card.component.css']
})
export class HomeSongCardComponent implements OnInit{


  constructor(private api: WebApiService, private sd: SharedDataService, private dialog: MatDialog, 
    private spinnerService: Ng4LoadingSpinnerService) { }

  @Input() inLibrary = true;
  @Input() song: Song;

  
  imageSource: string;
externalimage: string;
 

  private _subscriptions: ISubscription[] = [];

  ngOnInit() {
    let self = this;
    let baseulrs=environment.baseulrs;
    //self.imageSource = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/noimage.png`;
    self.externalimage = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/grid-world.png`;


    if (self.song.ImageSource == null){
      this.spinnerService.show();
      self._subscriptions.push(self.api.getfrontartistImage(self.song.artist_image)
        .subscribe(response => {
          this.spinnerService.hide();
          if (response.endsWith(',')){
            console.error('No image for ', self.song.artist_image);
            
          }
          else{

             self.imageSource = self.song.ImageSource = response;
          }
        })
      );
    }
    else{
      self.imageSource = self.song.ImageSource;
    }
  }
/*
  ngOnDestroy(){
    let self = this;
    console.log('Unsubscribing getArtistImage ', self.song.artist_image);
    self._subscriptions.forEach(s => {
      s.unsubscribe();
    });
  }
*/


}
