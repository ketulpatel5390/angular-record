import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { RenewPackageComponent } from './RenewPackage/RenewPackage.component';
import { MaterialDesignModule } from '../material-design-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [MyProfileComponent,RenewPackageComponent]
})
export class MyAccountModule { }
