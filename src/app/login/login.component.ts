import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import {environment} from '../../environments/environment';
import { SharedDataService } from '../_services/shared-data.service';
import { InputDialogComponent } from '../dialogs/input-dialog/input-dialog.component';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { WebApiService } from '../_services/web-api.service';

import 'rxjs/add/operator/first';
import { ChangePasswordDialogComponent } from '../dialogs/change-password-dialog/change-password-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private sd: SharedDataService,
        private api: WebApiService,
        private dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService) 
    {
        let self = this;
        self.sd.pageTitle.value = "Login";
     }

    ngOnInit() {
        let self = this;
        // reset login status
        this.authenticationService.logout();

        self.router.routerState.root.queryParams
            .first()
            .subscribe(r => {
                let username = r['u'];
                let resetCode = r['rc'];
                console.log('Query Params', username, resetCode);

                if (username && resetCode){
                    
                    self.router.navigate(['/resetpassword'],{ queryParams: { u: username ,rc: resetCode } })

                 //self.changePassword(username, resetCode);
                }
        });
        //this.router.navigate(['/home']);
    }

    changePassword(username: string, resetCode: string){
        let self = this;
        let d = self.dialog.open(ChangePasswordDialogComponent, {
            height: '100%', width: '100%',
            data: {username: username, resetCode: resetCode},
          });
          d.afterClosed().subscribe(s => {
           if (s && s.newPassword == s.confirmPassword){
               self.sd.showProgressBar('Changing password...');
               this.spinnerService.show();
            self.api.changePassword(s.newPassword, null, username, resetCode).subscribe(response => {
                this.spinnerService.hide();
                console.log('Change Password Response', response);
                self.sd.hideProgressBar();
                alert('Your password has been changed');
            });
           } 
          });
              
    }

    forgotPassword(){
        let self = this;
        let d = self.dialog.open(InputDialogComponent, {
          //height: '80%', width: '80%',
          data: {
              title: 'Reset Password',
              prompt: 'Enter your username. A reset link will be sent to the email associated with your account:',
              validators: [Validators.required],
              placeholder: 'Username'
            },
          //disableClose: true
        });
        d.afterClosed().subscribe(s => {
            if (s) {
                self.sd.showProgressBar('Creating password reset email...');
                this.spinnerService.show();
                self.api.resetPassword(s).subscribe(response => {
                    this.spinnerService.hide();
                    console.log ('Reset Password Response', response);
                    self.sd.hideProgressBar();
                    alert('Reset instructions will be sent to the email associated with your account.');
                });
            }
        });
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
}
