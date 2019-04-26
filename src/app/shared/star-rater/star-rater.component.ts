import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent} from "angular-star-rating";
 
@Component({
  selector: 'app-star-rater',
  templateUrl: './star-rater.component.html',
  styleUrls: ['./star-rater.component.css']
})
export class StarRaterComponent implements OnInit {

  constructor() { }
  
  @Output() onSubmit = new EventEmitter<number>();
 
  @Input() overallRating = 0;
  newRating = 0;

  ngOnInit() {
  }

  onRatingChangeHandler($event: OnRatingChangeEven){
    let self = this;
    //self.overallRating = $event.rating;
    self.newRating = $event.rating;
  }
  onSubmitHandler(){
    let self = this;
    //self.onSubmit.emit(self.overallRating);
    self.onSubmit.emit(self.newRating);
  }
}
