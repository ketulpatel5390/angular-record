import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { SimpleChanges } from "@angular/core";

export const enum ControlTypes {
    textbox = 'textbox',
    checkboxarray = 'checkboxarray',
    dropdown = 'dropdown',
    datetime = 'datetime',
    dropdowncheckbox = 'dropdowncheckbox'
}

export class QuestionBase<T> {
    constructor(options: {
        key?: string,
        label?: string,
        value?: T,
        controlType?: ControlTypes,
        order?: number,
        validators?: ValidatorFn[],
        isVisible?: boolean,
        onValueChangesHandler?: (c: AbstractControl, value: string)=>void
    }){
        this.key = options.key || '';
        this.label = options.label || 'Enter value';
        this.value = options.value == undefined ? <any>'': options.value;
        this.controlType = options.controlType || ControlTypes.textbox;
        this.order = options.order === undefined ? 1 : options.order;
        this.validators = options.validators || [];
        this.isVisible = options.isVisible || true;
        this.onValueChangesHandler = options.onValueChangesHandler;
    }

    controlType: ControlTypes;
    key: string;
    label: string;
    value: T;
    order: number;
    validators: ValidatorFn[];
    isVisible: boolean;
    onValueChangesHandler: (c: AbstractControl, value: string)=>void
}
