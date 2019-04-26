import { Component, OnInit } from '@angular/core';
import { WebApiService } from '../_services/web-api.service';
import { Song, NavLink } from '../_models/songbook-life';

@Component({
  templateUrl: './share-music.component.html',
  styleUrls: ['./share-music.component.css']
})
export class ShareMusicComponent implements OnInit {

  constructor(private api: WebApiService) { }
  navLinks = [
    //new NavLink('Upload',     'uploadMusic'),
    new NavLink('Portfolio',  'portfolio')
  ];
  
  ngOnInit() {
  }
}
