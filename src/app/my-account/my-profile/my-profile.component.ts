import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import { InputDialogComponent } from '../../dialogs/input-dialog/input-dialog.component';
import { WebApiService } from '../../_services/web-api.service';
import { ObservableMedia } from '@angular/flex-layout';
import { Application, NavLink, PackageDetail } from '../../_models/songbook-life';
import { ChangePasswordDialogComponent } from '../../dialogs/change-password-dialog/change-password-dialog.component';
import { AlertService} from '../../_services/alert.service';
import { EditGeneralinfoDialogComponent } from '../../dialogs/edit-generalinfo/edit-generalinfo.component';
import { EditGetmusicDialogDialogComponent } from '../../dialogs/edit-getmusic-dialog/edit-getmusic-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { environment } from '../../../environments/environment';
import swal from 'sweetalert2';
import { GenresdisplayDialogComponent } from '../../dialogs/genres-display-dialog/genres-display-dialog.component';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {


  //public routerLinkVariable = "/editprofile"; 
  numColumns = 3; rowHeight = '4:1';
  avtar;
  isuploads='';
  inpromember: boolean=false;
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
    
    
  }
 error :any='';
  app: Application;
  pacdetail: PackageDetail;
  songscount : any;
  totalsongcount : any;
  largestpackageid:any;
  get musicServed(): string {
    let self = this;
    return self.sd.translateGenreCodes(self.app.MusicServed);
  }

  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    this.spinnerService.show();
    self.api.getpromember().subscribe(response => { 
      this.spinnerService.hide();
      if (response) {
         this.inpromember=true;
      }
    });
   this.isuploads=self.sd.currentUser.isupload;
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

    //self.sd.showProgressBar('Retrieving user profile...');
    this.spinnerService.show();
    self.api.getApplication().subscribe(response => {
     this.spinnerService.hide();
      self.app = response;
     
      self.app.MusicServed=response.MusicServed.replace(/\|/g, " | ");
      let baseulrs=environment.baseulrs;
      if(this.app.profile_pic != null){
            self.avtar = baseulrs + `${baseulrs.endsWith('/') ? '' : '/'}` + this.app.profile_pic;
        }
       
    });
    this.spinnerService.show();
    self.api.getApplicationPackage().subscribe(response => {
     this.spinnerService.hide();
     self.pacdetail = response;
       
    });
    this.spinnerService.show();
    self.api.songuploadsCountByUser().subscribe(response => {
      this.spinnerService.hide();
      self.songscount = response;
       
    });
    this.spinnerService.show();
    self.api.songuploadsRemainingCountByUser().subscribe(response => {
      this.spinnerService.hide();
     self.totalsongcount = response;
       
    });
    this.spinnerService.show();
    self.api.getlargestpackageid().subscribe(response => {
      this.spinnerService.hide();
     self.largestpackageid = response;
       
    });
    
  }
  editprofile(appid){
     let self = this;
     if(self.dialog.openDialogs.length <= 0){
    let ds = self.dialog.open(EditGeneralinfoDialogComponent, {  panelClass: 'custom-dialog-container', disableClose: true});
     ds.afterClosed().subscribe(s => {
              this.spinnerService.show();
            self.api.updateGeneralinfo(JSON.stringify(s)).subscribe(response => {
              this.spinnerService.hide();
                self.sd.hideProgressBar();
               this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/myProfile']));
               
                
            });           
          });
    }
  }
  changepass(appid){
    let self = this;

        let username ="";
        let resetCode = "";
    if(self.dialog.openDialogs.length <= 0){
         let d = self.dialog.open(ChangePasswordDialogComponent, { panelClass: 'custom-dialog-container', disableClose: true,
            data: {username: username, resetCode: resetCode},
          });
          d.afterClosed().subscribe(s => {
           if (s && s.newPassword == s.confirmPassword){
            this.spinnerService.show();
            self.api.changePassword(s.newPassword, s.oldPassword, username, resetCode).subscribe(response => {
            this.spinnerService.hide();
            this.alertService.success('Your password has been changed Successfully.');
            });
           } 
          });
    }
  }
 
  editsongreview(appid)
  {
     let self = this;
     if(self.dialog.openDialogs.length <= 0){
     let ds = self.dialog.open(EditGetmusicDialogDialogComponent , { panelClass: 'custom-dialog-container', disableClose: true});
     ds.afterClosed().subscribe(s => {
       if(s){
           this.spinnerService.show();

        self.api.updateGetmusic(JSON.stringify(s)).subscribe(response => {
          this.spinnerService.hide();
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/myProfile']));
        }); 
       }
              
     });
   }
  }
  uploadmusics(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/shareMusic/portfolio']));
  }
  yourportfoliyo(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/shareMusic/portfolio']));

  }
  RenewPackage(){
    if(this.largestpackageid === this.pacdetail.PkgId){
      console.log(this.largestpackageid);
    console.log(this.pacdetail.PkgId);
      swal({
              title: 'You already have a Pro account.',
              text: "",
              type: 'warning'
          })
    }else{
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/RenewPackage']));
    }
  }
  showMusicServed(MusicServed){
    //alert(MusicServed);
     if(this.dialog.openDialogs.length <= 0){
         let d = this.dialog.open(GenresdisplayDialogComponent, { panelClass: 'custom-dialog-container',disableClose: true });
         
    }
    /* var arr = MusicServed.split('|');
    swal("Genres", MusicServed);*/
     
  }
  varificationemail(){
    this.spinnerService.show();
    this.api.varificationemail().subscribe(response => {
        this.spinnerService.hide();
         swal({
              title: 'E-mail has been sent Successfully.',
              text: "Please Check Your E-mail Address.",
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) 
            {
               this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['/myProfile']));
            }
          })
        
    });
  }
}
