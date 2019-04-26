import { NgModule } from "@angular/core";
import { GetMusicComponent } from "./get-music.component";
import { GetMusicRoutingModule } from "./get-music-routing.module";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FindMusicComponent } from './find-music/find-music.component';
import { LibraryComponent } from './library/library.component';
import { AlbumFindMusicComponent } from './album-find-music/album-find-music.component';
import {ReviewMusicalbumComponent} from './album-review-music/album-review-music.component';
import {BrowsebygenreComponent} from './browse-by-genre/browse-by-genre.component';


@NgModule({
  declarations: [
    GetMusicComponent,
    FindMusicComponent,
    LibraryComponent,
    AlbumFindMusicComponent,
    ReviewMusicalbumComponent,
    BrowsebygenreComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    GetMusicRoutingModule,
  ],
  providers: [
  ],
  bootstrap: [GetMusicComponent]
})
export class GetMusicModule { }
