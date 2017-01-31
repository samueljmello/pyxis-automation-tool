import { Component, OnInit } from '@angular/core';

import { CookieService } from 'angular2-cookie/core';
import { InstagramService } from '../services/instagram.service';
import { StateService } from '../services/state.service';

import { AccountModel } from '../models/account.model';
import { MediaModel } from '../models/media.model';
import { SettingsModel } from '../models/settings.model';

@Component({
  selector: 'process-component',
  templateUrl: 'process.component.html'
})
export class ProcessComponent implements OnInit {

  private feed: Array<any> = new Array();

  constructor(
    private cookie: CookieService,
    private instagram: InstagramService,
    private state: StateService
    ) {}

  public ngOnInit() {
    if (!this.state.settings.valid()) {
      this.state.goTo('configure');
    } else {
      this.preload();
    }
  }

  private preload() {
    let accountsToQuery: Array<AccountModel>;
    if (this.state.settings.valid()) {
      accountsToQuery = this.state.settings.fromAccounts.slice();
      this.loadFeed(accountsToQuery);
    }
  }

  private loadFeed(accounts: Array<AccountModel>) {
    if (accounts.length <= 0) {
      this.state.loading = false;
      return;
    }
    this.instagram.getMedia(accounts[0].id, accounts[0].token).subscribe(
      (response) => {
        for (let i = 0; i < response.data.length; i++) {
          console.log(response.data[i]);
          this.feed.push(new MediaModel(response.data[i]));
        }
      },
      (error) => {},
      () => {
        accounts.splice(0,1);
        this.loadFeed(accounts);
      }
    );
  }

  private start() {
    this.state.loading = false;
  }
}
