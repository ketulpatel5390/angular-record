import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { QuestionBase } from '../../question-base';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.css']
})
export class ValidationMessageComponent implements OnInit {
@Input() control: AbstractControl;
@Input() question: QuestionBase<any>;

  constructor() { }

  ngOnInit() {
  }

  hasError(errorCode: string){
    return this.control.touched ? this.control.hasError(errorCode) : null;
  }
}
