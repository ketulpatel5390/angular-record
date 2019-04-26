import { Injectable, Inject } from '@angular/core';
//import { Http, Headers, Response } from '@angular/http';
import {HttpErrorResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
     HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {environment} from '../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { SharedDataService, IToken } from './shared-data.service';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: HttpClient, private sd: SharedDataService,
         private spinnerService: Ng4LoadingSpinnerService) {
        // set token if saved in local storage
       var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(username: string, password: string): Observable<boolean> {
        let self = this;
        //debugger;
        let rv: Subject<boolean>= new Subject<boolean>();
		this.spinnerService.show();
        this.http.post<IToken>('/api/register/authenticate', JSON.stringify({ username: username, password: password }))
            .subscribe((response) => {
                this.spinnerService.hide();
            //console.log("Subscribe Success", response);
                // login successful if there's a jwt token in the response
                let token = response.token;
                self.sd.currentUser = response;
                if (token) {
                    //console.log('token', token);

                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes

                    // return true to indicate successful login
                    //return true;
                    //rv.publish()
                    rv.next(true);
                } else {
                    // return false to indicate failed login
                    //return false;
                    rv.next(false);
                }
            }, error => {
                console.log("Authentication Error", error);
                rv.next(false);
            });


        return rv;
    }

    logout(): void {
        let self = this;
        // clear token remove user from local storage to log user out
        console.log("Logout Action Running");
        this.token = null;
        self.sd.currentUser = null;
         self.sd.clearMusicEvent();
        this.spinnerService.show();

        self.http.get('/api/register/logout')
            .subscribe(response => {
                this.spinnerService.hide();
                console.log('logout successful', response);
                
            });
    }
}

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor{
    constructor (private sd: SharedDataService, private router: Router, 
        private location: PlatformLocation){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let self = this;
        let token = null;
        if (self.sd.currentUser) token = self.sd.currentUser.token;

        //console.log("Url", req.url);
        if (req.url.startsWith('/api/')){ 
            //debugger;
            let baseUrl = self.location.getBaseHrefFromDOM();
            const newReq = req.clone({url: environment.apiPrefix 
                + (baseUrl == '/' ? '' : baseUrl) + req.url,
                setHeaders: {Authorization: 'Bearer ' + token},
                withCredentials: true
            });
           // console.log("New Url", newReq.url);
            return next.handle(newReq)
                .do(response => {
                    if (response instanceof HttpResponse) {
                        //console.log('Response', response);
                    }
                },
                err => {
                    if (err instanceof HttpErrorResponse){
                        //self.router.navigate(['/underConstruction']);
                        //console.log('Error', err);
                        self.sd.hideProgressBar();
                        //alert('Error Encountered' + err.message);
                        if (err.status == 401) self.router.navigate(['/home']);
                        //return Observable.throw(err);
                    }
                });
        }
        else
            return next.handle(req);
    }
  }