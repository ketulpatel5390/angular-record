import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../_guards/index';

import {ReviewMusicComponent} from './review-music/review-music.component';
import { GetMusicComponent } from './get-music.component';
import { FindMusicComponent } from './find-music/find-music.component';
import { LibraryComponent } from './library/library.component';
import { AlbumFindMusicComponent } from './album-find-music/album-find-music.component';
import {ReviewMusicalbumComponent} from './album-review-music/album-review-music.component';
import {BrowsebygenreComponent} from './browse-by-genre/browse-by-genre.component';
const routes: Routes = [
  {path: 'getMusic', component: GetMusicComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo:'reviewMusic', pathMatch: 'full' },
      {path: 'reviewMusic', component: ReviewMusicComponent},
      {path: 'findMusic', component: FindMusicComponent},
      {path: 'library', component: LibraryComponent},
      {path: 'AlbumMusic/:id', component: AlbumFindMusicComponent},
      {path: 'reviewMusicalbum/:id', component: ReviewMusicalbumComponent},
       {path: 'Browsebygenre', component: BrowsebygenreComponent},
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class GetMusicRoutingModule {}