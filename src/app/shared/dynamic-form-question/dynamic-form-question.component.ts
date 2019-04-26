import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { QuestionBase } from '../../question-base';
import { FormGroup, FormArray } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS } from '../../material-design-module';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-dynamic-form-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }
  get control(){return this.form.controls[this.question.key]}

  @Output() onChangeLog = new  EventEmitter<string[]>();
  
    ngOnChanges(changes: SimpleChanges) {
      // let log: string[] = [];
      // for (let propName in changes) {
      //   if(propName == 'form') continue;
      //   let changedProp = changes[propName];
      //   let to = JSON.stringify(changedProp.currentValue);
      //   if (changedProp.isFirstChange()) {
      //     log.push(`Initial value of ${propName} set to ${to}`);
      //   } else {
      //     let from = JSON.stringify(changedProp.previousValue);
      //     log.push(`${propName} changed from ${from} to ${to}`);
      //   }
      // }
      // this.onChangeLog.emit(log);
    }
  
    ngOnInit(){
      let self = this;

      self.control.valueChanges.forEach((value: string)=>{
        if (self.question.onValueChangesHandler) 
          self.question.onValueChangesHandler(self.control, value); 
        //console.log('Value', value);
      })
     
    }
}
                