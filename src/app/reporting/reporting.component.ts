import { Component, OnInit,AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { WebApiService } from '../_services/web-api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {FormControl, FormGroup,AbstractControl, Validators} from '@angular/forms';
import * as $ from 'jquery';
import swal from 'sweetalert2';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {


  //public routerLinkVariable = "/editprofile"; 
  errorreportform: FormGroup;
  photoName: any;
    photoContent : any;
    fileExtension: any;
    fileExtensionError: boolean = false;
    fileExtensionMessage: any;
    submitted = false;
  constructor(
      private router: Router,
      private api: WebApiService, 
      private dialog: MatDialog,
      private spinnerService: Ng4LoadingSpinnerService
      ) { 
    
  }

 
 
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;
    this.errorreportform = new FormGroup({
      description: new FormControl("", Validators.compose([Validators.required])),
      avatar: new FormControl(null),
      imageInput: new FormControl(''),
      });
    
    
  }
  onFileChanged(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      this.photoName = file.name;
      var allowedExtensions =["jpg","jpeg","png","JPG","JPEG"];
      this.fileExtension = this.photoName.split('.').pop();
      
      if(this.isInArray(allowedExtensions, this.fileExtension)) {
        this.fileExtensionError = false;
        this.fileExtensionMessage = "";
      reader.readAsDataURL(file);
      
       reader.onload = () => {
         reader.result;
          console.log(" reader.result", reader.result); 
          //this.albumform.get('imageInput').setValue(reader.result);
          this.errorreportform.get('imageInput').setValue(reader.result);
          
       }; 
       } else {
         swal(
          'Only Image allowed!!',
          '  Image extension like "jpg","jpeg","png","JPG","JPEG".',
          'warning'
        );
          this.fileExtensionMessage = "Only Image allowed!!"
          this.fileExtensionError = true;
          this.errorreportform.patchValue({
                avatar: '',
                imageInput : ''
              });
      }
       //this.editgeneralform.get('imageInput').setValue(reader.result);
       
    }
  }
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
  onSubmitHandler(){
  
    let self = this;
    if (self.errorreportform.valid){
      this.spinnerService.show();
      this.api.inserterrorreport(JSON.stringify(self.errorreportform.value)).subscribe(response => { 
          console.log(response);
          this.spinnerService.hide();
          swal({
            title: 'E-mail Successfully Sent!',
            text: "Thanks For Error Reporting.",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
              this.ngOnInit();
             }
          })
      });
    }else{
      this.submitted = true;
    }
    console.log(this.errorreportform.value);
  }
  reset(){
    this.ngOnInit();
  }
  
}
