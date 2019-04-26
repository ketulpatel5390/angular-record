import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedDataService } from './_services/shared-data.service';
import { PlatformLocation } from '@angular/common';
import { WebApiService } from './_services/web-api.service';
import * as _ from 'lodash';
import { KVP } from './_models/songbook-life';
import { Router,NavigationEnd,Event } from '@angular/router';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { Siteconfiginfo } from './_models/songbook-life';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
 idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    siteconfig:Siteconfiginfo;
    
  constructor(public sd: SharedDataService,
  	private webapi:WebApiService, private router: Router, private cdr: ChangeDetectorRef, private api: WebApiService,
    private idle: Idle, private keepalive: Keepalive, private spinnerService: Ng4LoadingSpinnerService){ 

    

    this.router.events.subscribe((event:Event) => {
          if(event instanceof NavigationEnd ){
            console.log(event.url);
          }
        });
    this.spinnerService.show();
    this.api.getinfoSiteconfig().subscribe(response => {
      this.siteconfig = response;
        idle.setIdle(response.ideltime);
        this.spinnerService.hide();
    });
  	
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.sd.currentUser = null;
      localStorage.removeItem('currentUser');
      //this.router.navigate(['/home']);
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/home']));

    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());
   

  }
  title = 'app';
  progressBarMessage: string;
 
  ngOnInit(){
    let self = this;
     this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
     
    this.spinnerService.show();
    self.webapi.checksession().subscribe(response => {
    //console.log("checksession response", response);
    this.spinnerService.hide();
    if(response == 1){

    }else{
        self.sd.currentUser = null;
        localStorage.removeItem('currentUser');
        //this.router.navigate(['/home']);

        //this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        //this.router.navigate(['/home']));
        //return false;
    }
   });
    self.sd.onProgressBarMessageChanged.subscribe(response => {
      self.progressBarMessage = response;
      self.cdr.detectChanges();
    });

    //Cache required properties
    //self.api.getProperty<KVP[]>('Genres').subscribe();
  }
 
}
