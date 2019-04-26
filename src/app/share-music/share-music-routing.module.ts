import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../_guards/index';
import { ShareMusicComponent } from './share-music.component';
import { UploadMusicComponent } from './upload-music/upload-music.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { EditsongComponent } from './editsong/editsong.component';
import { SongReportsComponent } from './SongReports/SongReports.component';
import { AlbumReportsComponent } from './AlbumReports/AlbumReports.component';

const routes: Routes = [
  {path: 'shareMusic', component: ShareMusicComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo:'portfolio', pathMatch: 'full' },
      {path: 'uploadMusic', component: UploadMusicComponent},
      {path: 'portfolio', component: PortfolioComponent},
      {path: 'editsong', component: EditsongComponent},
      { path: 'SongReports/:id', component: SongReportsComponent },
      { path: 'getAlbumbyId/:id', component: AlbumReportsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})export class ShareMusicRoutingModule { }
