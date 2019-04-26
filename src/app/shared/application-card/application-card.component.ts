import { Component, OnInit, Input } from '@angular/core';
import { Application } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent implements OnInit {


  constructor(private api: WebApiService, private sd: SharedDataService, 
    private spinnerService: Ng4LoadingSpinnerService) { }

  @Input() application: Application;
  
  ngOnInit() {
  }

  approveApplication(){
    let self = this;
    console.log(`Approve application ${self.application.AppId}`);
    self.sd.showProgressBar('Approving application');
    this.spinnerService.show();
    self.api.approveApplication(self.application.AppId).subscribe(response => {
      this.spinnerService.hide();
      console.log('Approve Application Response', response);
      if (response == 1) self.application.Approval_Status = 'A';
      self.sd.hideProgressBar();
    });

  }

  closeApplication() {
    let self = this;
    console.log(`Close application ${self.application.AppId}`);
    self.sd.showProgressBar('Closing application');
    this.spinnerService.show();
    self.api.updateApplicationStatus(self.application.AppId, 'C').subscribe(response => {
      this.spinnerService.hide();
      console.log('Close Application Response', response);
      if (response == 1) self.application.Approval_Status = 'C';
      self.sd.hideProgressBar();
    });
  }

  rejectApplication() {
    let self = this;
    console.log(`Reject application ${self.application.AppId}`);
    self.sd.showProgressBar('Rejecting application');
    this.spinnerService.show();
    self.api.rejectApplication(self.application.AppId).subscribe(response => {
      this.spinnerService.hide();
      console.log('Reject Application Response', response);
      if (response == 1) self.application.Approval_Status = 'D';
      self.sd.hideProgressBar();
    });
  }

  reopenApplication() {
    let self = this;
    console.log(`Reopen application ${self.application.AppId}`);
    self.sd.showProgressBar('Reopening application');
    this.spinnerService.show();
    self.api.updateApplicationStatus(self.application.AppId, 'A').subscribe(response => {
      this.spinnerService.hide();
      console.log('Reopen Application Response', response);
      if (response == 1) self.application.Approval_Status = 'A';
      self.sd.hideProgressBar();
    });
  }

  undoApplication() {
    let self = this;
    console.log(`Undo application ${self.application.AppId}`);
    self.sd.showProgressBar('Undoing rejection');
    this.spinnerService.show();
    self.api.updateApplicationStatus(self.application.AppId, 'P').subscribe(response => {
      this.spinnerService.hide();
      console.log('Undo Application Response', response);
      if (response == 1) self.application.Approval_Status = 'P';
      self.sd.hideProgressBar();
    });
  }
  deleteApplication(){
     let self = this;
     console.log(`Delete application ${self.application.AppId}`);
   
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
        self.api.deleteApplication(self.application.AppId).subscribe(response => {
          this.spinnerService.hide();
          swal(
          'Deleted!',
          'Application has been deleted.',
          'success'
        )
        });
        
      }
    })
  }
}
