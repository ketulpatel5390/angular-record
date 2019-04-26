import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../_services/web-api.service';
import { SharedDataService } from '../_services/shared-data.service';
import { Router } from '@angular/router';
import { interval } from 'rxjs/observable/interval';

import {environment} from '../../environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

seconds: number = 20;
  siteTitle = environment.siteTitle;
  comfirmmessage : boolean = false;
  intervalId: number;
  constructor(private api: WebApiService, private sd: SharedDataService,
    private router: Router) { 
    

  }

  
  ngOnInit() {
    let self = this;
    if(!self.sd.currentUser || !self.sd.currentUser.UserId) self.router.navigate(['/']);

    this.api.getEmailConfirmation().subscribe(response => {
    if (response) {
      this.sd.currentUser.errvar = 0;
      this.seconds = 0;
      this.comfirmmessage=true;
          }else{
            self.intervalId = window.setInterval(self.getEmailConfirmation, 1000, self);
          }
       });
    
  }

  ngOnDestroy(){
    let self = this;
    window.clearInterval(self.intervalId);

  }

  getEmailConfirmation(self: ConfirmComponent) {

      if (self.seconds-- < 1) {
        self.seconds = 20;
        self.api.getEmailConfirmation().subscribe(response => {
          
          if (response) {

            self.sd.currentUser.errvar = 0;
            //self.router.navigate(['/']);
            self.seconds = 0;
            this.comfirmmessage=true;
            window.clearInterval(this.intervalId);
            self.ngOnInit();
            //$("#approvesuccess").css("display","block");
            //$("#approvesuccess").css("display", "block");
            
          }
        });
      }
  }

}
  

