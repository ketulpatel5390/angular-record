import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { PageEvent } from '@angular/material';
import { PagerComponent, PagerConfig } from '../../shared/pager/pager.component';
import { PackageDetails } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import { Routes, RouterModule,ActivatedRoute,Router } from '@angular/router';
import { FormControl, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { MyValidators } from '../../my-validators';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as $ from 'jquery';
import swal from 'sweetalert2';

@Component({
  selector: 'app-editpackage',
  templateUrl: './editpackage.component.html',
  styleUrls: ['./editpackage.component.css']
})
export class EditpackageComponent implements OnInit {

  adminpackageform: FormGroup;
  error = '';
  msgstatus= '';
  packagedetail : PackageDetails;
  usersaccess :boolean = true;
  submitted = false;
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
    console.log("package id", id);

     this.adminpackageform = new FormGroup({
        PkgId: new FormControl(""),
        Price: new FormControl("",Validators.compose([Validators.required])),
        mb: new FormControl("",Validators.compose([Validators.required]))
      });
      this.spinnerService.show();
     this.api.getadminpackagedetail(id).subscribe(response => {
       this.packagedetail =response;
        this.spinnerService.hide();
       //console.log(this.packagedetail);

       this.adminpackageform.setValue({
         PkgId: this.packagedetail.PkgId,
         Price: this.packagedetail.Price,
         mb: this.packagedetail.Songs
       });
      });

  }
  onSubmitHandler()
  {
      
      if(this.adminpackageform.valid){
        console.log("adminuserform",this.adminpackageform.value);

        this.spinnerService.show();
        this.api.editpackageinfo(JSON.stringify(this.adminpackageform.value)).subscribe(response => {
            console.log('Add User Response', response);
             this.spinnerService.hide();
            if(response){
             swal({
                        title: 'Package Detail Updated Successfully',
                        text: "",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                      }).then((result) => {
                        if (result.value) {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/admin/packagesetting']));
                    }
                  });
            }
            
        });
    
      }else{
        this.submitted=true;
      }

     
  }
 
}
