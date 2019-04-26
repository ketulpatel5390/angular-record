// import { BrowserModule } from '@angular/platform-browser';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
//import { NG_VALIDATORS, ReactiveFormsModule }    from '@angular/forms';
//import { HttpModule } from '@angular/http';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AuthGuard, AdminAuthGuard } from './_guards/index';
import { AuthenticationService, MyHttpInterceptor } from './_services/authentication.service';
import {UserService } from './_services/user.service';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';


import { AppComponent } from './app.component';

// import { ShareMusicComponent } from './share-music/share-music.component';
// import { GetMusicComponent } from './get-music/get-music.component';
import { AppRoutingModule } from './app-routing.module';
import {MaterialDesignModule} from './material-design-module';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { QuestionControlService } from './_services/question-control.service';
import { WebApiService } from './_services/web-api.service';
import { ConfirmComponent } from './confirm/confirm.component';
import { SharedDataService } from './_services/shared-data.service';
import { HeaderComponent } from './header/header.component';
import { FrontHeaderComponent } from './front-header/front-header.component';
import { ReviewMusicComponent } from './get-music/review-music/review-music.component';
import { GetMusicRoutingModule } from './get-music/get-music-routing.module';
import { GetMusicModule } from './get-music/get-music.module';
import { SharedModule } from './shared/shared.module';
import { ShareMusicModule } from './share-music/share-music.module';
import { AdminModule } from './admin/admin.module';
import { MysongcrateModule } from './mysongcrate/mysongcrate.module';
import { MysongcratefriendsModule } from './mysongcratefriends/mysongcratefriends.module';

import { DialogsModule } from './dialogs/dialogs.module';
import { SongUploadService } from './_services/song-upload.service';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { MyAccountModule } from './my-account/my-account.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SearchMusicComponent } from './search-music/search-music.component';
//import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AngularFontAwesomeModule } from 'angular-font-awesome'
import { FooterComponent } from './footer/footer.component';
import { StarRatingModule } from 'angular-star-rating';

/*import { SocialLoginModule,AuthServiceConfig,GoogleLoginProvider,FacebookLoginProvider } from "angular5-social-login";*/
import { AlertComponent } from './_directives/index';
import { AlertService} from './_services/alert.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {MyDatePickerModule} from 'mydatepicker';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';

import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import Swal from 'sweetalert2';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { EmailVerificationComponent } from './emailverification/emailverification.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { OwlModule } from 'ngx-owl-carousel';
import { Addtosongplaylist } from './_services/song-play-list.service';
import { CookieService } from './_services/cookie.service';
import { Addtolisteningroom } from './_services/song-addinlisteningroom.service';
import { MessagesModule } from './messages/messages.module';
import { ChooseplanComponent } from './chooseplan/chooseplan.component';

import { AboutusComponent } from './aboutus/aboutus.component';
import { HelpComponent } from './help/help.component';
import { LegalComponent } from './legal/legal.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ReportingComponent } from './reporting/reporting.component';
import { SongplaylistComponent } from './songplaylist/songplaylist.component';
import { VerifylinkComponent } from './verifylink/verifylink.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
// Configs 
/*export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('2179108212353937')
        }
      ]
  );
  return config;
}*/

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ConfirmComponent,
    HeaderComponent,
    FrontHeaderComponent,
    FooterComponent,
    ReviewMusicComponent,
    UnderConstructionComponent,
    CheckoutComponent,
    EditProfileComponent,
    SearchMusicComponent,
     AlertComponent,
     ResetpasswordComponent,
     EmailVerificationComponent,
     PublicProfileComponent,
     ChooseplanComponent,
     AboutusComponent,
     HelpComponent,
     LegalComponent,
     PrivacyComponent,
     ReportingComponent,
     SongplaylistComponent,
     VerifylinkComponent,
     ThankyouComponent
  ],

  
  imports: [
    // FormsModule,
    // ReactiveFormsModule,
    HttpClientModule,
    // BrowserModule,
    // BrowserAnimationsModule,
     MaterialDesignModule,
    GetMusicModule,
    ShareMusicModule,
    AdminModule,
    MysongcrateModule,
    MysongcratefriendsModule,
    MyAccountModule,
    AppRoutingModule,
    SharedModule,
    DialogsModule,
    AngularFontAwesomeModule,
    //SocialLoginModule,
    MultiselectDropdownModule,
    MyDatePickerModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    StarRatingModule.forRoot(),
    RecaptchaModule,
    RecaptchaFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    OwlModule,
    MessagesModule,
    TextMaskModule,
    NgxMyDatePickerModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AdminAuthGuard,
    AuthenticationService,
    UserService,
    AlertService,
    SharedDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true
    },

    QuestionControlService,
    WebApiService,
    SongUploadService,
    Addtosongplaylist,
    CookieService,
    Addtolisteningroom,
    /*{
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }*/

    // providers used to create fake backend
/*     fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
 */],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
