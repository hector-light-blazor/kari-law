import { Component,Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-insert-items',
  templateUrl: './insert-items.component.html',
  styleUrls: ['./insert-items.component.css']
})
export class InsertItemsComponent implements OnInit {

  attributes: LOCATIONS = {date: new Date(), items: []};
  totalItems: number = 0;
  itemname: string = '';
  itemqty: number = 0;

  dateError: boolean = false;
  bNameError: boolean = false;
  cNameError: boolean = false;
  phoneError: boolean = false;
  emailError: boolean = false;
  addressError: boolean = false;
  cityError: boolean = false;
  stateError: boolean = false;
  zipCodeError: boolean = false;

  // Error for Inserting Items
  itemNameError: boolean = false;
  itemQTYError: boolean = false;

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

  onAddItem() {

      if(!this.itemname) {
         this.itemNameError = true;
      }else {
        this.itemNameError = false;
      }

      if(this.itemqty < 1) {
         this.itemQTYError = true;
      }else {
        this.itemQTYError = false;
      }

      if(this.itemNameError || this.itemQTYError) {
         
        return;
      }
      
       this.attributes.items.push({name: this.itemname, qty: this.itemqty});
       this.itemname = '';
       this.itemqty = 0;
    
      
  }

  onRemoveItem(index) {

    console.log(index);
    this.attributes.items.splice(index, 1);
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
   x?: string;
   y?: string;
   items?: Array<LISTITEMS>;
}

interface LISTITEMS {
  name?: string;
  qty?: number;
}
