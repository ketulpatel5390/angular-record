import { QuestionBase, ControlTypes } from "./question-base";

export class TextboxQuestion extends QuestionBase<string> {
    constructor(options:{}={}){
        super(options);
        this.type = options['type'] || 'textbox';
    }

    controlType = ControlTypes.textbox;
    type: string;    

}
