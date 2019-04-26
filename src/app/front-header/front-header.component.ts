import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { SharedDataService, IToken } from '../_services/shared-data.service';
import { RouterLink } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { NavLink } from '../_models/songbook-life';
import { AuthenticationService } from '../_services/authentication.service';
import { WebApiService } from '../_services/web-api.service';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AuthService,FacebookLoginProvider} from 'angular5-social-login';
import {HttpErrorResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
     HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import * as $ from 'jquery';
@Component({
  selector: 'app-front-header',
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.css']
})
export class FrontHeaderComponent implements OnInit {
  model: any = {};
   loading = false;
    error = '';
public token: string;
  constructor(private http: HttpClient,public sd: SharedDataService, 
    private authenticationService: AuthenticationService,
     private router: Router,
    private location: PlatformLocation,
    private dialog: MatDialog,
    private webapi:WebApiService,
    private socialAuthService: AuthService) {

    this.setImageName();

    let self = this;
    //self.refreshModel(self.sd.currentUser);
    self.sd.onCurrentUserChanged.subscribe(response => {
      this.refreshModel(response);
    });
   }
  imageName;
  bgimageName;
  username: string;
  isAuthenticated: boolean;
  isAdmin:boolean;
  footerlogo;
  avtar;
  allusercount;
  allsongcount;
  allartistcount;
  navLinks = [
    new NavLink('My Account',    'myProfile'),
    new NavLink('Get Music',    'getMusic'),
    new NavLink('Share Music',  'shareMusic'),
    new NavLink('Admin',        'admin', false)
  ];

  audioSource: string;

  private setImageName() {
    let self = this;
    let baseHref = self.location.getBaseHrefFromDOM();
   console.log(baseHref);
   let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    console.log('Image', self.imageName);
    self.avtar=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/avtar.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
    self.footerlogo = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/footer-logo.png`;
  }

  ngOnInit() {
    let self = this;
    self.webapi.getApplicationsUserCount().subscribe(result => {
    	this.allusercount=result;
    });
    self.webapi.getallSongsCount().subscribe(results => {
    	//console.log(results);
    	this.allsongcount=results;
    });
    self.webapi.getallArtistCount().subscribe(results => {
    	//console.log(results);
    	this.allartistcount=results;
    });


     
  }

  /*onPlayHandler(){
    let self = this;
    console.log('Play button clicked');
  }*/

  private refreshModel(response: IToken) {
    let self = this;
    if (response) {
      self.username = response.Username;
      self.isAuthenticated = response.isAuthenticated;
      self.navLinks.find(nl => nl.label == 'Admin').isVisible = response.isAdmin;
      self.isAdmin = response.isAdmin;
      console.log("isadmins :",response.isAdmin);
      console.log("selfadmins :",self.isAdmin);
    }
    else {
      self.username = '';
      self.isAuthenticated = false;
      self.isAdmin=false;
      self.navLinks.find(nl => nl.label == 'Admin').isVisible = false;
    }

    self.setImageName();
  }
  
  login() {
        let self = this;
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    this.router.navigate(['getMusic']);
                } else {
                    if (self.sd.currentUser && self.sd.currentUser.errvar == 4)
                        self.router.navigate(['/confirm']);

                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }
    userlogin(){
        let self = this;
        let d = self.dialog.open(LoginDialogComponent, { panelClass: 'custom-dialog-container',
                                                         backdropClass: 'custom-dialog-container-login'
                                                       });
        d.disableClose = true;

       d.backdropClick().subscribe(onclick => {
         console.log("onclick Event");
          d.close();
        });
        d.afterClosed().subscribe(s => {
            if (s) {
              //console.log(s);
                self.sd.showProgressBar('User Login...');
                this.authenticationService.login(s.username, s.password)
                .subscribe(result => {
                if (result === true) {
                  
                    this.router.navigate(['getMusic']);

                } else {
                    if (self.sd.currentUser && self.sd.currentUser.errvar == 4)
                        self.router.navigate(['/confirm']);

                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
            }
             console.log('Right After close', s);
        });
    }

    public socialSignIn(socialPlatform : string) 
    {
    	let self = this;
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
	    let socialPlatformProvider;
	    if(socialPlatform == "facebook"){
	      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
	    }
	    this.socialAuthService.signIn(socialPlatformProvider).then(
	      (userData) => {
	        console.log(socialPlatform+" sign in data : " , userData);
	     
       

      // this.router.navigate(['/register',{ email: userData.email, name: userData.name, id: userData.id}]);

       let rv: Subject<boolean>= new Subject<boolean>();
	        //self.webapi.submitFacebookApplication( userData.email,userData.name,userData.id).subscribe((response) => {
             this.http.post<IToken>('/api/register/facebookapplication', JSON.stringify({ email: userData.email, name: userData.name, id: userData.id }))
              .subscribe((response) => {
            console.log("Subscribe Success", response);
                // login successful if there's a jwt token in the response
                let token = response.token;
                self.sd.currentUser = response;
                if (token) {
                    console.log('token', token);

                    // set token property
                    this.token = token;

                    console.log(this.token)
                    rv.next(true);
                    this.router.navigate(['/myProfile']);
                } else {
                   
                    rv.next(false);
                    this.router.navigate(['/myProfile']);
                }
            }, error => {
                this.router.navigate(['/register',{ email: userData.email, name: userData.name, id: userData.id}]);
               console.log("end");
		    });
    
	           
	      }
	    );
    }
    userlogout(){
    let self = this;
        // reset login status
        this.authenticationService.logout();
        this.router.navigate(['/home']);
    }
   
}
