import { QuestionBase, ControlTypes } from "./question-base";
import { MultipleChoiceQuestionBase } from "./multiple-choice-question-base";

export class DropdownQuestion extends MultipleChoiceQuestionBase<string> {
    constructor(options:{}={}){
        super(options);
        //this.options = options['options'] || [];
    }

    controlType = ControlTypes.dropdown;
    //options: {key: string, value: string}[] = [];

}
