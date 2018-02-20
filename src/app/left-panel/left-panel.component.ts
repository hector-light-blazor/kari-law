import { Component, OnInit, Input } from '@angular/core';
import {PanelService} from "../panel.service";
import "rxjs/add/operator/takeWhile";

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css']
})
export class LeftPanelComponent implements OnInit {

 onBackArrow: boolean = true;
 isAlive: boolean = true;
 width: string = "0px";

  constructor(private _panel: PanelService) {

      //control map...
    
    this._panel.contrlPanel.takeWhile(() => this.isAlive).subscribe(value => {
       
        if(value.hasOwnProperty("isMobile")) {
           if(!value.isMobile) {
             this.width = "310px";
             this.onBackArrow = false;
           }
        }
        else if(value.hasOwnProperty("full")) {
          if(value.full) {
            this.width = "100%";
          }else{
            this.width = "0px";
          }
        }
        else if(value.hasOwnProperty("half")) {
          if(value.half) {
            this.width = "310px";
          }else{
            this.width = "0px";
          }
        }
    });

   }

  ngOnInit() {

    // console.log(this.mobile);
  }

  onClosePanel() {
    this.width = "0px";
  }
}
