import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import {FileUploadModule} from 'primeng/primeng';

import { ShareMusicComponent } from "./share-music.component";
import { UploadMusicComponent } from "./upload-music/upload-music.component";
import { PortfolioComponent } from "./portfolio/portfolio.component";
import { ShareMusicRoutingModule } from "./share-music-routing.module";
import { EditsongComponent } from './editsong/editsong.component';
import { SongReportsComponent } from './SongReports/SongReports.component';
import { AlbumReportsComponent } from './AlbumReports/AlbumReports.component';


@NgModule({
  declarations: [
    ShareMusicComponent,
    UploadMusicComponent,
    PortfolioComponent,
    EditsongComponent,
    SongReportsComponent,
    AlbumReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FileUploadModule,
    SharedModule,
    ShareMusicRoutingModule
  ],
  providers: [
  ],
  bootstrap: [ShareMusicComponent]
})
export class ShareMusicModule { }
