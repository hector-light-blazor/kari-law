import { Component, OnInit,Input, Output, EventEmitter, ViewChild,ElementRef } from '@angular/core';
import { EsriLoaderService } from 'angular-esri-loader';
import {AppService} from "../app.service";

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  // =-=-=-= OUTPUT VARIABLES =-=-=--=
  @Input() layer: string = null;
  @Input() zoom: any = null;
  @Input() enbEdit: boolean = false;
  @Output() onMapLoaded = new EventEmitter<boolean>();
  @Output() displayForm = new EventEmitter();
  @ViewChild("map") mapObj: ElementRef;

  map: any = null;
  isAlive: boolean = true;
  // URLS .....
  mapflexUrl: string = "https://gis.lrgvdc911.org/arcgis/rest/services/Dynamic/MapFlex2/MapServer";
  wmsurl: string = "https://txgi.tnris.org/login/path/contour-camera-poetic-poem/wms";
  wmtsurl: string = 'https://txgi.tnris.org/login/path/contour-camera-poetic-poem/wmts';

  // Reusable layers ....
  simpleLayer: any = null;
  baseLayer: any = null;
  wmsLayer: any = null;

  // Geometry Objects
  circleClass: any = null;
  pointClass: any = null;

  // Symbol Objects
  symbolClass: any = null;
  locationSmb: any = null;
  symbolLineOne: any = null;

  // Graphic Object
  graphicClass: any = null;
  graphic: any = null;
  // Dojo Objects
  Lang: any = null;
  Fx: any = null;

  // Array Objects....
  emsArr = [];
  lawArr = [];
  fireArr = [];
  resizeCenter: any = null;
  moveCenter:boolean = false;
  // ..keep track mouse clicks..
  keepTrack: any = {fire: null, ems: null, law: null};

  constructor(private esriLoader: EsriLoaderService, private _appService: AppService) { }

  ngOnInit() {
    //Zoom geometry..
    this._appService.geometry.takeWhile(() => this.isAlive).subscribe(value => {

         this.onZoom(value);
  });

  this.createMap();

  }

  // =-=-=-= DETECT CHANGES =-=--=-=--=-
  ngOnChanges() {
    if(this.layer) {
      switch (this.layer) {
        case "base":
          // this.map.removeLayer(this.wmsLayer);
          // this.map.removeLayer(this.simpleLayer);
          // this.map.addLayer(this.baseLayer);
          this.baseLayer.show();
          this.wmsLayer.hide();
          this.simpleLayer.hide();

          break;
        case "aerial":
          //  console.log(this.wmsLayer);
           this.baseLayer.hide();

           //this.map.removeLayer(this.baseLayer);
           //this.map.addLayer(this.wmsLayer);
           //this.map.addLayer(this.simpleLayer);
           this.wmsLayer.show();
          //  this.wmsLayer.show();

           this.simpleLayer.show();
           this.moveCenter = true;
          //  this.wmsLayer.refresh();
          //  this.wmsLayer.refresh();


           break;
        default:
          break;
      }
    }

    if(this.zoom) {
        // console.log("ZOOMING");
      if(this.zoom.hasOwnProperty("originalObject")){
          let geom = JSON.parse(this.zoom.originalObject.geometry);
          switch (geom.type) {
            case "Point":
              this.pointClass.setX(geom.coordinates[0]);
              this.pointClass.setY(geom.coordinates[1]);
              this.onZoom(this.pointClass);
              break;

            default:
              break;
          }
      }

      this.zoom = null;
    }
  }


  createMap() {
      let _self = this;
      this.esriLoader.loadModules(['esri/map', "esri/Color", "esri/config", "esri/graphic",
      'esri/layers/ArcGISDynamicMapServiceLayer','esri/layers/WMTSLayer','esri/layers/WMTSLayerInfo', 'esri/layers/WMSLayer',"esri/geometry/webMercatorUtils", "esri/geometry/Circle",
       "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol","esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/lang",
       "dojox/gfx/fx",]).then((
         [Map,Color, esriConfig, Graphic,
        ArcGISDynamicMapServiceLayer,WMTSLayer, WMTSLayerInfo, WMSLayer,webMercatorUtils, Circle, Point, SimpleMarkerSymbol, SimpleLineSymbol, Query , QueryTask, lang, fx]) => {

        esriConfig.defaults.io.proxyUrl = "https://gis.lrgvdc911.org/DotNet/proxy.ashx?";

        this.graphicClass = Graphic;
        this.circleClass = Circle;
        this.pointClass = new Point();

        this.Lang = lang;
        this.Fx = fx;

        this.locationSmb = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 14,
          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([1,1,1]), 3),
          new Color([220,20,60])); // Change the color to crimson from blueish...

          this.symbolLineOne = new SimpleLineSymbol({
            "type": "esriSLS",
            "style": "esriSLSSolid",
            "color": [33, 150, 243],
            "width": 2
          });

        // create the map at the DOM element in this component
        this.map = new Map(this.mapObj.nativeElement, {
          center: [-98.181790, 26.407308],
          slider: false,
          zoom: 9
        });



        // provide listeners to map functions ....
        this.map.on("load", function() {

          _self.autoRecenter();
          _self.wmsLayer.hide();
        })

        // Listen when all layers are added
        this.map.on('layers-add-result', function(evt) {

            _self.wmsLayer.hide();
            setTimeout(() => {
              _self.onMapLoaded.emit(true);
            }, 500);


        });

        // create base layers plus imagery layers...
        this.baseLayer = new ArcGISDynamicMapServiceLayer(this.mapflexUrl);


        //this.baseLayer.setVisibleLayers();
        // create wms layer imagery from google
        let layerInfo = new WMTSLayerInfo({ identifier: "texas", tileMatrixSet: '0to20', format: 'png'});
        let options = {serviceMode: 'KVP',visible:'false', layerInfo: layerInfo};

      this.wmsLayer = new WMTSLayer(this.wmtsurl, options); //new WMSLayer(this.wmsurl, {visible: false, format: "png",


      this.simpleLayer = new ArcGISDynamicMapServiceLayer(this.mapflexUrl, {visible: false, visibleLayers: [32, 0]});
      this.simpleLayer.setVisibleLayers([32, 0, 8, 10, 3]);
        // add layer...
      this.map.addLayers([this.wmsLayer,this.baseLayer,  this.simpleLayer]);
      
      this.map.on("mouse-move", function(evt){
          if(_self.enbEdit)  {
            _self.map.graphics.clear();
            _self.map.graphics.add(new _self.graphicClass(evt.mapPoint, _self.locationSmb));
          }
      });

      this.map.on('click', function(evt) {
        if(_self.enbEdit)  {
          _self.map.graphics.clear();
          _self.map.graphics.add(new _self.graphicClass(evt.mapPoint, _self.locationSmb));
          _self.enbEdit = false;
          let point = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
          
          _self.displayForm.emit(point);
        }
      });


    })
 }

