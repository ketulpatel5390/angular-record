import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { PageEvent } from '@angular/material';
import { PagerComponent, PagerConfig } from '../../shared/pager/pager.component';
import { AdminUser,AdminRights } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import { Routes, RouterModule,ActivatedRoute,Router } from '@angular/router';
import { FormControl, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { MyValidators } from '../../my-validators';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-rights-user',
  templateUrl: './rights-user.component.html',
  styleUrls: ['./rights-user.component.css']
})
export class RightsUserComponent implements OnInit {

  adminuserform: FormGroup;
  error = '';
  msgstatus= '';
  adminuser : AdminUser;
  adminrights : AdminRights;
  app : boolean = false;
  mus : boolean = false;
  site : boolean = false;
  user : boolean = false;
  audl : boolean = false;
  loga : boolean = false;
  mediadistributiona : boolean = false;
  packagesetting : boolean = false;
  
   usersaccess :boolean = true;
  constructor(private sd: SharedDataService,private route: ActivatedRoute, private api: WebApiService, 
    private media: ObservableMedia, private spinnerService: Ng4LoadingSpinnerService,private router: Router) { 
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
        applications: new FormControl(""),
        music: new FormControl(""),
        siteconfig: new FormControl(""),
        users: new FormControl(""),
        auditlogs: new FormControl(""),
        logs: new FormControl(""),
        mediadistribution:new FormControl("") ,
        packagesetting: new FormControl(""),
      });
      this.spinnerService.show();
     this.api.getadminrights(id).subscribe(response => {
        this.spinnerService.hide();
       if(response)
       {
             this.adminrights =response;
             console.log(this.adminrights);
             if(this.adminrights.application == 1){
               this.app = true;
              }else{
                this.app = false;
              }
             if(this.adminrights.music == 1){
                this.mus = true;
             }else{
                this.mus = false;
              }
             if(this.adminrights.sitesetting == 1){
               this.site =true;
             }else{
                this.site =false;
              }
             if(this.adminrights.users == 1){
                this.user =true;
             }else{
                this.user =false;
              }
             if(this.adminrights.auditlog == 1){
                this.audl =true;
             }else{
                this.audl =false;
              }
             if(this.adminrights.logs == 1){
                this.loga =true;
             }else{
                this.loga =false;
              }
            if(this.adminrights.mediadistribution == 1){
              this.mediadistributiona =true;
            }else{
              this.mediadistributiona =false;
            }
            if(this.adminrights.packagesetting == 1){
              this.packagesetting =true;
            }else{
              this.packagesetting =false;
            }
       }
        this.adminuserform.setValue({
         userId: id,
         applications:this.app,
         music: this.mus,
         siteconfig: this.site,
         users: this.user,
         auditlogs: this.audl,
         logs: this.loga,
         mediadistribution: this.mediadistributiona,
         packagesetting:this.packagesetting,

       });
      });

  }
  onSubmitHandler()
  {
    let id = this.route.snapshot.paramMap.get('id');
      console.log("adminuserform",this.adminuserform.value);
       this.spinnerService.show();
      this.api.editadminrights(JSON.stringify(this.adminuserform.value)).subscribe(response => {
            console.log('Add User Response', response);
             this.spinnerService.hide();
            
        });
        //window.location.reload();
        //this.ngOnInit();
        //this.msgstatus = 'Rights Successfully Updated .';
        // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['admin/users/rightsuser/',id]));
         swal({
              title: 'Rights has been successfully Updated?',
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
          }).then((result) => {
              if (result.value) 
              {
                 this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['admin/users/rightsuser/',id]));
              }
        })         
        
    
  }
 
}
