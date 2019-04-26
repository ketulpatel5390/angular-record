import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavLink } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router ,Event  } from '@angular/router';
@Component({
  selector: 'app-genres-card',
  templateUrl: './genres-card.component.html',
  styleUrls: ['./genres-card.component.css']
})
export class GenrescardComponent implements OnInit {

  constructor(private api: WebApiService,  
    private spinnerService: Ng4LoadingSpinnerService,private router: Router ) { }

  @Input('navLinks') navLinks: NavLink;
   @Input() generid: any;
  @Output() onLoadPage = new EventEmitter();
  generslist:any[];
  ngOnInit() {
    console.log(this.generid);
    this.api.getSubGenreByid(this.generid).subscribe(response =>{
      //this.genersgroupname = response;

      this.generslist = response;
      //this.spinnerService.hide();
    });
  }
  menus(){
  	this.onLoadPage.emit();
  }
  searchgener(genername){
    this.router.navigate(['/getMusic/findMusic',{ searchval: genername}]);

  }

}
