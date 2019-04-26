import { Component, OnInit } from '@angular/core';
import { NavLink } from '../_models/songbook-life';
import { SharedDataService } from '../_services/shared-data.service';
import { WebApiService } from '../_services/web-api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-mysongcratefriends',
  templateUrl: './mysongcratefriends.component.html',
  styleUrls: ['./mysongcratefriends.component.css']
})
export class MysongcratefriendsComponent implements OnInit {

  navLinks = [
    new NavLink('Current Song Crate Friends', 'CurrentSongCrateFriends'),
    new NavLink('Received Requests', 'MySongCratePendingRequests'),
    //new NavLink('Share my Song Crate', 'SharemySongCrate'),
    new NavLink('Sent Requests', 'Myrequest')
  ];
  pendingrequestcount;
  SongcraterequestCount;
  constructor(private api: WebApiService,private sd: SharedDataService,
    private spinnerService: Ng4LoadingSpinnerService) {
    let self = this;
    self.sd.pageTitle.value = 'Admin';
      this.spinnerService.show();
      this.api.PendingSongcratefriendsinfoCount().subscribe(response => {
        this.pendingrequestcount=response;
        //console.log(this.pendingrequestcount);
        this.navLinks.find(nl => nl.label == 'Received Requests').counts = this.pendingrequestcount;
        this.spinnerService.hide();
      });
      this.spinnerService.show();
      this.api.getSongcraterequestCount().subscribe(response => {
        this.SongcraterequestCount=response;
        //console.log(this.SongcraterequestCount);
        this.navLinks.find(nl => nl.label == 'Sent Requests').counts =this.SongcraterequestCount;
        this.spinnerService.hide();
        
      });
   }

  ngOnInit() {
    //this.navLinks.find(nl => nl.label == 'My Song Crate Pending Requests').counts = '5';
    //this.navLinks.find(nl => nl.label == 'My Request').counts = '5';
  }


}
