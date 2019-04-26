import { Component, Inject, OnInit } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl,FormArray, FormGroup,Validators } from '@angular/forms';
import { InduvidualFans,KVPG } from '../../_models/songbook-life';
import * as $ from 'jquery';
import { IMultiSelectOption,IMultiSelectSettings,IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
@Component({
  selector: 'app-distribute-song-dialog',
  templateUrl: './distribute-song-dialog.component.html',
  styleUrls: ['./distribute-song-dialog.component.css']
})
export class DistributeSongDialogComponent implements OnInit {
   inpromember: boolean=false;
   inothermember: string='1';
   displayfavourite=false;
   feedbackform: FormGroup;
  // Applicationlist:KVPG[];
  Applicationlist: IMultiSelectOption[];
   StateorProvinancelist:IMultiSelectOption[];
  mySettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 7,
    displayAllSelectedText: true,
    minSelectionLimit:0,
    autoUnselect: true,
};
myTexts: IMultiSelectTexts = {
   
    defaultTitle: 'Select Option',
    
};
  constructor(private api: WebApiService,
    private dialogRef: MatDialogRef<ConfirmSiteSpecificExceptionsInformation>,
      @Inject(MAT_DIALOG_DATA) public songFile) { }

  payload: string;
  titlepayload:string; 

  ngOnInit() {
    $('.displayfavourite').css('display','none');
    let self = this;
    self.payload = self.songFile.songId;
    self.titlepayload = self.songFile.title;
    
    self.api.getFavouriteMember().subscribe(response => { 
     
        self.Applicationlist = response;
        console.log("getFavouriteMember",self.Applicationlist);
      });
    
     self.api.getFavouriteMemberStateOrProvinance().subscribe(response => { 
     
        self.StateorProvinancelist = response;
        console.log("StateOrProvinance",self.StateorProvinancelist);
      });
     self.api.getpromember().subscribe(response => { 
      if (response) {
         this.inpromember=true;
         this.inothermember='0';
      }
      });
     this.feedbackform = new FormGroup({
       songid: new FormControl(""),
        addLink: new FormControl(""),
        favourite: new FormControl(""),
        fav: new FormControl(""),
        region: new FormControl("")
    });
     this.feedbackform.patchValue({
         songid : self.payload,
         addLink: 'No',
         favourite: 'No',
         fav:[],
         region:[]
         });
  }
  onChange(favlist:string, isChecked: boolean) {
    const emailFormArray = <FormArray>this.feedbackform.controls.fav;

    if(isChecked) {
      emailFormArray.push(new FormControl(favlist));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == favlist)
      emailFormArray.removeAt(index);
    }
  }
  onNoClick(){
    let self = this;
    self.closeDialog();
  }

  closeDialog(){
    let self = this;
    console.log("this.feedbackform",this.feedbackform.value);
    let feedbackform=JSON.stringify(this.feedbackform.value);
    self.api.submitdistribution(feedbackform).subscribe(response => { 
      //console.log(response);
      self.dialogRef.close(self.songFile);
     });

    

    
  }
  show1(){
    //this.displayfavourite=true;
    $('.displayfavourite').css('display','block');
  }
  show2(){
  // this.displayfavourite=false;
    $('.displayfavourite').css('display','none');
    $('.getFavouriteMember').css('display','none');
    $('.getregion').css('display','none');
    
   
  }
  show3(){
    //this.displayfavourite=true;
    $('.getFavouriteMember').css('display','block');
    $('.getregion').css('display','none');
  }
  show4(){
  // this.displayfavourite=false;
    $('.getFavouriteMember').css('display','none');
    $('.getregion').css('display','none');
   
  }
  show5(){
    $('.getFavouriteMember').css('display','none');
    $('.getregion').css('display','block');
    
  }

}
