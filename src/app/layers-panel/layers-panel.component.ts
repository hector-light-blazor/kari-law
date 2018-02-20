import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-layers-panel',
  templateUrl: './layers-panel.component.html',
  styleUrls: ['./layers-panel.component.css']
})
export class LayersPanelComponent implements OnInit {

  @Output() layer = new EventEmitter<string>();
  showDis: boolean = null;
  constructor() { }

  ngOnInit() {
  }

  onBase() {
    this.layer.emit("base");
  }

  onImagery() {
    this.layer.emit("aerial");
  }

  onDisclaimer() {
    let _self = this;
    this.showDis = false;

    setTimeout(() => {
      _self.showDis = true;
    }, 300);

   
  }

}
