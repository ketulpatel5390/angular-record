import { Component, OnInit, ViewChild,Inject,ElementRef } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FormControl, ValidatorFn, Validators, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { KVP,Application } from '../../_models/songbook-life';
import { IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import swal from 'sweetalert2';
import * as $ from 'jquery';
export class InputDialogData {
  albumtype? = 'Input Box';
  
}

@Component({
  selector: 'app-albumdetail-dialog',
  templateUrl: './albumdetail-dialog.component.html',
  styleUrls: ['./albumdetail-dialog.component.css']
})

export class AlbumdetailDialogComponent implements OnInit {
   error = '';
   successerror = '';
   albumform: FormGroup;
   photoName: any;
    photoContent : any;
    fileExtension: any;
    fileExtensionError: boolean = false;
    fileExtensionMessage: any;
   //genreslist: any;
    @ViewChild('fileInput') fileInput: ElementRef;
    submitted = false;
    generslist: IMultiSelectOption[];
  mySettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 7,
    displayAllSelectedText: true,
    selectionLimit: 1,
    autoUnselect: true,
    isLazyLoad: true,
     maxHeight:'150px',
};
  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<AlbumdetailDialogComponent>, private spinnerService: Ng4LoadingSpinnerService,@Inject(MAT_DIALOG_DATA) public data: InputDialogData) { 
  }



  ngOnInit() {
    /*this.api.getProperty<KVP[]>('GenreGroupNames').subscribe(response => {
      console.log("Genreslist",response);
      this.genreslist=response;
       console.log("AfterGenreslist",this.genreslist);
    });*/
     this.api.getGenreGroupNames().subscribe(response =>{
      //this.genersgroupname = response;

      this.generslist = response;
      //this.spinnerService.hide();
    });
    
    this.albumform = new FormGroup({
      albumtype: new FormControl(""),
      albumName: new FormControl("", Validators.compose([Validators.required])),
      avatar: new FormControl(null),
      imageInput: new FormControl('',Validators.compose([Validators.required])),
      genre_id: new FormControl('',Validators.compose([Validators.required])),
    });
    this.albumform.setValue({
      albumtype:this.data.albumtype,
      albumName:'',
      avatar:null,
      imageInput:'',
      genre_id:''
    });
  }

  onNoClick(){
    let self = this;
    self.closeDialog();
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
          this.albumform.get('imageInput').setValue(reader.result);
          
          
         }; 
       } else {
         swal(
          'Only Image allowed!!',
          '  Image extension like "jpg","jpeg","png","JPG","JPEG".',
          'warning'
        );
          this.fileExtensionMessage = "Only photos allowed!!"
          this.fileExtensionError = true;
          this.albumform.patchValue({
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
  closeDialog(){
    let self = this;
    if (self.albumform.valid){
      //console.log(self.albumform.value);
      this.spinnerService.show();
      this.api.insertalbuminfo(JSON.stringify(self.albumform.value)).subscribe(response => { 
        //console.log(response);
        this.spinnerService.hide();
        self.dialogRef.close(response);

      });
      
      
    }else{

      //this.error ="";
      this.submitted = true;
      /*if(self.albumform.value.albumName == ""){
        this.error+= 'Please Enter albumName';
      }
      if(self.albumform.value.imageInput == ""){
        this.error+= 'Please Upload Album Image';
      }*/
      
      
    }
     
  }
  cancelDialog(){
    let self = this;
    self.dialogRef.close();
  }

}
