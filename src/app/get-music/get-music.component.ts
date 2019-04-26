import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../_services/web-api.service';
import { Song, NavLink } from '../_models/songbook-life';

@Component({
  templateUrl: './get-music.component.html',
  styleUrls: ['./get-music.component.css']
})
export class GetMusicComponent implements OnInit {

  constructor(private api: WebApiService) { }
  navLinks = [
    new NavLink('Review Needed', 'reviewMusic'),
    new NavLink('Browse/Search', 'findMusic'),
   // new NavLink('Song Crate', 'library')
  ];
  
  ngOnInit() {
   
  }

  testSession($event){
    let self = this;
    self.api.distributeSongs().subscribe(response => {
      alert(JSON.stringify(response));
    })
  }
}
