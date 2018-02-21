import { Component,Output, EventEmitter, OnInit } from '@angular/core';
import {AppService} from "../app.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  pass: string = '';
  @Output() closeLogin = new EventEmitter();
  constructor(private app: AppService) { }

  ngOnInit() {
  }

  onLogin() {
      if(!this.username) {  
        alert("Please enter username.")
        return;
      }

      if(!this.pass) {
        alert("Please enter password.")
        return;
      }

      this.app.POST_METHOD('handle/login/', {json: {username: this.username, password: btoa(this.pass)}})
      .subscribe((response: any) => {
          if(response.success) {
            this.closeLogin.emit(true);
          }else {
            alert("Wrong Username or Password?");
          }
      });





  }

}
