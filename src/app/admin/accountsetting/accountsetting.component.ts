import { Component, OnInit } from '@angular/core';
import { NavLink,PackageDetails } from '../../_models/songbook-life';
import { SharedDataService,IToken } from '../../_services/shared-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WebApiService } from '../../_services/web-api.service';
import * as $ from 'jquery';
import swal from 'sweetalert2';
@Component({
  selector: 'app-accountsetting',
  templateUrl: './accountsetting.component.html',
  styleUrls: ['./accountsetting.component.css']
})
export class AccountsettingComponent implements OnInit {

   usersaccess :boolean = true;
   PackageList :PackageDetails[];
  constructor(private sd: SharedDataService,private api: WebApiService,private spinnerService: Ng4LoadingSpinnerService) {
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
  	this.api.admingetpackagedetails().subscribe(response => {
  		this.PackageList =response;
  	});
  }
  

}
