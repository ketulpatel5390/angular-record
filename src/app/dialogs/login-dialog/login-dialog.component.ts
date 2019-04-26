import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../question-base';
import { TextboxQuestion } from '../../textbox-question';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MyValidators } from '../../my-validators';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
import { SharedDataService, IToken } from '../../_services/shared-data.service';
import { MatDialog } from '@angular/material';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CookieService } from '../../_services/cookie.service';
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit, AfterViewChecked {
  loginform: FormGroup;
  model: any = {};
   loading = false;
    error = '';
     remember = false;
    username;
    password;
     @ViewChild('password') inputEl:ElementRef;
  constructor(private api: WebApiService,public sd: SharedDataService,
    private authenticationService: AuthenticationService,
    private router: Router ,private cs: CookieService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService) 
    {
        if (this.cs.fetchValue('username')) {
            this.remember = true;
            this.username = this.cs.fetchValue('username');
                       
          }
    }

  
  
  ngOnInit() {
    let self = this;
    this.loginform = new FormGroup({
        username: new FormControl("", Validators.compose([Validators.required])),
        password: new FormControl("", Validators.compose([Validators.required])),
         remember:  new FormControl(""),
        //captcha: new FormControl("", Validators.compose([Validators.required])),
    });
    if (this.cs.fetchValue('username')) {
            this.remember = true;
            this.username = this.cs.fetchValue('username');
            this.loginform.controls['username'].setValue(this.username);
            this.loginform.controls['remember'].setValue(this.remember);
    }
    
  }
  ngAfterViewChecked() {
   /*if (this.cs.fetchValue('username')) {
            this.remember = true;
            this.username = this.cs.fetchValue('username');
            this.loginform.patchValue({
              username : this.username,
              password : '',
              remember : 'Yes',
              
            });
            //this.inputEl.nativeElement.focus();
           
    }*/
    //this.inputEl.nativeElement.focus();
}

  onNoClick(){
    let self = this;
    self.cancelDialog();
  }

  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }

  closeDialog(){
    let self = this;
    //console.log(self.loginform.value.username);
    this.spinnerService.show();
    if(self.loginform.value.remember){
        this.cs.addvalue('username', this.loginform.value.username);
        
      } else {
        this.cs.addvalue('username', '');
        
      }
    this.authenticationService.login(self.loginform.value.username, self.loginform.value.password)
                .subscribe(result => {
                  this.spinnerService.hide();
                if (result === true) {
                    //console.log("self.sd.currentUser",self.sd.currentUser);
                    self.dialogRef.close(self.loginform.value);
                    if (self.sd.currentUser && self.sd.currentUser.errvar == 4){
                        self.router.navigate(['/confirm']);
                    }else if(self.sd.currentUser.isAdmin)
                    {
                      //this.router.navigate(['admin/welcomeadmin']);
                      this.router.navigateByUrl('admin/welcomeadmin');
                    }else{
                      //this.router.navigate(['getMusic']);
                      this.router.navigateByUrl('getMusic');
                    }
                    
                    
                } else {
                    if (self.sd.currentUser && self.sd.currentUser.errvar == 6){
                      //this.error = 'A Verification link has been sent to your email account check your Inbox or Junk.Please click on the link that has been sent to your email account to verify your email and continue the registration process.';
                      //this.loading = false;
                      self.dialogRef.close();
                      self.router.navigate(['/verifylink']);
                    }else{
                      this.error = 'Username or password is incorrect';
                      this.loading = false;
                    }
                        

                    
                   // alert('Username or password is incorrect');
                }
               }, (error) => {
                          this.error = 'Username or password is incorrect';
              });
    /*if (self.loginform.valid){
      //self.onSubmitHandler(self.form.getPayload());
      self.dialogRef.close(self.loginform.value);
    }
    else {
      alert('Some of your entries are invalid!');
    }*/
  }
  forgotpasswordDialog(){
    let self = this;
    self.dialogRef.close();
    let d = self.dialog.open(InputDialogComponent, {
        panelClass: 'custom-dialog-container',
        backdropClass: 'custom-dialog-container-login',
        disableClose: true,
        data: {
              title: 'Reset Password',
              prompt: 'Enter your username. A reset link will be sent to the email associated with your account:',
              validators: [Validators.required],
              placeholder: 'Username'
            },
    });
  }

}
