import { Component, EventEmitter, OnChanges, OnInit, Input, SimpleChanges, Output } from '@angular/core';
import { QuestionBase } from '../../question-base';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../_services/question-control.service';
import { MultipleChoiceQuestionBase } from '../../multiple-choice-question-base';
import * as moment from 'moment';
import { ObservableMedia } from '@angular/flex-layout';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  @Input() submitIsVisible = true;

  form: FormGroup;
  numColumns = 3; rowHeight= 'fit';
  payLoad = '';
 
  constructor(private qcs: QuestionControlService, private media: ObservableMedia, 
    private spinnerService: Ng4LoadingSpinnerService) {  }
 
  ngOnInit() {
    let self = this;
    this.form = this.qcs.toFormGroup(this.questions);
    self.media.subscribe(change => {
      console.log('Media changed ', change);
      if (change.mqAlias == 'xs'){
        self.numColumns = 1;
        self.rowHeight = '4:1';
      }
      else {
        self.numColumns = 3;
        self.rowHeight = 'fit';
      }
    });
  }
 
  onSubmitHandler() {
    let self = this;
    
    //TODO: Move genre aggregation to form, maybe hidden var
    //convert genre array to genreString
    self.payLoad = self.getPayload();
    self.onSubmit.emit(self.payLoad);
    this.form.reset();
  }

  getPayload() {
    let self = this;
    let opts = (<MultipleChoiceQuestionBase<any>>self.questions.find(q => q.key == 'genre'))
      .options;
    let genreString = '';
    for (let i = 0; i < self.form.value.genre.length; i++) {
      if (self.form.value.genre[i])
        genreString += opts[i].key + '|';
    }
    if (genreString.length > 0)
      genreString = genreString.substr(0, genreString.length - 1);
    self.form.value.genreString = genreString;
    //format date
    self.form.value.dob = moment(self.form.value.dob).format('YYYY-MM-DD');
    return JSON.stringify(this.form.value);
  }

  @Output() onChangeLog = new EventEmitter<string[]>();

  onChangeLogHandler(changes: string[]){
    this.onChangeLog.emit(changes);
  }

  @Output() onSubmit = new EventEmitter<string>();
}
