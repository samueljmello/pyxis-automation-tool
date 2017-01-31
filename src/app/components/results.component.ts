import { Component, OnInit } from '@angular/core';

import { CookieService } from 'angular2-cookie/core';
import { InstagramService } from '../services/instagram.service';
import { StateService } from '../services/state.service';

import { AccountModel } from '../models/account.model';
import { MediaModel } from '../models/media.model';
import { SettingsModel } from '../models/settings.model';

@Component({
  selector: 'results-component',
  templateUrl: 'results.component.html'
})
export class ResultsComponent implements OnInit {

  private feed: Array<any> = new Array();

  constructor(
    private cookie: CookieService,
    private instagram: InstagramService,
    private state: StateService
    ) {}

  public ngOnInit() {
    this.state.loading = false;
  }
}
