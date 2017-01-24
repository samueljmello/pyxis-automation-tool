import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';

import { InstagramService } from '../services/instagram.service';
import { StateService } from '../services/state.service';

import { SettingsModel } from '../models/settings.model';
import { LogMessageModel } from '../models/log-message.model';

@Component({
  selector: 'configure-component',
  templateUrl: 'configure.component.html'
})
export class ConfigureComponent implements OnInit {

  private error: boolean = false;
  private errorMessage: string = '';
  private settings: SettingsModel = new SettingsModel();

  private userFullName: string = '';
  private userCache: Array<string>;

  constructor(
    private cookie: CookieService,
    private instagram: InstagramService,
    private router: Router,
    private state: StateService
  ) {}

  public ngOnInit() {
    this.settings = this.state.settings;
    if (this.settings.apiUrl && this.settings.apiKey) {
      this.instagram.setup(this.settings.apiUrl, this.settings.apiKey);
      this.instagram.getSelf().subscribe(
        (response) => {
          this.userFullName = `${response.data.full_name} (${response.data.username})`;
          this.loadAccounts();
          this.state.loading = false;
        },
        (error) => {
          this.error = true;
          this.errorMessage = 'Error connecting Instagram account.';
          this.deauthorize();
          this.state.loading = false;
        }
      );
    } else {
      this.state.loading = false;
    }
  }

  private loadAccounts() {
    this.userCache = this.settings.fromAccounts.slice();
    this.loadAccount();
  }

  private loadAccount() {
    if (this.userCache.length <= 0 ) {
      return;
    }
    this.instagram.getSearch(this.userCache[0]).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.userCache.splice(0);
        this.loadAccount();
      }
    );
  }

  private save() {
    this.state.loading = true;
    this.cleanAccounts();
    if (this.settings.valid()) {
      this.error = false;
      this.state.save(this.settings);
      this.instagram.setup(this.settings.apiUrl, this.settings.apiKey);
      this.state.goTo('process');
    } else {
      this.error = true;
      this.errorMessage = 'Please configure all settings correctly.';
      this.state.loading = false;
    }
  }

  private cleanAccounts() {
    for (let i = 0; i < this.settings.fromAccounts.length; i++) {
      this.settings.fromAccounts[i] = this.settings.fromAccounts[i].trim();
      if (this.settings.fromAccounts[i] === '') {
        this.settings.fromAccounts.splice(i, 1);
      }
    }
    for (let i = 0; i < this.settings.toAccounts.length; i++) {
      this.settings.toAccounts[i] = this.settings.toAccounts[i].trim();
      if (this.settings.toAccounts[i] === '') {
        this.settings.toAccounts.splice(i, 1);
      }
    }
  }

  private addAccount(what: string) {
    switch(what) {
      case 'to':
        this.settings.toAccounts.push('');
        break;
      case 'from':
        this.settings.fromAccounts.push('');
        break;
      default:
        break;
    }
  }

  private removeAccount(what: string, index: number) {
    switch(what) {
      case 'to':
        this.settings.toAccounts.splice(index, 1);
        break;
      case 'from':
        this.settings.fromAccounts.splice(index, 1);
        break;
      default:
        break;
    }
  }

  private trackByIndex(index: number, value: number) {
    return index;
  }

  private authorize() {
    const clientId = this.state.clientId;
    const redirectUrl = encodeURI(this.settings.redirectUrl);
    window.location.href = this.settings.authUrl + `?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=token&scope=public_content`;
  }

  private deauthorize() {
    this.settings.apiKey = '';
    this.cookie.remove('apiKey');
  }
}