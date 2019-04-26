import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, AdminAuthGuard } from '../_guards/index';
import { MysongcrateComponent } from './mysongcrate.component';
import { SongbyArtistComponent } from './songbyArtist/songbyArtist.component';
import { SonginmycrateComponent } from './songinmycrate/songinmycrate.component';
import { SongbyGenreComponent } from './songbyGenre/songbyGenre.component';
import { AlbuminmycrateComponent } from './albuminmycrate/albuminmycrate.component';

const routes: Routes = [
  {path: 'mysongcrate', component: MysongcrateComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo:'songinmycrate', pathMatch: 'full' },
      {path: 'songinmycrate', component: SonginmycrateComponent},
      {path: 'songbyArtist', component: SongbyArtistComponent},
      {path: 'songbyGenre', component: SongbyGenreComponent},
      {path: 'albuminmycrate/:id', component: AlbuminmycrateComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class MysongcrateRoutingModule {}