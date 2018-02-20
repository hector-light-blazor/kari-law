import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppService {


  geocodeURL: string = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/";
  url: string = "https://gis.lrgvdc911.org/php/kari/index.php/";
  public contrlAddress = new Subject<any>();
  public geometry  = new Subject<any>();
  
  constructor(private _http:HttpClient) { }

  GET_METHOD(site) {
    return this._http.get(this.geocodeURL + site);
  }

  POST_METHOD(site, obj) {
    return this._http.post(this.url + site, obj);
  }

  passGeometryToMap(geom) {
      this.geometry.next(geom);
  }
}
