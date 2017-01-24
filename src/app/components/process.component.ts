import { Component, OnInit } from '@angular/core';

import { CookieService } from 'angular2-cookie/core';
import { InstagramService } from '../services/instagram.service';
import { StateService } from '../services/state.service';

import { SettingsModel } from '../models/settings.model';

@Component({
  selector: 'process-component',
  templateUrl: 'process.component.html'
})
export class ProcessComponent implements OnInit {

  constructor(
    private cookie: CookieService,
    private instagram: InstagramService,
    private state: StateService
    ) {}

  public ngOnInit() {
    if (!this.state.settings.valid()) {
      this.state.goTo('configure');
    } else {
      this.start();
    }
  }

  public start() {
    this.state.loading = false;
  }
}
