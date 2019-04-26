import { Component, OnInit } from '@angular/core';
import { NavLink } from '../../_models/songbook-life';
import { SharedDataService,IToken } from '../../_services/shared-data.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WebApiService } from '../../_services/web-api.service';

import * as $ from 'jquery';



@Component({
  selector: 'app-media-distribution',
  templateUrl: './media-distribution.component.html',
  styleUrls: ['./media-distribution.component.css']
})
export class MediaDistributionComponent implements OnInit {

  tier1_response:any[];
  tier1_label;
  constructor(private sd: SharedDataService, private api: WebApiService,
   private spinnerService: Ng4LoadingSpinnerService) {

   }

  ngOnInit() {
  }
  
  tire1(){
  	this.spinnerService.show();
 	this.api.tier1().subscribe(response => {
 	//	console.log("tier1",response);
 		this.tier1_label="Tier-1";
 		this.tier1_response=response;
		this.spinnerService.hide();
    })
  }

  tire2(){
  	this.spinnerService.show();
 	this.api.tier2().subscribe(response => {
 	//	console.log("tier1",response);
 		this.tier1_label="Tier-2";
 		this.tier1_response=response;
		this.spinnerService.hide();
    })
  }

  tire3(){
  	this.spinnerService.show();
 	this.api.tier3().subscribe(response => {
 	//	console.log("tier1",response);
 		this.tier1_label="Tier-3";
 		this.tier1_response=response;
		this.spinnerService.hide();
    })
  }

  tire4(){
  	this.spinnerService.show();
 	this.api.tier4().subscribe(response => {
 	//	console.log("tier1",response);
 		this.tier1_label="Tier-4";
 		this.tier1_response=response;
		this.spinnerService.hide();
    })
  }

}
