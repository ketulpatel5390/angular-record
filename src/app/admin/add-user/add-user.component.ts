import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { PageEvent } from '@angular/material';
import { PagerComponent, PagerConfig } from '../../shared/pager/pager.component';
import { AdminUser } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import { FormControl, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { MyValidators } from '../../my-validators';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  adminuserform: FormGroup;
  error = '';
  msgstatus= '';
   usersaccess :boolean = true;
  constructor(private router: Router,private sd: SharedDataService, private api: WebApiService, private media: ObservableMedia, 
    private spinnerService: Ng4LoadingSpinnerService) { 
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
  ngOnInit() {
    let self = this;
    this.adminuserform = new FormGroup({
        username: new FormControl("",Validators.compose([Validators.required, Validators.minLength(5)])),
        password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(5)])),
        confirmPassword: new FormControl("", Validators.compose([Validators.required,MyValidators.sameAs('password', 'Password')])),
        email: new FormControl("",Validators.compose([Validators.required,Validators.email])),
        admin_status: new FormControl("",Validators.compose([Validators.required]))
      });

  }
  onSubmitHandler(){
     console.log("adminuserform",this.adminuserform.value);
     if ( this.adminuserform.value.password == this.adminuserform.value.confirmPassword){
       this.spinnerService.show();
       this.api.addadminuser(this.adminuserform.value.username,this.adminuserform.value.password, 
         this.adminuserform.value.admin_status,this.adminuserform.value.email).subscribe(response => {
            console.log('Add User Response', response);
            this.spinnerService.hide();
            if(response){
              this.msgstatus = 'User Added Successfully.';
              this.adminuserform.reset();
              this.ngOnInit();
              swal({
                        title: 'User Added Successfully',
                        text: "",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                      }).then((result) => {
                        if (result.value) {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/admin/users']));
                    }
                  });
            }else{
              this.error = 'UserName All Ready Exist. Please enter Valid UserName.';
              this.adminuserform.reset();
              this.ngOnInit();
            }
            
        });
     }else{
       this.error="New Password and Confirm Password Not Match";
     }

  }


}
