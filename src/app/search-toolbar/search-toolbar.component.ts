import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { CompleterService, CompleterData } from 'ng2-completer';
import {AppService} from "../app.service";
@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.css']
})
export class SearchToolbarComponent implements OnInit {

  @Output() onSelectAddress = new EventEmitter<any>();
  @Output() onTogglePanel = new EventEmitter<any>();
  @Input() mobile: boolean = false;

  isMbl: string = "318px";
  dataService: CompleterData;
  searchAddress: string = "";
  autoCompleteURL: string = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/search/autoComplete/?auto=";
  foundOnEnter: boolean = false;
  // For Search HCAD INFORMATION...
  propertyId: string = 'hcad.DBO.Parcel.PROP_ID';
  hoodName: string = 'HCAD2.dbo.web_map_property.hood_name';
  taxAccount: string = 'HCAD2.dbo.web_map_property.geo_id';

  constructor(private completerService: CompleterService, private _appService: AppService) {

    // <<< AUTO COMPLETE SEARCH ENGINE >>>
    this.dataService = completerService.remote(this.autoCompleteURL, "address", "address")
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if(this.mobile) {
      this.isMbl = "8px";
    }


  }

  // <<< FOLLOWING MODULES HANDLES NG COMPLETER COMPONENT >>>
  onSelectedSearch(select) {
    //  console.log(select);
    //  console.log("HELLO SELECTED");
     this.foundOnEnter = true;
     this.onSelectAddress.emit(select);
  }

  // ...Module Gets Text And Searches Database for address match...
  onEnterSearch(event) {
      if(this.foundOnEnter) {
        this.foundOnEnter = false;
        return;
      }
      if(event == "click") {
          var isnum = /^\d+$/.test(this.searchAddress);
          if(isnum) { //If Number is property id...
            let search = 'search='+ this.searchAddress + '&field=' + this.propertyId;
            this._appService.GET_METHOD('proxy/findHCADParcels/?' + search).subscribe((data:any) => {

                this._appService.contrlAddress.next(data);
            });
            return;
          }else if(this.searchAddress.indexOf("-") != -1) { // Tax Account Number..
            let search = 'search='+ this.searchAddress + '&field=' + this.taxAccount;
            this._appService.GET_METHOD('proxy/findHCADParcels/?' + search).subscribe((data:any) => {
                  console.log(data);
                  this._appService.contrlAddress.next(data);
            });
            return;
          }


          if(this.searchAddress.indexOf('&') != -1) {
            let final = encodeURIComponent(this.searchAddress);
            this._appService.GET_METHOD("search/geocoder/?address=" + final).subscribe((data) => {

              this._appService.contrlAddress.next(data);
            });
          }else{
            this._appService.GET_METHOD("search/geocoder/?address=" + this.searchAddress).subscribe((data) => {

              this._appService.contrlAddress.next(data);
            });
          }
      // END OF CLICK
    }else // CHECK IF KEYCODE...
      {
        if(event.keyCode == 13) { // if keycode was press enter...
          var isnum = /^\d+$/.test(this.searchAddress);
          if(isnum) { // If number property id...
            let search = 'search='+ this.searchAddress + '&field=' + this.propertyId;
            this._appService.GET_METHOD('proxy/findHCADParcels/?' + search).subscribe((data:any) => {
                 this._appService.contrlAddress.next(data);
            });
            return;
          }
          else if(this.searchAddress.indexOf("-") != -1) { // Tax Account Number..
            let search = 'search='+ this.searchAddress + '&field=' + this.taxAccount;
            this._appService.GET_METHOD('proxy/findHCADParcels/?' + search).subscribe((data:any) => {
                  this._appService.contrlAddress.next(data);
            });
            return;
          }

          if(this.searchAddress.indexOf('&') != -1) {
            let final = encodeURIComponent(this.searchAddress);
            this._appService.GET_METHOD("search/geocoder/?address=" + final).subscribe((data) => {

              this._appService.contrlAddress.next(data);
            });
          }else{
            this._appService.GET_METHOD("search/geocoder/?address=" + this.searchAddress).subscribe((data) => {

              this._appService.contrlAddress.next(data);
            });
          }
        }
      }
  }

  onTglPanel() {
    if(!this.mobile) {
      switch (this.isMbl) {
        case "8px":
          this.isMbl = "318px";
          break;
        default:
          this.isMbl = "8px";
          break;
      }
    }

    this.onTogglePanel.emit(true);
  }



}
