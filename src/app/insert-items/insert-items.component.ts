import { Component,Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-insert-items',
  templateUrl: './insert-items.component.html',
  styleUrls: ['./insert-items.component.css']
})
export class InsertItemsComponent implements OnInit {

  attributes: LOCATIONS = {date: new Date()};
  totalItems: number = 0;
  @Output() closePanel = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.attributes.date = new Date();
    
  }

  onSubmit() {

  }

  onCancel() {
    this.closePanel.emit(true);
  }

}

interface LOCATIONS {
   date?: Date;
   bus_name?: string;
   contact_name?: string;
   phone?: string;
   email?: string;
   address?: string;
   city?: string;
   state?: string;
   zipcode?: string;
   items?: Array<LISTITEMS>;
}

interface LISTITEMS {
  name?: string;
  qty?: number;
}
