import { Injectable }   from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { QuestionBase, ControlTypes } from '../question-base';
import { MultipleChoiceQuestionBase, PropertyChangingArgs } from '../multiple-choice-question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {

      group[question.key] = this.createControl(question);
    });
    return new FormGroup(group);
  }

  createControl(question: QuestionBase<any>): AbstractControl {
    if (question.controlType == ControlTypes.checkboxarray){
      let controls: FormControl[] = [];
      for(let i=0; i< question['options'].length; i++)
        controls.push(new FormControl(false));
      let rv = question.validators.length > 0 
      ? new FormArray(controls, question.validators)
      : new FormArray(controls);   

      let mcq = question as MultipleChoiceQuestionBase<any>;
      mcq.onPropertyChanging.subscribe(value => {
        //console.log('New Value', value);
        let args = value as PropertyChangingArgs<any[]>;
        for(let i = rv.controls.length; i < args.newValue.length; i++)
          rv.push(new FormControl(false));
      });

      return rv;
    }
    else
      return question.validators.length > 0 
      ? new FormControl(question.value || '', question.validators)
      : new FormControl(question.value || '');    
     
  }
}