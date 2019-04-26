import { QuestionBase, ControlTypes } from "./question-base";

export class DatepickerQuestion extends QuestionBase<string> {
    constructor(options:{}={}){
        super(options);
        // this.type = options['type'] || 'textbox';
    }
    
    controlType = ControlTypes.datetime;
    // type: string;    

}
