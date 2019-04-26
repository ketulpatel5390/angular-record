import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { SharedDataService, IToken } from '../_services/shared-data.service';
import { RouterLink, ActivatedRoute, NavigationEnd  } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { NavLink,Application,AdminRights } from '../_models/songbook-life';
import { AuthenticationService } from '../_services/authentication.service';
import { WebApiService } from '../_services/web-api.service';
import { Router ,Event  } from '@angular/router';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';

import { FormControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';

// import { AuthService,FacebookLoginProvider} from 'angular5-social-login';
import {HttpErrorResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
     HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
    public token: string;
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    imageName;
    bgimageName;
    username: string;
    isAuthenticated: boolean;
    isAdmin:boolean;
    footerlogo;
    avtar;
    menushow=true;
    menuhide=false;
    approvalstatus: string;
    mydisplayerrors:boolean=false;
    ApplicationProfiles: Application;
    adminrights : AdminRights;
  app : boolean = false;
  mus : boolean = false;
  site : boolean = false;
  user : boolean = false;
  audl : boolean = false;
  loga : boolean = false;
  mediadistributiona : boolean = false;
  packagesetting : boolean = false;
    searchform: FormGroup;
  constructor(private http: HttpClient,public sd: SharedDataService, 
    private authenticationService: AuthenticationService,
     private router: Router,
    private location: PlatformLocation,
    private dialog: MatDialog,
    private webapi:WebApiService,
    //private socialAuthService: AuthService,
    private idle: Idle, private keepalive: Keepalive,
    private activatedRoute: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) {

    this.setImageName();
    //this.menushows();
    let self = this;
    //self.refreshModel(self.sd.currentUser);
    this.spinnerService.show();
    self.webapi.checksession().subscribe(response => {
     // debugger;
     this.spinnerService.hide();
    //console.log("checksession response", response);
    if(response == 1){

    }else{
        self.sd.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('songplaylist');
        localStorage.removeItem('songlisteningroom');
        
        //this.router.navigate(['/register']);
       
       // return true;
    }
   });
    self.sd.onCurrentUserChanged.subscribe(response => {
        this.refreshModel(response);
    });
    this.spinnerService.show();
    this.webapi.getinfoSiteconfig().subscribe(response => {
      this.spinnerService.hide();
       idle.setIdle(response.ideltime);
    });

   // idle.setIdle(300);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      self.sd.currentUser = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('songplaylist');
      localStorage.removeItem('songlisteningroom');
      //this.router.navigate(['/home']);
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/home']));

    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();

     

   }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  
  
  navLinks = [
    new NavLink('My Account',    'myProfile'),
    new NavLink('Listening Room',    'getMusic/reviewMusic'),
    new NavLink('Search Results',    'getMusic/findMusic'),
    new NavLink('Browse by Genre',    'getMusic/Browsebygenre'),
    new NavLink('My Portfolio',  'shareMusic'),
    new NavLink('My Song Crate',  'mysongcrate'),
    new NavLink('My Song Crate Friends',  'mysongcratefriends'),
    new NavLink('Messages',        'messages'),
    new NavLink('Error Report',        'errorreporting'),
    new NavLink('Administration',        'admin/welcomeadmin', false),
    new NavLink('Applications', 'admin/appReview', false),
    new NavLink('Music', 'admin/songapprovebyadmin', false),
    new NavLink('Site Settings', 'admin/siteconfig', false),
    new NavLink('Users', 'admin/users', false),
    new NavLink('Audit Logs', 'admin/audit', false),
    new NavLink('Logs', 'admin/log', false),
    new NavLink('Media Distribution', 'admin/media-distribution', false),
    new NavLink('Package Settings', 'admin/packagesetting', false),
    new NavLink('Playlist',        'playlist')  
    //new NavLink('Song Approve By Admin', 'adminsongapprove', false)
  ];

  audioSource: string;

  private setImageName() {
    let self = this;
    let baseHref = self.location.getBaseHrefFromDOM();
   //console.log(baseHref);
   let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    //console.log('Image', self.imageName);
    self.avtar=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/avtar.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
    self.footerlogo = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/footer-logo.png`;

  }
submitted = false;
  ngOnInit() {
    let self = this;
    this.searchform = new FormGroup({
      searchvalue: new FormControl("", Validators.compose([Validators.required])),
    });
    /*$(document).ready(function(){
    
        $(".menu_bar_btn").click(function(){
           
        
        });
    });*/
   /*  $("body").removeClass('body-push-menu');
     this.menushow=true;
      this.menuhide=false;*/
      this.router.events.subscribe((event:Event) => {
          if(event instanceof NavigationEnd ){
            let newevent = event.url.split(";",1);
            //console.log(newevent[0]);
            if(newevent[0] == "/getMusic/findMusic"){
              this.navLinks.find(nl => nl.label == 'Search Results').isVisible = true;
            }else{
              this.navLinks.find(nl => nl.label == 'Search Results').isVisible = false;
            }
            

          }
        });
      $("body").addClass('body-push-menu');
    console.log("show menu");
    
     if (window.matchMedia('(max-width: 1024px)').matches) {
       this.menushow=true;
    this.menuhide=false;
    } else if(window.matchMedia('(max-width: 1112px)').matches){
      this.menushow=true;
      this.menuhide=false;
    } else {
        this.menushow=false;
    this.menuhide=true;
    }
  }
  menushows(){
    $(".fix_menu-new").toggle("slide");
    $("body").addClass('body-push-menu');
    console.log("show menu");
    this.menushow=false;
    this.menuhide=true;
  }
  menuhides(){
     $(".fix_menu-new").hide();
     $("body").removeClass('body-push-menu');
      console.log("hide Menu");
      this.menushow=true;
      this.menuhide=false;
  }
    menuhidesonmobile(){
    if (window.matchMedia('(max-width: 1024px)').matches) {
       $(".fix_menu-new").hide();
     $("body").removeClass('body-push-menu');
      console.log("hide Menu");
      this.menushow=true;
      this.menuhide=false;
    }else if(window.matchMedia('(max-width: 1112px)').matches){
      $(".fix_menu-new").hide();
     $("body").removeClass('body-push-menu');
      console.log("hide Menu");
      this.menushow=true;
      this.menuhide=false;
    } 

  }

  /*onPlayHandler(){
    let self = this;
    console.log('Play button clicked');
  }*/

  private refreshModel(response: IToken) {

    let self = this;
    $("body").addClass('body-push-menu');
    if (window.matchMedia('(max-width: 1024px)').matches) {
      $(".fix_menu-new").hide();
     $("body").removeClass('body-push-menu');
       this.menushow=true;
       this.menuhide=false;
    } else if(window.matchMedia('(max-width: 1112px)').matches){
      $(".fix_menu-new").hide();
     $("body").removeClass('body-push-menu');
      this.menushow=true;
      this.menuhide=false;
    } else {
        this.menushow=false;
        this.menuhide=true;
    }

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (response) {
      self.webapi.getApplication().subscribe(response => { 
        //console.log("app info : ", response);
        let baseulrs=environment.baseulrs;
        if(response){
          this.ApplicationProfiles=response;
          
          if(this.ApplicationProfiles.profile_pic != null){
              self.avtar = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}` + this.ApplicationProfiles.profile_pic;
          }else{
            self.avtar=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/avtar.png`;
          }
        }else{
          self.avtar=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/avtar.png`;
        }
        
        
    });
      self.username = response.Username;
      self.isAuthenticated = response.isAuthenticated;
      self.approvalstatus=response.Approval_Status;
       console.log("token",response.isAdmin);
       if(response.isAdmin){
        self.navLinks.find(nl => nl.label == 'Administration').isVisible = response.isAdmin;
        this.spinnerService.show();
         this.webapi.getadminrightsformenu(response.UserId).subscribe(response => {
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
               if(this.adminrights.packagesetting == 1){
                  this.packagesetting =true;
               }
               


              self.navLinks.find(nl => nl.label == 'Applications').isVisible = this.app;
              self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = this.site;
              self.navLinks.find(nl => nl.label == 'Music').isVisible = this.mus;
              self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = this.audl;
              self.navLinks.find(nl => nl.label == 'Logs').isVisible = this.loga;
              self.navLinks.find(nl => nl.label == 'Users').isVisible = this.user;
              self.navLinks.find(nl => nl.label == 'Media Distribution').isVisible = this.mediadistributiona;
               self.navLinks.find(nl => nl.label == 'Package Settings').isVisible = this.packagesetting;
          }
        });
        self.navLinks.find(nl => nl.label == 'My Account').isVisible = false;
        self.navLinks.find(nl => nl.label == 'My Song Crate Friends').isVisible = false;
        self.navLinks.find(nl => nl.label == 'My Song Crate').isVisible = false;
        self.navLinks.find(nl => nl.label == 'My Portfolio').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Listening Room').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Search Results').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Browse by Genre').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Messages').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Error Report').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Playlist').isVisible = false;
        
        
       }else if(response.Approval_Status == "P"){
        self.navLinks.find(nl => nl.label == 'Administration').isVisible = false;
        self.navLinks.find(nl => nl.label == 'My Account').isVisible = false;
        self.navLinks.find(nl => nl.label == 'My Song Crate Friends').isVisible = false;
        self.navLinks.find(nl => nl.label == 'My Song Crate').isVisible = false;
        self.navLinks.find(nl => nl.label == 'My Portfolio').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Listening Room').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Search Results').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Browse by Genre').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Messages').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Error Report').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Applications').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Music').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Logs').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Users').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Media Distribution').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Package Settings').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Playlist').isVisible = false;
       }else if(response.Approval_Status == "A"){
         self.navLinks.find(nl => nl.label == 'Administration').isVisible = false;
        self.navLinks.find(nl => nl.label == 'My Account').isVisible = true;
        self.navLinks.find(nl => nl.label == 'My Song Crate Friends').isVisible = true;
        self.navLinks.find(nl => nl.label == 'My Song Crate').isVisible = true;
        //self.navLinks.find(nl => nl.label == 'My Portfolio').isVisible = true;
        self.navLinks.find(nl => nl.label == 'Listening Room').isVisible = true;
        self.navLinks.find(nl => nl.label == 'Search Results').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Browse by Genre').isVisible = true;
        self.navLinks.find(nl => nl.label == 'Messages').isVisible = true;
        if(response.isupload == 'Yes'){
          self.navLinks.find(nl => nl.label == 'My Portfolio').isVisible = true;
        }else{
          self.navLinks.find(nl => nl.label == 'My Portfolio').isVisible = false;
        }
        self.navLinks.find(nl => nl.label == 'Error Report').isVisible = true;
        self.navLinks.find(nl => nl.label == 'Applications').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Music').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Logs').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Users').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Media Distribution').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Package Settings').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Playlist').isVisible = true;
       }
      
      //self.navLinks.find(nl => nl.label == 'Song Approve By Admin').isVisible = response.isAdmin;
      self.isAdmin = response.isAdmin;

    }
    else {
      self.username = '';
      self.isAuthenticated = false;
      self.isAdmin=false;
      self.navLinks.find(nl => nl.label == 'Administration').isVisible = false;
       self.navLinks.find(nl => nl.label == 'Applications').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Site Settings').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Music').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Audit Logs').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Logs').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Users').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Media Distribution').isVisible = false;
        self.navLinks.find(nl => nl.label == 'Package Settings').isVisible = false;
      //self.navLinks.find(nl => nl.label == 'Song Approve By Admin').isVisible = response.isAdmin;
      self.setImageName();
    }

    //
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
       /* d.afterClosed().subscribe(s => {

          if(self.isAdmin){

            this.router.navigate(['admin']);
          }else{
            this.router.navigate(['getMusic']);
          }
             
        });*/
    }

    /*public socialSignIn(socialPlatform : string) 
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
        console.log("User Logout Action");
        localStorage.removeItem('songplaylist');
        localStorage.removeItem('songlisteningroom');
        this.authenticationService.logout();
        $("body").removeClass('body-push-menu');
       this.menushow=true;
        this.menuhide=false;
        this.router.navigateByUrl('/home');
      
    }
    filterItem(){
        let self = this;
      this.error='';
      if (self.searchform.valid){
          this.navLinks.find(nl => nl.label == 'Search Results').isVisible = true;
          this.router.navigate(['/getMusic/findMusic',{ searchval: self.searchform.value.searchvalue}]);
      }else{
        this.navLinks.find(nl => nl.label == 'Search Results').isVisible = false;
          this.submitted = true;
      } 
    }
    mobilelogout(){
      $(".mob_logout").toggle();
     }
   
}
