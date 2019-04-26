import { Component, OnInit } from '@angular/core';
/*import { environment } from '../../environments/environment';*/
import { environment } from '../../environments/environment.prod';
import { SharedDataService, IToken } from '../_services/shared-data.service';
import { RouterLink } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { NavLink } from '../_models/songbook-life';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  model: any = {};
   loading = false;
    error = '';
    footerlogo;
    public version: string = environment.version;
  constructor(public sd: SharedDataService, 
    private authenticationService: AuthenticationService,
     private router: Router,
    private location: PlatformLocation,
    private dialog: MatDialog) {

    this.setImageName();

    let self = this;
    //self.refreshModel(self.sd.currentUser);
    self.sd.onCurrentUserChanged.subscribe(response => {
      this.refreshModel(response);
    });
   }
 
  isAuthenticated: boolean;
  

  private setImageName() {
    let self = this;
    let baseHref = self.location.getBaseHrefFromDOM();
    let baseulrs=environment.baseulrs;
    self.footerlogo = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/footer-logo.png`;
  }

  ngOnInit() {
    let self = this;
    
    
  }

 

  private refreshModel(response: IToken) {
    let self = this;
    if (response) {
      self.isAuthenticated = response.isAuthenticated;
      //self.navLinks.find(nl => nl.label == 'Admin').isVisible = response.isAdmin;
    }
    else {
     // self.username = '';
      self.isAuthenticated = false;
     // self.navLinks.find(nl => nl.label == 'Admin').isVisible = false;
    }

   
  }

   
}
