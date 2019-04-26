import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
//import { UserService } from '../_services/user.service';
import {environment} from '../../environments/environment';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SharedDataService, IToken } from '../_services/shared-data.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Router,NavigationEnd  } from '@angular/router';
import { NavLink } from '../_models/songbook-life';
/*import { AuthService,FacebookLoginProvider} from 'angular5-social-login';*/
import {HttpErrorResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
     HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { WebApiService } from '../_services/web-api.service';
import { PlatformLocation } from '@angular/common';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    //users: User[] = [];
    //imageName = environment.isSongBook ? 'songbook_blue_336x123.png' : 'logo.jpg';
      model: any = {};
   loading = false;
    error = '';
     imageName;
  bgimageName;
     username: string;
  isAuthenticated: boolean;
  isAdmin:boolean;
     fimageName1;
     fimageName2;
     fimageName3;
     fimageName4;
     footerbg;
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
  public token: string;
    constructor( private http: HttpClient,public sd: SharedDataService, 
    private authenticationService: AuthenticationService,
     private router: Router,
    private location: PlatformLocation,
    private dialog: MatDialog,
    private webapi:WebApiService, private spinnerService: Ng4LoadingSpinnerService
   // private socialAuthService: AuthService
   ) {
       


       this.setImageName();

    let self = this;
    //self.refreshModel(self.sd.currentUser);
    /*self.sd.onCurrentUserChanged.subscribe(response => {
      this.refreshModel(response);
    });*/

     }

    ngOnInit() {
      
        // get users from secure api end point
        let self = this;
       
        let baseulrs=environment.baseulrs;
        self.fimageName1 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/yours.png`;
        self.fimageName2 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/hidden.png`;
        self.fimageName3 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/playlist.png`;
        self.fimageName4 = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/paid.png`;
        self.footerbg = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/footer-bg.jpg`;
        self.footerlogo = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/footer-logo.png`;
        self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
        this.spinnerService.show();
        self.webapi.getApplicationsUserCount().subscribe(result => {
          this.spinnerService.hide();
      this.allusercount=result;
    });
        this.spinnerService.show();
    self.webapi.getallSongsCount().subscribe(results => {
      this.spinnerService.hide();
      //console.log(results);
      this.allsongcount=results;
    });
    this.spinnerService.show();
    self.webapi.getallArtistCount().subscribe(results => {
      this.spinnerService.hide();
      //console.log(results);
      this.allartistcount=results;
    });

    }
    userlogin(){
        let self = this;
        if(self.dialog.openDialogs.length <= 0){
        let d = self.dialog.open(LoginDialogComponent,  { panelClass: 'custom-dialog-container',
                                                         backdropClass: 'custom-dialog-container-login',
                                                         disableClose: true
                                                       });
        }
        //d.afterClosed().subscribe(s => {
            /*if (s) {
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
             console.log('Right After close', s);*/
        //});
    }
    searchitems(searchname){
        console.log(searchname);
        this.router.navigate(['/search',{ searchval: searchname}]);
        
        //this.router.navigate(['/search']);

    }
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
  private setImageName() {
    let self = this;
    this.spinnerService.show();
    let baseHref = self.location.getBaseHrefFromDOM();
   console.log(baseHref);
   let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    console.log('Image', self.imageName);
    self.avtar=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/avtar.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
    self.footerlogo = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/footer-logo.png`;
    this.spinnerService.hide();
  }
/*      public socialSignIn(socialPlatform : string) 
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
    }*/
    userlogout(){
    let self = this;
        // reset login status
        this.authenticationService.logout();
        this.router.navigate(['/home']);
    }

}