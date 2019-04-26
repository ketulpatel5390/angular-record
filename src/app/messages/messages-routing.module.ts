import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, AdminAuthGuard } from '../_guards/index';
import { MessagesComponent } from './messages.component';
import { MessagelistComponent } from './messagelist/messagelist.component';
import { MessagelistbysongComponent } from './messagelistbysong/messagelistbysong.component';
const routes: Routes = [
  {path: 'messages', component: MessagesComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo:'messageslist', pathMatch: 'full' },
      {path: 'messageslist', component: MessagelistComponent},
      {path: 'messageslistbysong/:id', component: MessagelistbysongComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class MessagesRoutingModule {}