import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, AdminAuthGuard } from '../_guards/index';
import { MysongcratefriendsComponent } from './mysongcratefriends.component';
import { CurrentSongCrateFriendsComponent } from './CurrentSongCrateFriends/CurrentSongCrateFriends.component';
import { MySongCratePendingRequestsComponent } from './MySongCratePendingRequests/MySongCratePendingRequests.component';
import { SharemySongCrateComponent } from './SharemySongCrate/SharemySongCrate.component';
import { CurrentSongCrateFriendsinfoComponent } from './CurrentSongCrateFriendsinfo/CurrentSongCrateFriendsinfo.component';

import { MyrequestComponent } from './Myrequest/Myrequest.component';
const routes: Routes = [
  {path: 'mysongcratefriends', component: MysongcratefriendsComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo:'CurrentSongCrateFriends', pathMatch: 'full' },
      {path: 'CurrentSongCrateFriends', component: CurrentSongCrateFriendsComponent},
      {path: 'SharemySongCrate', component: SharemySongCrateComponent},
      {path: 'MySongCratePendingRequests', component: MySongCratePendingRequestsComponent},
      {path: 'Myrequest', component: MyrequestComponent},
      {path: 'CurrentSongCrateFriends/:id', component: CurrentSongCrateFriendsinfoComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class MysongcratefriendsRoutingModule {}