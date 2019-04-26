import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import { WebApiService } from '../../_services/web-api.service';
import { ObservableMedia } from '@angular/flex-layout';
import { AlertService} from '../../_services/alert.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { environment } from '../../../environments/environment';
import swal from 'sweetalert2';
import { MessageDetails} from '../../_models/songbook-life';
@Component({
  selector: 'app-messagelist',
  templateUrl: './messagelist.component.html',
  styleUrls: ['./messagelist.component.css']
})
export class MessagelistComponent implements OnInit {


  //public routerLinkVariable = "/editprofile";
  messagelist : MessageDetails[];
  constructor(
     private router: Router,
      private sd: SharedDataService, 
      private api: WebApiService, 
      private media: ObservableMedia,
       private dialog: MatDialog,
       private alertService: AlertService, private spinnerService: Ng4LoadingSpinnerService
      ) { 
    let self = this;
    //debugger;
    self.sd.pageTitle.value = 'My Account';
    
    
  }
 

  ngOnInit() {
    let self = this;
    this.spinnerService.show();
        this.api.getmessagedetails().subscribe(response => {
          this.spinnerService.hide();
          self.messagelist = response;
         
         self.sd.hideProgressBar();
        });
    
  }

}
