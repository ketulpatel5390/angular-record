import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SongbyArtistComponent } from './songbyArtist/songbyArtist.component';
import { MysongcrateComponent } from './mysongcrate.component';
import { MysongcrateRoutingModule } from './mysongcrate-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SonginmycrateComponent } from './songinmycrate/songinmycrate.component';
import { SongbyGenreComponent } from './songbyGenre/songbyGenre.component';
import { AlbuminmycrateComponent } from './albuminmycrate/albuminmycrate.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MysongcrateRoutingModule,
    SharedModule
  ],
  declarations: [
  				SongbyArtistComponent, 
  				MysongcrateComponent,
  				SonginmycrateComponent,
  				SongbyGenreComponent,
  				AlbuminmycrateComponent
  				],

  bootstrap: [MysongcrateComponent]
})
export class MysongcrateModule {}
