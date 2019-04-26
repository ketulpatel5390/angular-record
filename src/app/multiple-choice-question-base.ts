import { QuestionBase, ControlTypes } from "./question-base";
import {BehaviorSubject } from "rxjs/BehaviorSubject";

export interface IPropertyChangingArgsBase{
    propertyName: string;
    //eventSource: any;
}
export class PropertyChangingArgs<T> implements IPropertyChangingArgsBase {
    constructor(//public eventSource: any, 
        public propertyName: string, public oldValue: T, public newValue:T){}
}

export abstract class MultipleChoiceQuestionBase<T> extends QuestionBase<T> {
    constructor(options:{}={}){
        super(options);
        this.options = options['options'] || [];
        this.optionsListId = options['optionsListId'] || '';
    }

    private _options: {key: T, value: string}[] = [];
    get options(){return this._options}
    set options(value){
        this._onPropertyChanging.next(
            new PropertyChangingArgs(//this, 
                'options', this._options, value));
        this._options = value;
    }

    optionsListId = '';

    private _onPropertyChanging = new BehaviorSubject<IPropertyChangingArgsBase>(null);
    public readonly onPropertyChanging = this._onPropertyChanging.asObservable();
}
