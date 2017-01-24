import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StateService } from '../services/state.service';

@Component({
  selector: 'authorize-component',
  templateUrl: 'authorize.component.html'
})
export class AuthorizeComponent implements OnInit {

  constructor(
    private router: Router,
    private state: StateService
  ) {}

  public ngOnInit() {
    let settings = this.state.settings;
    const accessToken: string = this.router.parseUrl(this.router.url).fragment.replace('access_token=','');
    if (accessToken) {
      settings.apiKey = accessToken;
      this.state.save(settings);
      if (this.state.settings.valid()) {
        this.state.goTo('process');
      } else {
        this.state.goTo('configure');
      }
    }
  }

}