import { Component, OnInit, Input, SimpleChanges, ViewChild, Inject } from '@angular/core';
import { FormControl, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { QuestionBase } from '../question-base';
import { TextboxQuestion } from '../textbox-question';
import { DropdownQuestion } from '../dropdown-question';
import { MyValidators } from '../my-validators';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { QuestionControlService } from '../_services/question-control.service';
import { CheckboxArrayQuestion } from '../checkbox-array-question';
import { WebApiService} from '../_services/web-api.service';

import { MultipleChoiceQuestionBase } from '../multiple-choice-question-base';
import { DatepickerQuestion } from '../datepicker-question';
import { Router } from '@angular/router';
import { DropdownCheckboxQuestion } from '../dropdown-checkbox-question';
import { SharedDataService } from '../_services/shared-data.service';
import { DynamicFormComponent } from '../shared/dynamic-form/dynamic-form.component';
import * as moment from 'moment';
import { Application } from '../_models/songbook-life';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';



@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
	 appdata: any=[];
    ApplicationProfiles: Application;
   @ViewChild('form') form: DynamicFormComponent;
   questions: QuestionBase<any>[]= [];

   constructor(private qcs: QuestionControlService, private api: WebApiService, private router: Router, 
      private sd: SharedDataService, private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
   
    self.sd.pageTitle.value = 'Edit My Account';
   
    }
   
    submitted = true;
    onSubmit() { this.submitted = true; }

    ngOnInit() 
    {
      let self = this;
      self.initializeQuestions();
     
    }
    initializeQuestions(){

        let self = this;
    
    

    //console.log("app info : ", FirstName);
 /* let tag = self.appinfo;
  console.log("app info : ", tag);*/


    self.questions = [
      new TextboxQuestion({
        key: 'FirstName',
        label: 'First Name',
        validators: [Validators.required],
        value: ''
      }),

      new TextboxQuestion({
        key: 'LastName',
        label: 'Last Name',
        validators: [Validators.required]
      }),

      new DatepickerQuestion({
        key: 'DOB',
        label: 'Date of Birth',
        validators: [Validators.required]
      }),

      new TextboxQuestion({
        key: 'Email',
        label: 'Email',
        validators: [Validators.required, Validators.email]
      }),

      

      new DropdownQuestion({
        key: 'Country',
        value: 'us',
        //value: self.country,
        label: 'Select a country',
        validators: [Validators.required],
        optionsListId: 'Countries',
        onValueChangesHandler: (c: AbstractControl, value: string)=>{
          //setTimeout(()=>{
            let isVisible = value == 'US';
            let question = this.questions.find(q=>q.key == 'StateOrProvince');
            //if (!isVisible && !question.value) question.value = question['options'][0].key; //to prevent validation error
            let f:FormGroup = c.parent as FormGroup;
            let qcs:QuestionControlService;
            let c1 = f.get('StateOrProvince');
            if (isVisible && !c1) {
              f.addControl(question.key, qcs.createControl(question));
              question.isVisible = isVisible;
            }              
            else if (!isVisible && c1){
              question.isVisible = isVisible;
              f.removeControl('StateOrProvince');
            }
          //}, 5000);
          //f.updateValueAndValidity();
            
        }
      }),

      new DropdownQuestion({
        key: 'StateOrProvince',
        label: 'Select a state',
        validators: [Validators.required],
        optionsListId: 'States'
      })
      
      
    ];
      self.sd.showProgressBar('Configuring Edit Profile form...');
      this.spinnerService.show();
      self.api.getDropdownLists(self.questions).subscribe(response => {
        this.spinnerService.hide();
            self.sd.hideProgressBar();
      });
      this.spinnerService.show();
      self.api.getApplication().subscribe(response => { 
        this.spinnerService.hide();
        
        console.log("app info : ", response);
        this.ApplicationProfiles=response;
        //this.form.questions['FirstName'].value=response.FirstName;
     });
       
         
}

  changeLog: string[]=[];

  onChangeLogHandler(changes: string[]){
    this.changeLog.push(changes.join(', '));
  }

  onSubmitHandler(json: string){
    let self = this;
    self.sd.showProgressBar('Submitting application...');
    console.log('Form Value', json);
   // self.api.submitApplication(json).subscribe(response => {
   //   self.sd.hideProgressBar();
   //   console.log('Registration Response', response);
   //   if (response.status == 0 || response.status == null) {
   //     alert('Application submitted successfully!');
    //    if (response.data.package.Price > 0){
     //     self.sd.tempData = response.data;
     //     self.router.navigate(['checkout']);
     //   }
    //    else
    //      self.router.navigate(['/']);
    //  }
    //  else {
     //   let msg = `Error: ${response} while submitting application \n.`;
     //   if (response.status == 3){
     //     msg += 'The selected username is not available \n';
     //   }

     //   if (response.status == 2){
     //     msg += 'No sign ups below the age of 13 \n';  
     //   }

     //   alert(msg);
     // }
     //  });
  }

}
