import { Component, OnInit } from '@angular/core';
import { NavLink } from '../_models/songbook-life';
import { SharedDataService } from '../_services/shared-data.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

 

  constructor(private sd: SharedDataService) {
    let self = this;
    self.sd.pageTitle.value = 'Admin';

   }

  ngOnInit() {
  }


}
