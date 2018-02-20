import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  show: boolean = false;

  // Ouput Declarations...
  @Output() onClick = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  showGone() {
    this.show = !this.show;
    this.onClick.emit(this.show);
  }

}
