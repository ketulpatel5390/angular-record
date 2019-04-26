import { Component, OnInit,AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SharedDataService,IToken } from '../_services/shared-data.service';
import { InputDialogComponent } from '../dialogs/input-dialog/input-dialog.component';
import { WebApiService } from '../_services/web-api.service';
import { ObservableMedia } from '@angular/flex-layout';
import { Application, NavLink, PackageDetail,KVP ,PackageDetails} from '../_models/songbook-life';
import { ChangePasswordDialogComponent } from '../dialogs/change-password-dialog/change-password-dialog.component';
import { AlertService} from '../_services/alert.service';
import { EditGeneralinfoDialogComponent } from '../dialogs/edit-generalinfo/edit-generalinfo.component';
import { EditGetmusicDialogDialogComponent } from '../dialogs/edit-getmusic-dialog/edit-getmusic-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {FormControl, FormGroup,AbstractControl, Validators} from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';
declare let paypal: any;
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-chooseplan',
  templateUrl: './chooseplan.component.html',
  styleUrls: ['./chooseplan.component.css']
})
export class ChooseplanComponent implements OnInit,AfterViewChecked {


  //public routerLinkVariable = "/editprofile"; 
 imageName;
  bgimageName;
  packagelist:any;
  public didPaypalScriptLoad: boolean = false;
  public loading: boolean = true;
  public finalAmount: any = 0;
  public packagename: any = "";
   public paypal_env: any = "";
  public paypal_key: any = "";
  paypalConfig : any;
  package:any;
  userid:any;
  appid:any;
 
  constructor(
     private router: Router,
      private sd: SharedDataService, 
      private api: WebApiService, 
      private media: ObservableMedia,
       private dialog: MatDialog,

       private alertService: AlertService, private spinnerService: Ng4LoadingSpinnerService
      ) { 
    let self = this;
    //debugger;
    self.sd.pageTitle.value = 'My Account';
    this.api.getinfoSiteconfig().subscribe(response => {
      //console.log("siteconfiginfo",response)
      this.paypal_env=response.paypal_env;
       this.paypal_key=response.paypal_key;
    });

     //self.package = self.sd.tempData.uploadasong;
     this.userid =self.sd.tempData.userId;
     this.appid  =self.sd.tempData.appId;
     //console.log(this.userid,this.appid);
   
    
  }

 
  renewpackageform: FormGroup;
 error :any='';
  app: Application;
  pacdetail: PackageDetail;
  songscount : any;
  totalsongcount : any;
  selectedOption:any = '';
  packagedetail : PackageDetails;

  get musicServed(): string {
    let self = this;
    return self.sd.translateGenreCodes(self.app.MusicServed);
  }

  ngOnInit() {
    let self = this;

 let baseulrs=environment.baseulrs;
    self.imageName = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/logo.png`;
    self.bgimageName=baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}assets/images/banner.jpg`;
    
    this.renewpackageform = new FormGroup({
          packageid: new FormControl("",Validators.compose([Validators.required])),
     });

    self.api.getProperty<KVP[]>('AppPackages').subscribe(response => { 
      this.packagelist=response;
    });
    //self.sd.showProgressBar('Retrieving user profile...');
    if(this.finalAmount > 0 ){
        $("#paypal-button").css("display", "block");
      }else{
        $("#paypal-button").css("display", "none");
      }
  
    
  }
 
  onSubmitHandler(){
   /* console.log(this.packagelist.value);
    this.sd.tempData = this.packagelist.value;*/
    
    
  }
  getValue(optionid) {
      this.selectedOption = this.packagelist.filter((item)=> item.id == optionid)[0];
      console.log(optionid);
      this.api.getregpackagedetail(optionid).subscribe(response => { 
      this.packagedetail=response;
      this.finalAmount=this.packagedetail.Price;
      this.packagename=this.packagedetail.PkgType + " - " + this.packagedetail.PkgName + " - " + this.packagedetail.PkgDetail;
      this.ngAfterViewChecked();
      if(this.finalAmount > 0 ){
        $("#paypal-button").css("display", "block");
      }else{
        $("#paypal-button").css("display", "none");
      }

    });
     
  }
  simulatePayment(){
    let packageid = this.renewpackageform.value.packageid;
    console.log(packageid);
    console.log(this.userid,this.appid);
    console.log("Simulate payment");
    this.spinnerService.show();
               this.api.packageregisterApplication(packageid,this.appid,this.userid).subscribe(response =>{
                  console.log("Simulate payment update");
                  this.spinnerService.hide();
                  swal({
                        title: 'Application submitted successfully.',
                        text: " ",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                      }).then((result) => {
                        if (result.value) {
                    //this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/home']));
                this.router.navigate(['thankyou']);
                }
                  });
          });
  }
  cancelPayment(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/home']));
  }
   
  public ngAfterViewChecked(): void {
    let self = this;
    this.paypalConfig = {
    env: 'sandbox',
    //env: this.paypal_env,
    client: {
      sandbox: 'AY1v--6y9ZIw6c8X7njmQiAWLFR7TmpldCL3Zb2LQyBGZX4DbVsXYzE8RwZS-E368En9XqJrYBPmvvi7',
      //sandbox: this.paypal_key,
      production: ''
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        transactions: [{
      amount: {
        total: this.finalAmount,
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
        // console.log(payment.id);
        let packageid = this.renewpackageform.value.packageid;
        this.spinnerService.show();
            this.spinnerService.show();
         this.api.packageregisterApplication(packageid,this.appid,this.userid).subscribe(response =>{
                  //console.log("Simulate payment update");
         });
         this.api.registerpaypalUserpayment(packageid,payment.id,this.userid).subscribe(response =>{
                  console.log("Paypal payment ");
                  this.spinnerService.hide();
                  swal({
                        title: 'Payment submitted successfully.',
                        text: "",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                      }).then((result) => {
                        if (result.value) {
                    //this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/home']));
                    this.router.navigate(['thankyou']);
                }
                  });
          });
       


      })
    }
  };
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
