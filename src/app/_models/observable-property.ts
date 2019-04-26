import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class ObservableProperty<T> {
  constructor(private defaultValue: T = null){}

    private _onPropertyChanged: BehaviorSubject<T> = new BehaviorSubject<T>(this.defaultValue);
    public readonly onPropertyChanged = this._onPropertyChanged.asObservable();
    
    get value() {
      let rv = this._onPropertyChanged.value;
      return rv;
    }
    set value(value: T){
      let self = this;
      self._onPropertyChanged.next(value);
    }
}