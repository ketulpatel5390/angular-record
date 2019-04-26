import { QuestionBase, ControlTypes } from "./question-base";
import { MultipleChoiceQuestionBase } from "./multiple-choice-question-base";

export class CheckboxArrayQuestion extends MultipleChoiceQuestionBase<string[]> {
    constructor(options:{}={}){
        super(options);
    }

    controlType = ControlTypes.checkboxarray;
}
