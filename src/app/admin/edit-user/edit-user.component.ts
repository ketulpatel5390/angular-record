import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { PageEvent } from '@angular/material';
import { PagerComponent, PagerConfig } from '../../shared/pager/pager.component';
import { AdminUser } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import { Routes, RouterModule,ActivatedRoute,Router } from '@angular/router';
import { FormControl, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { MyValidators } from '../../my-validators';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  adminuserform: FormGroup;
  error = '';
  msgstatus= '';
  adminuser : AdminUser;
   usersaccess :boolean = true;
  constructor( private router: Router,private sd: SharedDataService,private route: ActivatedRoute, private api: WebApiService,
   private media: ObservableMedia, private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
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
    let id = this.route.snapshot.paramMap.get('id');
    console.log("User id", id);

     this.adminuserform = new FormGroup({
        userId: new FormControl(""),
        username: new FormControl("",Validators.compose([Validators.required, Validators.minLength(5)])),
        password: new FormControl(""),
        confirmPassword: new FormControl(""),
        email: new FormControl("",Validators.compose([Validators.required,Validators.email])),
        admin_status: new FormControl("",Validators.compose([Validators.required]))
      });
      this.spinnerService.show();
     this.api.getadmindetails(id).subscribe(response => {
       this.adminuser =response;
        this.spinnerService.hide();
       console.log(this.adminuser);

       this.adminuserform.setValue({
         userId: this.adminuser.UserId,
         username: this.adminuser.Username,
         admin_status: this.adminuser.admin_status,
         email:this.adminuser.email,
         password: '',
         confirmPassword: '',
       });
      });

  }
  onSubmitHandler()
  {
      console.log("adminuserform",this.adminuserform.value);
      if ( this.adminuserform.value.password == this.adminuserform.value.confirmPassword){
         this.spinnerService.show();
       this.api.editadminuser(this.adminuserform.value.userId,this.adminuserform.value.username,
                             this.adminuserform.value.admin_status,this.adminuserform.value.email,this.adminuserform.value.password).subscribe(response => {
            console.log('Add User Response', response);
             this.spinnerService.hide();
            if(response){
              //this.msgstatus = 'User Added Successfully.';
             // this.adminuserform.reset();
              //this.ngOnInit();
              swal({
                        title: 'User Updated Successfully',
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
        //this.msgstatus = 'User Added Successfully.';
     }else{
       this.error="New Password and Confirm Password Not Match";
     }
  }
 
}
