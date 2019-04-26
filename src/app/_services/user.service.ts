import { Injectable } from '@angular/core';
//import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { AuthenticationService } from './authentication.service';
import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(
        private http: HttpClient,
        private authenticationService: AuthenticationService) {
    }

    getUsers(): Observable<User[]> {
        // add authorization header with jwt token
        let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = { headers: headers };

        // get users from api
        return this.http.get<User[]>('/api/users', options)
            .map((response) => response);
    }
}