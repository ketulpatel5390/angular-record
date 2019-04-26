import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavLink } from '../../_models/songbook-life';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor() { }

  @Input('navLinks') navLinks: NavLink;
  @Output() onLoadPage = new EventEmitter();
  ngOnInit() {
  }
  menus(){
  	this.onLoadPage.emit();
  }

}
