import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppReviewComponent } from './app-review/app-review.component';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuditComponent } from './audit/audit.component';
import { LogComponent } from './log/log.component';
import { SongApproveComponent } from './songapprove/songapprove.component';
import { AppUserComponent } from './app-user/app-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { WelcomeAdminComponent } from './welcome-admin/welcome-admin.component';
import { AlbumsongapproveComponent } from './albumsongapprove/albumsongapprove.component';
import { SiteconfigComponent } from './siteconfig/siteconfig.component';
import { EditSiteconfigComponent } from './editsiteconfig/editsiteconfig.component';
import { RightsUserComponent } from './rights-user/rights-user.component';
import { SongsReportsComponent } from './SongsReports/SongsReports.component';
import { MediaDistributionComponent } from './media-distribution/media-distribution.component';
import { AccountsettingComponent } from './accountsetting/accountsetting.component';
import { EditpackageComponent } from './editpackage/editpackage.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    SharedModule
  ],
  declarations: [
  		AppReviewComponent, 
  		AdminComponent, 
  		AuditComponent, 
  		LogComponent, 
  		SongApproveComponent,
      AppUserComponent,
      AddUserComponent,
      EditUserComponent,
      WelcomeAdminComponent,
      AlbumsongapproveComponent,
      SiteconfigComponent,
      EditSiteconfigComponent,
      RightsUserComponent,
      SongsReportsComponent,
      MediaDistributionComponent,
      AccountsettingComponent,
      EditpackageComponent
  		],

  bootstrap: [AdminComponent]
})
export class AdminModule {}
