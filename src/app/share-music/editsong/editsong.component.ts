import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { EditSong,Song,KVP } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-editsong',
  templateUrl: './editsong.component.html',
  styleUrls: ['./editsong.component.css']
})
export class EditsongComponent implements OnInit{
  editsong: EditSong;
  editsongid:any;
  formdata;
  error = '';
  default: string = 'UK';
  countries :any;
  countrylist: any;
  genreslist:any;
  constructor(private router: Router,private api: WebApiService, private sd: SharedDataService,
    private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Edit Song';
     self.editsongid= this.route.snapshot.params['id'];

  }
  ngOnInit() {
    let self = this;
    this.spinnerService.show();
    self.api.getProperty<KVP[]>('Countries').subscribe(response => {
      this.spinnerService.hide();
      
      self.countrylist=response;
      
    });
    this.spinnerService.show();
    self.api.getProperty<KVP[]>('Genres').subscribe(response => {
      this.spinnerService.hide();
      self.genreslist=response;
       });

    //console.log("Countrylist",this.countrylist);
    this.formdata = new FormGroup({
         songid: new FormControl(""),
         title: new FormControl("", Validators.compose([Validators.required])),
         artistName: new FormControl("", Validators.compose([Validators.required])),
         albumName: new FormControl(""),
         copyrightOwner: new FormControl(""),
         copyrightYear: new FormControl(""),
         genre: new FormControl("", Validators.compose([Validators.required])),
         label: new FormControl("", Validators.compose([Validators.required])),
         artistCityState: new FormControl("", Validators.compose([Validators.required])),
         artistCountry: new FormControl("", Validators.compose([Validators.required])),
         website: new FormControl(""),
         whereToBuy: new FormControl(""),
         Facebook_link: new FormControl(""),
         Twitter_link: new FormControl(""),
         Spotify_link: new FormControl(""),
         iTunes_link: new FormControl("")

    });
    this.spinnerService.show();
    self.api.editsongbyuser(self.editsongid).subscribe(response => {
      this.spinnerService.hide();
      self.editsong = response;
      this.formdata.setValue({
         songid: this.editsong.SongId,
         title: this.editsong.SongTitle,
         artistName: this.editsong.ArtistName,
         albumName: this.editsong.AlbumName,
         copyrightOwner: this.editsong.Copyright_Owner,
         copyrightYear: this.editsong.Copy_Year,
         genre: this.editsong.Genre,
         label: this.editsong.Label,
         artistCityState: this.editsong.State,
         artistCountry: this.editsong.Country,
         website: this.editsong.Website,
         whereToBuy: this.editsong.wheretobuy,
         Facebook_link: this.editsong.Facebook_link,
         Twitter_link: this.editsong.Twitter_link,
         Spotify_link: this.editsong.Spotify_link,
         iTunes_link: this.editsong.iTunes_link,
      });
    });
   
    //self.api.getProperty<KVP[]>('Genres').subscribe();
    
    

  }
  onClickSubmit(formdatavalue){
    console.log("Form Submit Data",JSON.stringify(formdatavalue));
    this.spinnerService.show();
   this.api.updateSong(this.editsongid, JSON.stringify(formdatavalue)).subscribe(response => {
     this.spinnerService.hide();
      console.log('Song updated ', response);
      
      this.router.navigate(['/shareMusic/portfolio']);
    });
  }
  

}
