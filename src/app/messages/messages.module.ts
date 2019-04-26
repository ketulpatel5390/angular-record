import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MessagesComponent } from './messages.component';
import { MessagelistComponent } from './messagelist/messagelist.component';
import { MessagelistbysongComponent } from './messagelistbysong/messagelistbysong.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MessagesRoutingModule,
    SharedModule
  ],
  declarations: [
          MessagesComponent,
  				MessagelistComponent,
          MessagelistbysongComponent,
           
  				],

  bootstrap: [MessagesComponent]
})
export class MessagesModule {}
