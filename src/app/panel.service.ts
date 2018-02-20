import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PanelService {
  public contrlPanel = new Subject<any>();

  
  constructor() { 

    // this.contrlPanel
  }

}
