import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

import { SettingsModel } from '../models/settings.model';

@Injectable()
export class StateService {

  public clientId: string = process.env.PYXIS_INSTAGRAM_CLIENT_ID;

  public loading: boolean = true;
  public settings: SettingsModel = new SettingsModel();

  constructor(
    private cookie: CookieService,
    private router: Router
  ) {
    this.restore();
  }

  public goTo(url: string) {
    this.loading = true;
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 250);
  }

  public save(settings: SettingsModel) {
    this.settings = settings;
    this.store();
  }

  public store() {
    this.cookie.put('apiUrl', this.settings.apiUrl);
    this.cookie.put('authUrl', this.settings.authUrl);
    this.cookie.put('apiKey', this.settings.apiKey);
    this.cookie.put('redirectUrl', this.settings.redirectUrl);
    this.cookie.put('fromAccounts', JSON.stringify(this.settings.fromAccounts));
    this.cookie.put('toAccounts', JSON.stringify(this.settings.toAccounts));
  }

  private restore() {
    this.settings = new SettingsModel(
      this.cookie.get('apiKey'),
      this.getCookieAndParse('fromAccounts'),
      this.getCookieAndParse('toAccounts')
    );
    if (this.cookie.get('authUrl')) {
      this.settings.authUrl = this.cookie.get('authUrl');
    }
    if (this.cookie.get('apiUrl')) {
      this.settings.apiUrl = this.cookie.get('apiUrl');
    }
    if (this.cookie.get('redirectUrl')) {
      this.settings.redirectUrl = this.cookie.get('redirectUrl');
    }
  }

  public getCookieAndParse(key: string) {
    const cookie = this.cookie.get(key);
    if (cookie) {
      return JSON.parse(cookie);
    }
    return cookie;
  }

}
