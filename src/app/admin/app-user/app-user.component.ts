import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { PageEvent } from '@angular/material';
import { PagerComponent, PagerConfig } from '../../shared/pager/pager.component';
import { AdminUser } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import swal from 'sweetalert2';

@Component({
  selector: 'app-app-user',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css']
})
export class AppUserComponent implements OnInit {

  numColumns = 2; rowHeight = '2:1';
  usersaccess :boolean = true;
  constructor(private sd: SharedDataService, private api: WebApiService,
   private media: ObservableMedia, private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Admin-Application Review';
    let temp = JSON.parse(localStorage.getItem('currentUser'));
    this.spinnerService.show();
    this.api.getadminrightsformenu(temp.UserId).subscribe(response => {
      console.log(response);
      this.spinnerService.hide();
      if(response.users == 1){
          this.usersaccess = true;
      }else{
        this.usersaccess = false;
      }

     });

  }

  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedApplications: AdminUser[];
  //songs: Song[];

  ngOnInit() {
    let self = this;

    self.media.subscribe(change => {
      console.log('Media changed ', change);
      if (change.mqAlias == 'xs'){
        self.numColumns = 1;
        self.rowHeight = '2:1';
      }
      else {
        self.numColumns = 2;
        self.rowHeight = '2:1';
      }
    });

    self.configurePager();
  }
  private configurePager(){
    let self = this;
    self.sd.showProgressBar('Retrieving applications count');
    this.spinnerService.show();
    self.api.getAdminuserCount().subscribe(response => {
      self.pager = self.pagerCtrl.getPager(response);
      self.pagerCtrl.setPage(1);
      self.sd.hideProgressBar();
      this.spinnerService.hide();
    })
  }

  onLoadPageHandler(){
    let self = this;
    
      self.sd.showProgressBar(`Retrieving applications ${self.pager.startIndex} to ${self.pager.endIndex}`);
      this.spinnerService.show();
      self.getAdminuser().subscribe(response => {
        this.spinnerService.hide();
        self.pagedApplications = response;
        self.sd.hideProgressBar();
      });
    
  }

  getAdminuser(){
    let self = this;
    let skip = self.pager.startIndex;
    let take = self.pager.endIndex - self.pager.startIndex + 1;
    return self.api.getAdminuser(skip, take);
  }

  deleteadminuser(userid){
     swal({
            title: 'Are you sure you wan to delete this User?',
            text: "",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {
            this.spinnerService.show();
             this.api.deleteadminuser(userid).subscribe(response => { 
               this.spinnerService.hide();
               
               swal({
                    title: 'User Deleted Successfully',
                    text: "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ok'
                  }).then((result) => {
                    if (result.value) {
                      this.ngOnInit();
                }  
                  });
               
              });
        }
      });
    
  }
  rightsadminuser(userid){
    console.log(userid);
  }
  
}
