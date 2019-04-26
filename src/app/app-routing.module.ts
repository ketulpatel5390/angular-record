import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';
import { AuthGuard,AdminAuthGuard } from './_guards/index';

import {GetMusicComponent} from './get-music/get-music.component';
import { ShareMusicComponent} from './share-music/share-music.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { MyProfileComponent } from './my-account/my-profile/my-profile.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SearchMusicComponent } from './search-music/search-music.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RenewPackageComponent } from './my-account/RenewPackage/RenewPackage.component';
import { EmailVerificationComponent } from './emailverification/emailverification.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { ChooseplanComponent } from './chooseplan/chooseplan.component';

import { AboutusComponent } from './aboutus/aboutus.component';
import { HelpComponent } from './help/help.component';
import { LegalComponent } from './legal/legal.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ReportingComponent } from './reporting/reporting.component';
import { SongplaylistComponent } from './songplaylist/songplaylist.component';
import { VerifylinkComponent } from './verifylink/verifylink.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
//underconstruction
const routes: Routes = [
  { path: '', redirectTo:'/home' , pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'resetpassword/:id/:id2', component: ResetpasswordComponent },
  { path: 'login', component: LoginComponent },
  //{ path: 'login', redirectTo: 'underConstruction' },
  {path: 'register', component: RegisterComponent},
  {path: 'confirm', component: ConfirmComponent, canActivate: [AuthGuard]},
  {path: 'search', component: SearchMusicComponent},
 
  
  {path: 'underConstruction', component: UnderConstructionComponent},
  {path: 'myProfile', component: MyProfileComponent, canActivate: [AuthGuard]},
  {path: 'RenewPackage', component: RenewPackageComponent, canActivate: [AuthGuard]},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'chooseplan', component: ChooseplanComponent},
  {path: 'editprofile', component: EditProfileComponent, canActivate: [AuthGuard]},
  {path: 'emailverification/:id/:id2' , component: EmailVerificationComponent},
  {path: 'PublicProfile/:id', component: PublicProfileComponent, canActivate: [AuthGuard]},

  { path: 'aboutus', component: AboutusComponent },
  { path: 'help', component: HelpComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'errorreporting', component: ReportingComponent, canActivate: [AuthGuard] },
  { path: 'playlist', component: SongplaylistComponent, canActivate: [AuthGuard] },
  { path: 'verifylink', component: VerifylinkComponent},
  { path: 'thankyou', component: ThankyouComponent}
  
  /*{path: 'resetpassword', component: RegisterComponent},*/
 // { path: '**', redirectTo:'/home' },
  /*{path: '**', redirectTo:'admin', canActivate: [AdminAuthGuard]},*/
 // { path: '**', redirectTo:'getMusic', canActivate: [AuthGuard] },
  //{ path: '**', redirectTo:'underConstruction' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false })],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}