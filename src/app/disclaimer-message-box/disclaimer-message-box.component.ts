import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-disclaimer-message-box',
  templateUrl: './disclaimer-message-box.component.html',
  styleUrls: ['./disclaimer-message-box.component.css']
})
export class DisclaimerMessageBoxComponent implements OnInit {
  @Input() disclaimerOnOff: boolean = false;
  @Input() showDownloadBtn: boolean = true;
  @Input() showCheckBox: boolean = false;
  @Input() showCloseBtn: boolean = false;
  @Input() showCancelBtn: boolean = false;
  fullView:boolean = true;

  constructor() { }

  ngOnInit() {
    this.fullView = (window.outerWidth > 500);
  }

  onDownload() {
    window.open("https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/gis/downloadGISLayers/", "_blank");
    this.disclaimerOnOff = false;
  }

  onCancel() {
    this.disclaimerOnOff = false;
  }
  onCheck(e) {
      if(e.target.checked) {
        this.setCookie('chck', true, 360);
      }else { // Delete cookie...
        document.cookie="chck=;expires=Wed; 01 Jan 1970"
      }


  }
  setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

}
