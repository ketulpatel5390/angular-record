import { Component, OnInit } from '@angular/core';
import { NavLink } from '../_models/songbook-life';
import { SharedDataService } from '../_services/shared-data.service';

@Component({
  selector: 'app-mysongcrate',
  templateUrl: './mysongcrate.component.html',
  styleUrls: ['./mysongcrate.component.css']
})
export class MysongcrateComponent implements OnInit {

  navLinks = [
    new NavLink('All Songs in my Crate', 'songinmycrate')
  ];

  constructor(private sd: SharedDataService) {
    let self = this;
    self.sd.pageTitle.value = 'Admin';

   }

  ngOnInit() {
  }


}
