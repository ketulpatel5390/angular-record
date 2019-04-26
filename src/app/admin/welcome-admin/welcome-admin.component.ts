import { Component, OnInit } from '@angular/core';
import { NavLink } from '../../_models/songbook-life';
import { SharedDataService,IToken } from '../../_services/shared-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-welcome-admin',
  templateUrl: './welcome-admin.component.html',
  styleUrls: ['./welcome-admin.component.css']
})
export class WelcomeAdminComponent implements OnInit {

  
  constructor(private sd: SharedDataService) {

   }

  ngOnInit() {
  }
  

}
