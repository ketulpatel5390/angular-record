import { Component, Inject, OnInit, ViewChild,ElementRef } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuestionBase } from '../../question-base';
import { TextboxQuestion } from '../../textbox-question';
import { KVP, KVPG,Application } from '../../_models/songbook-life';
import { DropdownQuestion } from '../../dropdown-question';
import { SongWithData } from '../../_services/song-upload.service';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { SharedDataService } from '../../_services/shared-data.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
@Component({
  selector: 'app-edit-song-dialog',
  templateUrl: './edit-song-dialog.component.html',
  styleUrls: ['./edit-song-dialog.component.css']
})
export class EditSongDialogComponent implements OnInit {
   error = '';
   formdata;
   countrylist:any;
   //generslist:any;
   IsVisible ='';
    statelist :any;
   app: Application;
    photoName: any;
photoContent : any;
fileExtension: any;
fileExtensionError: boolean = false;
fileExtensionMessage: any;
inpromember: boolean=false;
   @ViewChild('fileInput') fileInput: ElementRef;
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
  constructor(private sd: SharedDataService, private api: WebApiService,
    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>,
      @Inject(MAT_DIALOG_DATA) public songFile: SongWithData, private spinnerService: Ng4LoadingSpinnerService) { }

  @ViewChild('form') form: DynamicFormComponent;
  questions: QuestionBase<any>[]=[];
submitted = false;
  ngOnInit() {
    let self = this;
    /*this.spinnerService.show();
    self.api.getProperty<KVP[]>('Genres').subscribe(response =>{
      this.generslist = response;
      this.spinnerService.hide();
    });*/
    this.spinnerService.show();
    self.api.getpromember().subscribe(response => { 
      this.spinnerService.hide();
      if (response) {
         this.inpromember=true;

      }
    });
    this.api.getGenreGroupNamesedit().subscribe(response =>{
      this.generslist = response;
     });
    this.spinnerService.show();
    self.api.getProperty<KVP[]>('Countries').subscribe(response =>{
      this.countrylist =response;
      this.spinnerService.hide();
    });
    this.spinnerService.show();
    self.api.getProperty<KVP[]>('States').subscribe(response =>{
      this.statelist =response;
      this.spinnerService.hide();
    });
    //self.initializeQuestions(); ,
    this.formdata = new FormGroup({
        songId: new FormControl(""),
         title: new FormControl("", Validators.compose([Validators.required])),
         artistName: new FormControl("", Validators.compose([Validators.required])),
         albumName: new FormControl(""),
         copyrightOwner: new FormControl(""),
         copyrightYear: new FormControl(""),
         genre: new FormControl("", Validators.compose([Validators.required])),
         label: new FormControl("", Validators.compose([Validators.required])),
         artistCityState: new FormControl("", Validators.compose([Validators.required])),
         artistCountry: new FormControl("", Validators.compose([Validators.required])),
         artistCity: new FormControl("", Validators.compose([Validators.required])),
         website: new FormControl(""),
         whereToBuy: new FormControl(""),
         avatar: new FormControl(""),
         imageInput: new FormControl(''),
         Facebook_link: new FormControl(""),
         Twitter_link: new FormControl(""),
         Spotify_link: new FormControl(""),
         iTunes_link: new FormControl(''),
         sociallink: new FormControl(''),
         

    });
     let tag = self.songFile;
     console.log( this.songFile);
     if(this.songFile.artist_image){
        document.getElementById('picture').setAttribute('src',this.songFile.artist_image);
     }else{
       document.getElementById('picture').style.display = "none";
     }
   // this.api.getGenreNamewheneditsong(self.songFile.songId).subscribe(response =>{

     // let meditgener = response.split('|');
      let year = tag.copyrightYear.trim();
    let title = tag.title;
    let artistName = tag.artistName;
    let albumName =  tag.albumName;
    let copyrightOwner = tag.copyrightOwner;
      
      this.formdata.setValue({
         songId:self.songFile.songId,
         title: title,
         artistName: artistName,
         albumName:albumName,
         copyrightOwner:copyrightOwner,
         copyrightYear: year,
         genre: '',
         label: 'Indie',
         artistCityState:'',
         artistCountry:'',
         artistCity:'',
         website:'',
         whereToBuy:'',
         avatar: null,
         imageInput:'',
         Facebook_link:'',
         Twitter_link:'',
         Spotify_link:'',
         iTunes_link:'',
         sociallink:'',
        });
    // });
    this.formdata.controls['genre'].setValue([], {emitEvent: false});
    this.formdata.patchValue({
          artistCountry: 'US'
          });
    this.spinnerService.show();
    self.api.getpromember().subscribe(response => { 
      console.log("after init set value in form");
      this.spinnerService.hide();

    if(this.inpromember == true){
          this.formdata.patchValue({
          sociallink:'Y'
        });
           this.spinnerService.show();
        this.api.getApplication().subscribe(response => {
          this.app = response;
          this.formdata.patchValue({
             Facebook_link:this.app.facebook,
             Twitter_link:this.app.twitter,
             Spotify_link:this.app.youtube,
             iTunes_link:this.app.instagram,
          });

         this.spinnerService.hide();
          
          
           
        });
      
    }else{
      this.formdata.patchValue({
          sociallink:'N'
        });
    }
     });
  }