// .... On Zoom Based on geometry ...
 onZoom(geometry) {
    if(geometry.type == "point")
    {
      let circle = this.circleClass(geometry, {"radius": 180});
     // this.map.centerAt(geometry, 15);
      this.map.setExtent(circle.getExtent());
      let _self = this;
      this.graphic = this.graphicClass(geometry, _self.locationSmb)
      _self.map.graphics.clear();
      _self.map.graphics.add(this.graphic);

      setTimeout(this.Lang.partial(function(animateMe) {

        var shape = animateMe.getDojoShape();
        _self.Fx.animateStroke({
          shape: shape,
          duration: 1000,
          color: { start: "#0658c4", end: shape.strokeStyle.color },
          width: { start: 25, end: shape.strokeStyle.width }
        }).play();

      }, _self.graphic), 800);


    }else {
      let _self = this;
      this.map.setExtent(geometry.getExtent());
      this.graphic = this.graphicClass(geometry, this.symbolLineOne);
      this.map.graphics.clear();
      this.map.graphics.add(this.graphic);

       setTimeout(this.Lang.partial(function(animateMe) {

                  var shape = animateMe.getDojoShape();
                  _self.Fx.animateStroke({
                    shape: shape,
                    duration: 500,
                    color: { start: "#0658c4", end: shape.strokeStyle.color },
                    width: { start: 20, end: shape.strokeStyle.width }
                  }).play();
                  _self.Fx.animateStroke({
                    shape: shape,
                    duration: 300,
                    color: { start: "#0658c4", end: shape.strokeStyle.color },
                    width: { start: 3, end: shape.strokeStyle.width }
                  }).play();
                  _self.Fx.animateStroke({
                    shape: shape,
                    duration: 300,
                    color: { start: "#0658c4", end: shape.strokeStyle.color },
                    width: { start: 4, end: shape.strokeStyle.width }
                  }).play();

        }, _self.graphic), 800);


    }


  }
  autoRecenter() {
    var resizeDelay = 100;
    let _self = this;
    this.map.on("resize", function(object) {
       _self.resizeCenter = _self.map.extent.getCenter();

       setTimeout(function() {
              _self.map.centerAt(_self.resizeCenter);

          }, resizeDelay);

    });
  }

}
