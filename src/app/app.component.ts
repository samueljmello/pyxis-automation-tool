import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StateService } from './services/state.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  constructor(private state: StateService, private router: Router) {}

}
