import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavLink } from '../../_models/songbook-life';
import { WebApiService } from '../../_services/web-api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router ,Event  } from '@angular/router';
import { MessageDetails} from '../../_models/songbook-life';
@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessagelistComponent implements OnInit {

  constructor(private api: WebApiService,  
    private spinnerService: Ng4LoadingSpinnerService,private router: Router ) { }

  @Input('navLinks') navLinks: NavLink;
   @Input() song_id: any;
  @Output() onLoadPage = new EventEmitter();
  messagelist:MessageDetails[];
  ngOnInit() {
    //console.log(this.song_id);

    this.api.messagelistbyid(this.song_id).subscribe(response =>{
      this.messagelist = response;
       //console.log(this.messagelist);
    });
  }

}
