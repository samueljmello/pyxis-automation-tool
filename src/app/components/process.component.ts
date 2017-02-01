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

  private feed: Array<any>;
  private all: boolean = true;

  private after: string;
  private before: string;

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
    this.state.loading = true;
    this.feed = new Array();
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
    let afterDate: string;
    if (this.after) {
      afterDate = new Date(this.after).getTime().toString();
    }
    let beforeDate: string;
    if (this.before) {
      beforeDate = new Date(this.before).getTime().toString();
    }
    this.instagram.getMedia(accounts[0].id, accounts[0].token, afterDate, beforeDate).subscribe(
      (response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.feed.unshift(new MediaModel(response.data[i]));
        }
      },
      (error) => {},
      () => {
        accounts.splice(0,1);
        this.loadFeed(accounts);
      }
    );
  }

  private toggleMedia() {
    this.state.loading = true;
    const include = this.all = !this.all;
    for (let i = 0; i < this.feed.length; i++) {
      this.feed[i].include = include;
    }
    this.state.loading = false;
  }

  private start() {
    this.state.loading = true;
    this.state.feed = this.feed;
    this.state.goTo('results');
  }
}
