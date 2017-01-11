import { Component } from '@angular/core';
import { Router } from '@angular/router';
import '../../public/css/styles.css';
@Component({
  selector: 'universal-angular-demo',
  template: `<router-outlet><md-spinner></md-spinner></router-outlet>`
})
export class AppComponent {

  constructor(private router: Router) {};

}
