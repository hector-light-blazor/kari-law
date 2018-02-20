import { Component, OnInit } from '@angular/core';
import {PanelService} from "./panel.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // ------  PRIVATE VARIABLES -------
  show: boolean = false;
  ldShow: boolean = true;
  title = 'app';
  onTogglePanel: boolean = true;
  isMobile: boolean = false;
  isHttps: boolean = false;
  selectLayer: string = "";
  zoomOptions: any = null;
  cookie: Array<string> = [];
  disclaimerOnOff: boolean = false;
  // ---- LOAD PANEL SERVICE FOR COMMUNICATION BETWEEN PANEL AND HERE -----
  constructor(private _panel: PanelService) {

  }

  ngOnInit() {

    // ...Check is Mobile...
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        this.isMobile = true;
    }

    // ...Check is protocla https or http...
     if(location.protocol != "https:")
     {
        this.isHttps = true;
     }else {
       console.log(" REGULAR HTTP ");
     }
  }

  // --- Module Close Loading Pane ----
  onCloseLoading() {
    this.ldShow = false;

    //Lets check for the cookies here...
    let _self = this;

    setTimeout(function() {
        _self.disclaimerOnOff = true;

        // Check Cookies...
        if(document.cookie) {
            // Lets Process the cookie
            //this.cookie = document.cookie.split(';'); // Collect Cookies into array of string...
            _self.cookie = document.cookie.split(';');
            let check = _self.getCookieName('chck'); // Get Username information..
            if(check){
            _self.disclaimerOnOff = false;
          }
        }
    }, 300);

  }

  // ---- MODULE HANDLES GET COOKIES FROM BROWSER ----
  getCookieName(name): string {
     let response = '';
     let lng = this.cookie.length;

     for(var x = 0; x < lng; x++) {
        if(this.cookie[x].includes(name)) {
          this.cookie[x] = this.cookie[x].trim();
          response = this.cookie[x].substr(name.length + 1);
        }
     }

     return response;
  }


  // --- MODULE HANDLES PANEL CHANGE ----
  onPanelChng() {

    this.onTogglePanel = !this.onTogglePanel;
    if(this.isMobile) {

        // this.isFullPanel = !this.isFullPanel;
        if(this.onTogglePanel) {
          this._panel.contrlPanel.next({full: false});
        }else {
          this._panel.contrlPanel.next({full: true});
        }
    }else {
      if(this.onTogglePanel) {
        this._panel.contrlPanel.next({half: true});
      }else {
        this._panel.contrlPanel.next({half: false});
      }

    }
  }

  // ....Module Runs when Map Is Loaded...
  onMapHello() {

    this.ldShow = false;

    let _self = this;
    setTimeout(() => {
      if(!_self.isMobile) {

        _self._panel.contrlPanel.next({isMobile: false})
      }
      _self.onCloseLoading();
    }, 200);

  }
}
