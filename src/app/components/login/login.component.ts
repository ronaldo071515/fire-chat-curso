import { ChatService } from './../../providers/chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  constructor(private _cs: ChatService) { }

  ngOnInit(): void {
  }

  ingresar(metodo: string) {
    /* console.log(metodo); */
    this._cs.login( metodo );
  }

}
