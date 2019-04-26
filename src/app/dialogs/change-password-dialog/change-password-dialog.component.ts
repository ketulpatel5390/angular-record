import { Component, OnInit, Inject, ViewChild,Directive } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { QuestionBase } from '../../question-base';
import { TextboxQuestion } from '../../textbox-question';
import { FormControl, FormGroup,Validators} from '@angular/forms';
import { MyValidators } from '../../my-validators';
import 'rxjs/add/operator/map';

export class ChangePasswordDialogData {
  username? = '';
  resetCode? = '';
}

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit {
  changepassword: FormGroup;
   model: any = {};
   loading = false;
    error = '';
  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>,
      @Inject(MAT_DIALOG_DATA) public data: ChangePasswordDialogData) { }

  @ViewChild('form') form: DynamicFormComponent;
  questions: QuestionBase<any>[]=[];

  ngOnInit() {
    let self = this;
    //self.initializeQuestions();
     this.changepassword = new FormGroup({
       oldPassword: new FormControl("", [Validators.required, Validators.minLength(5)]),
        newPassword: new FormControl("", [Validators.required, Validators.minLength(5)]),
        confirmPassword: new FormControl("", MyValidators.sameAs('newPassword', 'New Password'))
    });
    
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
    if(self.changepassword.value.oldPassword == "" ){
      this.error="Please Enter Old Password \n";
    }else if(self.changepassword.value.newPassword == "" ){
      this.error="Please Enter New Password \n";
    }else if(self.changepassword.value.confirmPassword == "" ){
      this.error="Please Enter Confirm Password \n";
    }else if(self.changepassword.value.confirmPassword != self.changepassword.value.newPassword ){ 
      this.error="Please Enter Valid Password.Some of your entries are invalid! \n";
    }else{
       self.api.ckeckoldPassword(self.changepassword.value.oldPassword).subscribe(response => {
               // console.log('Change Password Response', response);
               // this.items = response;
                if(response['errvar'] == 1){
                  this.error="Please Enter Valid Old Password! \n";
                }else{
                  self.dialogRef.close(self.changepassword.value);
                }
               
            });
        
    }
    
  }

  initializeQuestions(){
    let self = this;
    if (!self.data.resetCode || !self.data.username){
      self.questions.push(
        new TextboxQuestion({
          key: 'password',
          label: 'Old Password',
          type: 'password',
          validators: [Validators.required]
        }),
      );
    }

    self.questions.push(
      new TextboxQuestion({
        key: 'newPassword',
        label: 'New Password',
        type: 'password',
        validators: [Validators.required, Validators.minLength(8)]
      }),

      new TextboxQuestion({
        key: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        validators: [MyValidators.sameAs('newPassword', 'New Password')]
      })
    );

    //self.api.getDropdownLists(self.questions);
  }
}
