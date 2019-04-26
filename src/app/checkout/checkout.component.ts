import { Component, OnInit } from '@angular/core';
import { SharedDataService,IToken } from '../_services/shared-data.service';
import { WebApiService } from '../_services/web-api.service';
import { ObservableMedia } from '@angular/flex-layout';
import {environment} from '../../environments/environment';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material';
import { Router,ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
declare let paypal: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

imageName;
  bgimageName;
   public didPaypalScriptLoad: boolean = false;
  public loading: boolean = true;
  public finalAmount: any = 0;
  public packagename: any = "";
  package:any;
  isAuthenticated: boolean;
  constructor(private sd: SharedDataService, private api: WebApiService, private media: ObservableMedia,
    private dialog: MatDialog,private route: ActivatedRoute,private router: Router,
     private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    self.sd.pageTitle.value = 'Checkout';
    self.package = self.sd.tempData.package;
    console.log(self.package);
    this.packagename=this.package.PkgType + " - " + this.package.PkgName + " - " + this.package.PkgDetail;
    
  }
  
  numColumns = 2; rowHeight = '2:1';
  
  ngOnInit() {
    let self = this;

 let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;


    self.media.subscribe(change => {
      console.log('Media changed ', change);
      if (change.mqAlias == 'xs'){
        self.numColumns = 1;
        self.rowHeight = '2:1';
      }
      else {
        self.numColumns = 3;
        self.rowHeight = '2:1';
      }
    });
  }

  cancelPayment(){
    //alert('Payment canceled');
    console.log("Deleting Application");
    swal({
            title: 'Are you sure You want to cancel payment When Delete Application.!',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
              this.spinnerService.show();
               this.api.deleteregisterApplication(this.package.appId,this.package.userId).subscribe(response =>{
                  console.log("Deleted Application");
                  this.spinnerService.hide();
                  swal(
                    'Deleted!',
                    'Application has been deleted.',
                    'success'
                  );
                  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/home']));
              
                });
            }   
          })
   

  }

  simulatePayment(){
    //alert('Simulate payment');
    console.log("Simulate payment");
    this.spinnerService.show();
               this.api.updateregisterApplication(this.package.appId,this.package.userId).subscribe(response =>{
                  console.log("Simulate payment update");
                  this.spinnerService.hide();
                  swal({
                        title: 'Payment submitted successfully!',
                        text: " Please Check Your Email Address For Confirmation Link",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                      }).then((result) => {
                        if (result.value) {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/home']));
                }
                  });
          });
  }
  userlogin(){
        let self = this;
        let d = self.dialog.open(LoginDialogComponent, { panelClass: 'custom-dialog-container',
                                                         backdropClass: 'custom-dialog-container-login'
                                                       });
        d.disableClose = true;

       d.backdropClick().subscribe(onclick => {
         console.log("onclick Event");
          d.close();
        });
   }


   paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'AY1v--6y9ZIw6c8X7njmQiAWLFR7TmpldCL3Zb2LQyBGZX4DbVsXYzE8RwZS-E368En9XqJrYBPmvvi7',
      production: ''
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        transactions: [{
      amount: {
        total: this.package.Price,
        currency: 'USD',
        },
      description: this.packagename,
     
    }],
    note_to_payer: 'Contact us for any questions on your Payment.'
        /*payment: {
          transactions: [
            { amount: 
              { total: this.finalAmount, currency: 'USD' 
              } 
            },
            description: 'The payment transaction description.',
           
          ]
        }*/
      });
    },
    onAuthorize: (data, actions) => {

      return actions.payment.execute().then((payment) => {
        //Do something when payment is successful.
         console.log(payment);
         console.log(this.package);
        let packageid = this.package.PkgId;
        this.spinnerService.show();
         this.api.updateregisterApplication(this.package.appId,this.package.userId).subscribe(response =>{
                  //console.log("Simulate payment update");
         });
         this.api.registerpaypalUserpayment(packageid,payment.id,this.package.userId).subscribe(response =>{
                  console.log("Paypal payment ");
                  this.spinnerService.hide();
                  swal({
                        title: 'Payment submitted successfully!',
                        text: "Please Check Your Email Address For Confirmation Link",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                      }).then((result) => {
                        if (result.value) {
                    //this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/home']));
                    this.router.navigate(['/home'])
                }
                  });
          });
       


      })
    }
  };
public ngAfterViewChecked(): void {
    let self = this;

    if(!this.didPaypalScriptLoad) {

      this.loadPaypalScript().then(() => {

        paypal.Button.render(self.paypalConfig, '#paypal-button');

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
