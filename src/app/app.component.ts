import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InstagramService } from './services/instagram.service';
import { StateService } from './services/state.service';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  /**
  * DO NOT REMOVE THIS (used in template)
  */
  constructor(
    private instagram: InstagramService,
    private state: StateService,
    private router: Router
    ) {
    this.instagram.setup(this.state.settings.apiUrl);
  }

}
