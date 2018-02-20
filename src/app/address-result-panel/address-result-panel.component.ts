import { Component, OnInit } from '@angular/core';
import {AppService} from "../app.service";
import "rxjs/add/operator/takeWhile";
import { EsriLoaderService } from 'angular-esri-loader';
import {PanelService} from "../panel.service";


@Component({
  selector: 'app-address-result-panel',
  templateUrl: './address-result-panel.component.html',
  styleUrls: ['./address-result-panel.component.css']
})
export class AddressResultPanelComponent implements OnInit {

  // =-=-=-= DECLARE VARIABLES -=-=-=-==-=
  isAlive: boolean = true;
  onBtn: boolean = false;
  addressData = [];
  streetsData = [];
  parcelsData: any = {"display" : []};

  addressLength:number = 0;
  streetsLength:number = 0;
  parcelsLength: number = 0;
  polyline:any=null;
  point:any = null;
  polygon: any = null;

  holdSelectedAddress:any;

  width: string = "0px";

  constructor(private _appService: AppService, private _panelService: PanelService, private esriLoader: EsriLoaderService) { }

  ngOnInit() {
    // < GET TAKE WHILE >

    this._appService.contrlAddress.takeWhile(() => this.isAlive).subscribe(response => {

       if(response) {
           if(typeof(response) == 'string') { // THIS IS EITHER PROP ID OR TAX ACCOUNT NUMBER...
              response = JSON.parse(response);
              this.parcelsData = response.results[0];
              this.parcelsLength = response.results.length;
              this.parseParcel();
           }else { // Either Site structure or Streets
             this.addressLength = (response.hasOwnProperty('match'))  ? response.match.length  : 0;
             this.streetsLength = (response.hasOwnProperty('ranges')) ? response.ranges.length : 0;

             if(this.addressLength > 0) {
              let obj = this.groupBy(response.match, "msagcommunity");
              this.addressData = obj;
             }
             if(this.streetsLength > 0) {
               let obj = this.groupBy(response.ranges, "msagcommunityleft");
               this.streetsData = obj;
               //if only one street info lets zoom in to that result...
               if(this.streetsLength == 1 && this.addressLength == 0) {
                this.zoomToStreet();
               }
           }

       }

         this._panelService.contrlPanel.next({full: false});
         this.onBtn = true;
         if(window.outerWidth <= 600) {
            this.width = "100%";

         }else {
           this.width = "310px";

         }


       }
    });

    this.loadGeometry();

  }
  parseParcel() {
    this.parcelsData.display = [];
    for(var x in this.parcelsData.attributes) {
      this.parcelsData.display.push({"name" : x, "value" : this.parcelsData.attributes[x]});
    }

    this.zoomToParcel();
    console.log(this.parcelsData);
  }
  onClosePanel() {
      this.addressData = [];
      this.streetsData = [];
      this.addressLength = 0;
      this.streetsLength = 0;

      this.onBtn = false;
      this.width = "0px";
      if(window.outerWidth > 600) {
        this._panelService.contrlPanel.next({half: true});
     }
  }

  // =-=-=-= LOAD NECESSARY MODULES FROM ESRI =-=-=-=-=-=-
  loadGeometry() {
    this.esriLoader.loadModules(["esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon"]).then(
        ([point, polyline, polygon]) => {
           this.point = point;
           this.polyline = polyline;
           this.polygon  = polygon;
        }
    );
  }

  transformGeometry(object) {
    if(this.holdSelectedAddress) this.holdSelectedAddress.selected = false;

    object.selected = true;

    this.holdSelectedAddress = object;
    let geom = JSON.parse(object.geometry);
    if(geom.type == "Point"){
       let pnt  = this.point({"x": geom.coordinates[0], "y": geom.coordinates[1], "spatialReference": {"wkid": 4326 } });
       this._appService.passGeometryToMap(pnt);
    }else{
       let poly = this.polyline(geom.coordinates);
       this._appService.passGeometryToMap(poly);
    }
  }

  zoomToParcel() { // Only if the search is parcels...
    let polygon = this.polygon(this.parcelsData.geometry.rings);
     this._appService.passGeometryToMap(polygon);
    console.log(polygon);
  }

  zoomToStreet() { //Only Single Street return lets zoom in not waste time...
      this.holdSelectedAddress = this.streetsData[0].data[0];
      this.holdSelectedAddress.selected = true;
      let geom = JSON.parse(this.holdSelectedAddress.geometry);
      if(geom.type == "Point"){
         let pnt  = this.point({"x": geom.coordinates[0], "y": geom.coordinates[1], "spatialReference": {"wkid": 4326 } });
         this._appService.passGeometryToMap(pnt);
      } else{
         let poly = this.polyline(geom.coordinates);
         this._appService.passGeometryToMap(poly);
      }
  }

  // =-=-=- MODULE -=-=-=-=- Handle Group By Address Result =-=-=-=-=-=-=
  groupBy(collection, property) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
        {
            collection[i].selected = false;
            result[index].data.push(collection[i]);

        }
        else {
            values.push(val);
            collection[i].selected = false;
            result.push({"name": val,"data" : [collection[i]]});
        }
    }
    return result;
  }

}
