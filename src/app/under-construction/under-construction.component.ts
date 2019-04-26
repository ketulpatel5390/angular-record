import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../_services/shared-data.service';
import { WebApiService } from '../_services/web-api.service';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.css']
})
export class UnderConstructionComponent implements OnInit {

  constructor(private sd: SharedDataService, private api: WebApiService) 
  {
    let self = this;
    self.sd.headerIsVisible.value = false;
  }

  email: string = null;

  ngOnInit() {
  }

  requestNotification(){
    let self = this;
    self.sd.showProgressBar('Processing notification request...');
    self.api.requestNotification(self.email).subscribe(response => {
      self.sd.hideProgressBar();
      console.log('Notification Request Response', response);
      if (response > 0)
        alert('Your request for notification has been received!');
    });
  }
}
