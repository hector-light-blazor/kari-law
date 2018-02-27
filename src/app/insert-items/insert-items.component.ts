import { Component,Input, Output, EventEmitter, OnInit } from '@angular/core';
import {AppService} from "../app.service";

@Component({
  selector: 'app-insert-items',
  templateUrl: './insert-items.component.html',
  styleUrls: ['./insert-items.component.css']
})
export class InsertItemsComponent implements OnInit {
  @Input() point: any = null;
  attributes: LOCATIONS = {date: null, items: [], state: "TX"};
  totalItems: number = 0;
  itemname: string = '';
  itemqty: number = 0;

  //Error For Form..
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
  updateForm: boolean = false;
  lawid: string = "";
  @Output() closePanel = new EventEmitter();
  constructor(private app:AppService) { }

  ngOnInit() {
    console.log(this.point);

    if(this.point.hasOwnProperty('data')) {
       console.log(this.point);
       this.updateForm = true;
       if(this.point.data.graphic.attributes.items) {
         this.attributes.items = JSON.parse(this.point.data.graphic.attributes.items); // Convert string to json array..
       }
       this.attributes.date = this.point.data.graphic.attributes.dte;
       this.attributes.address = this.point.data.graphic.attributes.address;
       this.attributes.bus_name = this.point.data.graphic.attributes.bus_name;
       this.attributes.city = this.point.data.graphic.attributes.city;
       this.attributes.email = this.point.data.graphic.attributes.email;
       this.attributes.phone = this.point.data.graphic.attributes.phone;
       this.attributes.contact_name = this.point.data.graphic.attributes.contact_name;
       this.attributes.zipcode = this.point.data.graphic.attributes.zipcode;
       this.lawid = this.point.data.graphic.attributes.id;
       this.point = this.point.data.mapPoint;
    }
    //Fetch Data from this id.. 
  }

  onSubmit() {
      if(!this.attributes.date) {
        this.dateError = true;
      }else {
        this.dateError = false;
      }

      if(!this.attributes.bus_name) {
        this.bNameError = true;
      }else {
        this.bNameError = false;
      }

      if(!this.attributes.contact_name) {
        this.cNameError = true;
      }else {
        this.cNameError = false;
      }

      if(!this.attributes.phone) {
        this.phoneError = true;
      }
      else {
        this.phoneError = false;
      }

      if(!this.attributes.email) {
        this.emailError = true;
      }else {
        this.emailError = false;
      }

      if(!this.attributes.state) {
        this.stateError = true;
      }else {
        this.stateError = false;
      }

      if(!this.attributes.city) {
        this.cityError = true;
      }else {
        this.cityError = false;
      }

      if(!this.attributes.address) {
        this.addressError = true;
      }else {
        this.addressError = false;
      }

      if(!this.attributes.zipcode) {
        this.zipCodeError = true;
      }else {
        this.zipCodeError = false;
      }
      
      if(this.zipCodeError || this.addressError || this.cityError || this.stateError || this.emailError || this.phoneError || this.cNameError || this.bNameError || this.dateError)
      {
         return;
      }
      this.attributes.x = this.point.x;
      this.attributes.y = this.point.y;
      console.log(this.attributes);
      console.log(this.point);

      if(this.updateForm) {
        console.log("GOINT TO UPDATE FORM");
        this.app.POST_METHOD('handle/updateKari/', {data: this.attributes}).subscribe((response:any) => {
            console.log(response);
            
        });
      }else { // Handles Insert New Item..
        this.app.POST_METHOD("handle/obj/", this.attributes).subscribe((response:any) => {
          console.log(response);
          if(response.answer){
            this.onCancel();
          }else {
            alert("Error Saving");
          }
       });
      }
     

  }

  onDelete() {
    let answer = confirm("Are you sure want to delete record!");
    if(answer) {
        this.app.POST_METHOD("handle/deleteKari/", {data: this.lawid}).subscribe((response:any) => {
          console.log(response);
          this.closePanel.emit(true);
      }); 
    }
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
       
      let total = 0;
       this.attributes.items.push({name: this.itemname, qty: this.itemqty});

       this.attributes.items.forEach(element => {
          total += +element.qty;
       });

       this.totalItems = total;

       this.itemname = '';
       this.itemqty = 0;
    
      
  }

  onRemoveItem(index) {

    console.log(index);
    this.attributes.items.splice(index, 1);

    let total = 0;
  

    this.attributes.items.forEach(element => {
       total += +element.qty;
    });

    this.totalItems = total;
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
  lawid?: string;
  name?: string;
  qty?: number;
}
