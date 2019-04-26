import { AbstractControl } from "@angular/forms/src/model";
import {FormControl} from "@angular/forms";

export class MyValidators {
    static sameAs(path: string, label: string = undefined) {
        return (c: AbstractControl): {[key: string]: any} => {
            if (c.parent !== undefined){
                if (label === undefined) label = path;
                let c1 = c.parent.get(path);
                if (c.value != c1.value)
                    return {sameas: {'path': path, 'label': label}};
            }
            return null;
        }
    }

    static isValidDateofbirth(fc: FormControl){
        var regexes = /^(\d{1,2})\-(\d{1,2})\-(\d{4})$/;
        var dtRegex = new RegExp(/\b\d{1,2}[\-]\d{1,2}[\-]\d{4}\b/);
        console.log("fc.value",fc.value);
        console.log("fc.value",dtRegex.test(fc.value));
    if(!regexes.test(fc.value)){
      return ({isValidDateofbirth: true});
    } else {
      return (null);
    }
  }
}
