import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


import { MysongcratefriendsComponent } from './mysongcratefriends.component';
import { MysongcratefriendsRoutingModule } from './mysongcratefriends-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CurrentSongCrateFriendsComponent } from './CurrentSongCrateFriends/CurrentSongCrateFriends.component';
import { MySongCratePendingRequestsComponent } from './MySongCratePendingRequests/MySongCratePendingRequests.component';
import { SharemySongCrateComponent } from './SharemySongCrate/SharemySongCrate.component';
import { MyrequestComponent } from './Myrequest/Myrequest.component';
import { CurrentSongCrateFriendsinfoComponent } from './CurrentSongCrateFriendsinfo/CurrentSongCrateFriendsinfo.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MysongcratefriendsRoutingModule,
    SharedModule
  ],
  declarations: [CurrentSongCrateFriendsComponent, MysongcratefriendsComponent,
  MySongCratePendingRequestsComponent,SharemySongCrateComponent,MyrequestComponent,CurrentSongCrateFriendsinfoComponent],

  bootstrap: [MysongcratefriendsComponent]
})
export class MysongcratefriendsModule {}