  onNoClick(){
    let self = this;
    self.closeDialog();
  }
cancelDialog(){
    let self = this;
    //self.dialogRef.close();
    swal({
      title: 'Are you sure you want to delete this Song?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinnerService.show();
        self.api.deletesongs(self.songFile.songId).subscribe(response => {
          swal(
          'Deleted!',
          'Song has been deleted.',
          'success'
        );
          this.spinnerService.hide();
         self.dialogRef.close(); 
        });
        
      }
      
    })
  }

  closeDialog(){
    let self = this;
    if (self.formdata.valid){
      self.onSubmitHandler(self.formdata.value);
      self.dialogRef.close(self.songFile);
    }
    else {
      //alert('Please fill in form before closing');
       this.submitted = true;
    }

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
          this.formdata.get('imageInput').setValue(reader.result);
          /*this.formdata.patchValue({
          avatar: reader.result
          });*/
       }; 
       } else {
         swal(
          'Only Image allowed!!',
          '  Image extension like "jpg","jpeg","png","JPG","JPEG".',
          'warning'
        );
          this.fileExtensionMessage = "Only photos allowed!!"
          this.fileExtensionError = true;
          this.formdata.patchValue({
                avatar: '',
               });
      }
       //this.editgeneralform.get('imageInput').setValue(reader.result);
       
    }
  }
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  onSubmitHandler(json){
    let self = this;
    console.log('Form Value', JSON.stringify(json));
    this.spinnerService.show();
    self.api.updateSongs(JSON.stringify(json)).subscribe(response => {
      console.log('Song updated ', response);
      this.spinnerService.hide();
    });

    self.copyProperties(JSON.stringify(json), self.songFile);
  }

  private copyProperties(source, destination) {
    for (var prop in source){
      if (source.hasOwnProperty(prop)) destination[prop] = source[prop];
    }
  }
  ShowSociallink(value){
    console.log(value);
    this.formdata.patchValue({
      sociallink:value
    });
    if(value == 'N'){
      this.IsVisible ='N';
      this.formdata.patchValue({
         Facebook_link:'',
         Twitter_link:'',
         Spotify_link:'',
         iTunes_link:'',
        });
       
    }else{

       this.IsVisible ='';
       this.spinnerService.show();
        this.api.getApplication().subscribe(response => {
          this.app = response;
          this.formdata.patchValue({
             Facebook_link:this.app.facebook,
             Twitter_link:this.app.twitter,
             Spotify_link:this.app.youtube,
             iTunes_link:this.app.instagram,
          });

         this.spinnerService.hide();
          
          
           
        });
       

    }
  }

}
