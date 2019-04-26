import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, AdminAuthGuard } from '../_guards/index';
import { AdminComponent } from './admin/admin.component';
import { AppReviewComponent } from './app-review/app-review.component';
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

const routes: Routes = [
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminAuthGuard],
    children: [
      {path: '', redirectTo:'welcomeadmin', pathMatch: 'full' },
      {path: 'welcomeadmin', component: WelcomeAdminComponent},
      {path: 'appReview', component: AppReviewComponent},
      {path: 'audit', component: AuditComponent},
      {path: 'log', component: LogComponent},
      {path:'songapprovebyadmin', component: SongApproveComponent},
      {path: 'users', component: AppUserComponent},
      {path: 'users/adduser', component: AddUserComponent},
      {path: 'users/edituser/:id', component: EditUserComponent},
      {path: 'users/rightsuser/:id', component: RightsUserComponent},
      {path: 'albumsongapprovebyadmin/:id', component: AlbumsongapproveComponent},
      {path: 'siteconfig', component: SiteconfigComponent},
      {path: 'editsiteconfig/:id', component: EditSiteconfigComponent},
      {path: 'SongReport/:id', component: SongsReportsComponent},
      {path: 'media-distribution', component: MediaDistributionComponent},
      {path: 'packagesetting', component: AccountsettingComponent},
      {path: 'packagesetting/editpackage/:id', component: EditpackageComponent},
      

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class AdminRoutingModule {}