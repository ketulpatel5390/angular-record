import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebApiService } from '../../_services/web-api.service';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SharedDataService } from '../../_services/shared-data.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-SharemySongCrate',
  templateUrl: './SharemySongCrate.component.html',
  styleUrls: ['./SharemySongCrate.component.css']
})
export class SharemySongCrateComponent implements OnInit{

  constructor(private api: WebApiService, private sd: SharedDataService,
     private spinnerService: Ng4LoadingSpinnerService) { 
    let self = this;
    self.sd.pageTitle.value = 'Admin - Log';

  }


  ngOnInit() {
    localStorage.removeItem('songlisteningroom');
    let self = this;


  }
 
}