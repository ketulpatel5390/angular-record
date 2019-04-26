import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {

  constructor() { }

  @Input() pager: PagerConfig;
  @Output() onLoadPage = new EventEmitter();

  ngOnInit() {
  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 12) {
    let self = this;
      // calculate total pages
      let totalPages = Math.ceil(totalItems / pageSize);

      let startPage: number, endPage: number;
      if (totalPages <= 12) {
          // less than 10 total pages so show all
          startPage = 1;
          endPage = totalPages;
      } else {
          // more than 10 total pages so calculate start and end pages
          if (currentPage <= 6) {
              startPage = 1;
              endPage = 6; //10
          } else if (currentPage + 4 >= totalPages) {
              startPage = totalPages - 5; //9
              endPage = totalPages;
          } else {
              startPage = currentPage - 3;//5
              endPage = currentPage + 2;//4
          }
      }

      // calculate start and end item indexes
      let startIndex = (currentPage - 1) * pageSize;
      let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

      // create an array of pages to ng-repeat in the pager control
      let pages = _.range(startPage, endPage + 1);

      // return object with all pager properties required by the view
      
         self.pager.totalItems = totalItems;
         self.pager.currentPage = currentPage;
         self.pager.pageSize = pageSize;
         self.pager.totalPages = totalPages;
         self.pager.startPage = startPage;
         self.pager.endPage = endPage;
         self.pager.startIndex = startIndex;
         self.pager.endIndex = endIndex;
         self.pager.pages = pages;
      
         return self.pager;
  }

  setPage(page: number) {
    let self = this;
    if (page < 1 || page > self.pager.totalPages) {
        return;
    }

    // get pager object from service
    self.pager = self.getPager(self.pager.totalItems, page,self.pager.pageSize);

    // get current page of items
    //this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    self.onLoadPage.emit();
    
  }
}

export class PagerConfig {
  totalItems: number;
  currentPage = 1;
  pageSize = 10;
  totalPages: number;
  startPage = 1;
  endPage: number;
  startIndex = 0;
  endIndex: number;
  pages:any;

}
