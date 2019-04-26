import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { SharedDataService } from '../../_services/shared-data.service';
import { WebApiService } from '../../_services/web-api.service';

declare const paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit, AfterViewChecked {

  constructor(private sd: SharedDataService, private api: WebApiService) { }

  

  public didPaypalScriptLoad: boolean = false;

  public loading: boolean = true;



  public paymentAmount: number = 0;


  config = {
    env: 'sandbox',

    commit: true,
    // Set up a getter to create a Payment ID using the payments api, on your server side:

    payment: function() {

      // Set up a url on your server to create the payment
      var CREATE_URL = '/api/paypal/payment';

      // Make a call to your server to set up the payment
      return paypal.request.post(CREATE_URL)
          .then(function(res) {
              return res.paymentID;
          });
  },

  // onAuthorize() is called when the buyer approves the payment
  onAuthorize: function(data, actions) {

      // Set up a url on your server to execute the payment
      var EXECUTE_URL = '/api/paypal/execute';

      // Set up the data you need to pass to your server
      var data:any = {
          paymentID: data.paymentID,
          payerID: data.payerID
      };

      // Make a call to your server to execute the payment
      return paypal.request.post(EXECUTE_URL, data)
          .then(function (res) {
              window.alert('Payment Complete!');
          });
  }
,

    // Pass a function to be called when the customer cancels the payment

    onCancel: function(data) {

        console.log('The payment was cancelled!');
        console.log('Payment ID = ', data.paymentID);
    }

};

  ngOnInit() {
  }


  public ngAfterViewChecked(): void {
    let self = this;

    if(!this.didPaypalScriptLoad) {

      this.loadPaypalScript().then(() => {

        paypal.Button.render(self.config, '#paypal-button');

        this.loading = false;

      });

    }

  }



  public loadPaypalScript(): Promise<any> {

    this.didPaypalScriptLoad = true;

    return new Promise((resolve, reject) => {

      const scriptElement = document.createElement('script');

      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';

      scriptElement.onload = resolve;

      document.body.appendChild(scriptElement);

    });

  }
}
