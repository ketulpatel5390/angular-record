import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { SharedDataService, CacheItemNames } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { PagerConfig, PagerComponent } from '../../shared/pager/pager.component';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS } from '../../material-design-module';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Addtolisteningroom  } from '../../_services/song-addinlisteningroom.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-browse-by-genre',
  templateUrl: './browse-by-genre.component.html',
  styleUrls: ['./browse-by-genre.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class BrowsebygenreComponent implements OnInit, AfterViewInit {
  searchname: string ='';
  constructor(private api: WebApiService, private sd: SharedDataService,private router: Router, 
    private spinnerService: Ng4LoadingSpinnerService, 
    private route: ActivatedRoute,private dataService:Addtolisteningroom) { 
    let self = this;
    self.sd.pageTitle.value = 'Find Music';

  }

  @ViewChild('pagerCtrl') pagerCtrl: PagerComponent;

  pager = new PagerConfig();
  pagedSongs: Song[];
  songs: Song[];
  generslist : any[];
  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    this.api.getGenreGroupNamesbrowse().subscribe(response =>{
      //this.genersgroupname = response;

      this.generslist = response;
      //this.spinnerService.hide();
    });
  } 

  ngAfterViewInit(){
    let self = this;
       
  }

}
