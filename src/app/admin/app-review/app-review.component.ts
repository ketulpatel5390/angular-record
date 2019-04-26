import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { PageEvent } from '@angular/material';
import { PagerComponent, PagerConfig } from '../../shared/pager/pager.component';
import { Application } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-app-review',
  templateUrl: './app-review.component.html',
  styleUrls: ['./app-review.component.css']
})
export class AppReviewComponent implements OnInit {

  numColumns = 2; rowHeight = '2:1';
  gridshow=true;
  gridhide=false;
  displayMode =1; 
  applicationaccess :boolean = true;
  search;
  
  searchby: string = '';
  key: string = 'test'; //set default
  reverse: boolean = false;
  sortkey: string = ''; //set default
  sortreverse: boolean = false;
  constructor(private sd: SharedDataService, private api: WebApiService, 
    private media: ObservableMedia, private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Admin-Application Review';
    let temp = JSON.parse(localStorage.getItem('currentUser'));
    this.spinnerService.show();
    this.api.getadminrightsformenu(temp.UserId).subscribe(response => {
      console.log(response);
      this.spinnerService.hide();
      if(response.application == 1){
          this.applicationaccess = true;
      }else{
        this.applicationaccess = false;
      }

     });

  }

  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedApplications: Application[];
  //songs: Song[];

  ngOnInit() {
    let self = this;
    self.configurePager(this.searchby,this.sortkey,this.sortreverse);
  }
  private configurePager(searchby,sortkey,sortreverse){

    console.log(searchby,sortkey,sortreverse);
    let self = this;
    //self.sd.showProgressBar('Retrieving applications count');
    this.spinnerService.show();
    self.api.getApplicationsCount(searchby,sortkey,sortreverse).subscribe(response => {

      self.pager = self.pagerCtrl.getPager(response);
      self.pagerCtrl.setPage(1);
      this.spinnerService.hide();
     // self.sd.hideProgressBar();
    })
  }

  onLoadPageHandler(searchby,sortkey,sortreverse){
    let self = this;
    this.spinnerService.show();
    self.getApplications(searchby,sortkey,sortreverse).subscribe(response => {
        self.pagedApplications = response;
        this.spinnerService.hide();
       
    });
    
  }

  getApplications(searchby,sortkey,sortreverse){
    let self = this;
   
    let skip = self.pager.startIndex;
    let take = self.pager.endIndex - self.pager.startIndex + 1;
    return self.api.getApplications(skip, take, searchby,sortkey,sortreverse);
  }
	filterItem(searchname){

      if(!searchname){
        this.searchby='';
        //this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
        this.configurePager(this.searchby,this.sortkey,this.sortreverse);
      }else{
        this.searchby=searchname;
        this.configurePager(this.searchby,this.sortkey,this.sortreverse);
        /*this.api.getSearchApplications(searchname).subscribe(response => { 
         this.pagedApplications = response;
         this.pager = new PagerConfig();
        });*/
      }  
       //this.pager = new PagerConfig();

    }
  gridhides(){
    this.gridshow=false;
    this.gridhide=true;
    $(".list_btn_show").addClass('active');
    $(".grid_btn_show").removeClass('active');
    this.displayMode=2;
  }
  gridshows(){
    this.gridshow=true;
    this.gridhide=false;
    $(".grid_btn_show").addClass('active');
    $(".list_btn_show").removeClass('active');
    this.displayMode=1;
      
  }
    approveApplication(AppId){
    let self = this;
    //self.sd.showProgressBar('Approving application');
    this.spinnerService.show();
    self.api.approveApplication(AppId).subscribe(response => {
      //console.log('Approve Application Response', response);
      this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
      this.spinnerService.hide();
      //self.sd.hideProgressBar();
    });

  }

  closeApplication(AppId) {
    let self = this;
    //self.sd.showProgressBar('Closing application');
    this.spinnerService.show();
    self.api.updateApplicationStatus(AppId, 'C').subscribe(response => {
      //console.log('Close Application Response', response);
      if (response == 1) this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
      this.spinnerService.hide();
      //self.sd.hideProgressBar();
    });
  }

  rejectApplication(AppId) {
    let self = this;
    //self.sd.showProgressBar('Rejecting application');
    this.spinnerService.show();
    self.api.rejectApplication(AppId).subscribe(response => {
      //console.log('Reject Application Response', response);
      if (response == 1) this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
      this.spinnerService.hide();
      //self.sd.hideProgressBar();
    });
  }

  reopenApplication(AppId) {
    let self = this;
    //self.sd.showProgressBar('Reopening application');
    this.spinnerService.show();
    self.api.updateApplicationStatus(AppId, 'A').subscribe(response => {
      //console.log('Reopen Application Response', response);
      if (response == 1) this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
      this.spinnerService.hide();
      //self.sd.hideProgressBar();
    });
  }

  undoApplication(AppId) {
    let self = this;
    //self.sd.showProgressBar('Undoing rejection');
    this.spinnerService.show();
    self.api.updateApplicationStatus(AppId, 'P').subscribe(response => {
      //console.log('Undo Application Response', response);
      if (response == 1) this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
      this.spinnerService.hide();
      //self.sd.hideProgressBar();
    });
  }
  deleteApplication(AppId,closedate){
     let self = this;
       let today = new Date(); 
       today.setDate(today.getDate() - 30);
      
     
     
      console.log("currdate",closedate);
      console.log("delete-30",today.toLocaleString());
      if(Date.parse(today.toLocaleString()) > Date.parse(closedate)){
        
     
     swal({
      title: 'Are you sure you want to delete this Application?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinnerService.show();
        self.api.deleteApplication(AppId).subscribe(response => {
          this.spinnerService.hide();
          swal(
          'Deleted!',
          'Application has been deleted.',
          'success'
        );
          this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
        });
        
      }
      
    })
      }else{
         swal(
          'Account has been closed for less than 30 days.',
          '',
          'warning'
        );
      }
  }
  resetpassword(username,email){
    this.spinnerService.show();
    this.api.adminresetPasswords(username,email).subscribe(response => {
      console.log(response);
      this.spinnerService.hide();
      swal(
        'Email sent Successfully ',
        'A reset link will be sent to the email associated with user account',
        'success'
      );
      this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
    });
  }
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
    this.sortkey=key;
    this.sortreverse=this.reverse;

    this.configurePager(this.searchby,this.sortkey,this.sortreverse);

  }
  verificationemail(UserId){
    this.spinnerService.show();
    this.api.adminverificationemail(UserId).subscribe(response => {
      console.log(response);
      this.onLoadPageHandler(this.searchby,this.sortkey,this.sortreverse);
      this.spinnerService.hide();
      swal(
        'Verification Email sent Successfully ',
        'A Verification link will be sent to the email associated with user account',
        'success'
      );
      
    });
  }
  
}
