import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SharedDataService } from '../_services/shared-data.service';
import { WebApiService } from '../_services/web-api.service';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private sd: SharedDataService,private api: WebApiService, private router: Router) { }

    canActivate() {
        let self = this;
        
        if (self.sd.currentUser && self.sd.currentUser.isAuthenticated) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page
        //this.router.navigate(['/home']);
        return false;
    }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(private sd: SharedDataService, private router: Router) { }

    canActivate() {
        let self = this;
        if (self.sd.currentUser && self.sd.currentUser.isAuthenticated && self.sd.currentUser.isAdmin) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        //this.router.navigate(['/login']);
        return false;
    }
}