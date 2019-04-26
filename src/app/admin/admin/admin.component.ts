import { Component, OnInit } from '@angular/core';
import { NavLink } from '../../_models/songbook-life';
import { SharedDataService,IToken } from '../../_services/shared-data.service';
import { AdminRights } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  navLinks = [
    new NavLink('Applications', 'appReview'),
    new NavLink('Music', 'songapprovebyadmin'),
    new NavLink('Site Settings', 'siteconfig'),
    new NavLink('Users', 'users'),
    new NavLink('Audit Logs', 'audit'),
    new NavLink('Logs', 'log'),
    new NavLink('Media Distribution', 'media-distribution')

  ];
  admindata :IToken;
  adminrights : AdminRights;
  app : boolean = false;
  mus : boolean = false;
  site : boolean = false;
  user : boolean = false;
  audl : boolean = false;
  loga : boolean = false;
  mediadistributiona : boolean = false;
  constructor(private api: WebApiService,private sd: SharedDataService, 
    private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    self.sd.pageTitle.value = 'Admin';

    self.sd.onCurrentUserChanged.subscribe(response => {
      // console.log("onCurrentUserChanged :",response);
        this.refreshModel(response);
    });
   }

  ngOnInit() {
  }
  private refreshModel(response: IToken) {

    let self = this;
    
    if (response) {
     
       //console.log("token",response);
       if(response.isAdmin){
         this.spinnerService.show();
         this.api.getadminrightsformenu(response.UserId).subscribe(response => {
           this.spinnerService.hide();
         if(response)
         {
           this.adminrights =response;
           //console.log("getadminrightsformenu",response);
              if(this.adminrights.application == 1){
               this.app = true;
              }
               if(this.adminrights.music == 1){
                  this.mus = true;
               }
               if(this.adminrights.sitesetting == 1){
                 this.site =true;
               }
               if(this.adminrights.users == 1){
                  this.user =true;
               }
               if(this.adminrights.auditlog == 1){
                  this.audl =true;
               }
               if(this.adminrights.logs == 1){
                  this.loga =true;
               }
               if(this.adminrights.mediadistribution == 1){
                  this.mediadistributiona =true;
               }
               


              self.navLinks.find(nl => nl.label == 'Applications').isVisible = this.app;
              self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = this.site;
              self.navLinks.find(nl => nl.label == 'Music').isVisible = this.mus;
              self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = this.audl;
              self.navLinks.find(nl => nl.label == 'Logs').isVisible = this.loga;
              self.navLinks.find(nl => nl.label == 'Users').isVisible = this.user;
              self.navLinks.find(nl => nl.label == 'Media Distribution').isVisible = this.mediadistributiona;

          }
        });
          
         /*if(response.admin_status == 1){
            // self.navLinks.find(nl => nl.label == 'Administration').isVisible = response.isAdmin;
        
         }else if(response.admin_status == 2){
           
             self.navLinks.find(nl => nl.label == 'Applications').isVisible = response.isAdmin;
             self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = response.isAdmin;
             self.navLinks.find(nl => nl.label == 'Music').isVisible = response.isAdmin;
             self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Logs').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Users').isVisible = false;
             
       
         }else if(response.admin_status == 3){
             self.navLinks.find(nl => nl.label == 'Applications').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Music').isVisible = response.isAdmin;
             self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Logs').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Users').isVisible = false;
        
         }else if(response.admin_status == 4){
            self.navLinks.find(nl => nl.label == 'Applications').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Music').isVisible = response.isAdmin;
             self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = response.isAdmin;
             self.navLinks.find(nl => nl.label == 'Logs').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Users').isVisible = false;
        
         }else if(response.admin_status == 5){
             self.navLinks.find(nl => nl.label == 'Applications').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Music').isVisible = false;
             self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = response.isAdmin;
             self.navLinks.find(nl => nl.label == 'Logs').isVisible = response.isAdmin;
             self.navLinks.find(nl => nl.label == 'Users').isVisible = false;
        
         }*/
       
       }
      
    

    }
    else {
      
      /*self.navLinks.find(nl => nl.label == 'Administration').isVisible = false;*/
      //self.navLinks.find(nl => nl.label == 'Song Approve By Admin').isVisible = response.isAdmin;
    }

   
  }


}
