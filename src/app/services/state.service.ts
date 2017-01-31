import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

import { MediaModel } from '../models/media.model';
import { SettingsModel } from '../models/settings.model';

@Injectable()
export class StateService {

  public company: string = 'Pyxis Automation Tool';
  public clientId: string = process.env.PYXIS_INSTAGRAM_CLIENT_ID;
  public error: boolean = false;
  public errorMessage: string = '';
  public loading: boolean = true;
  public settings: SettingsModel = new SettingsModel();
  public feed: Array<MediaModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cookie: CookieService,
    private router: Router,
    private title: Title
  ) {
    this.setTitle();
    this.restore();

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        this.setTitle(event['title']);
      }
    );
  }

  public goTo(url: string) {
    this.loading = true;
    setTimeout(() => {
      this.router.navigateByUrl(url).then((result) => {
        if (!result) {
          this.loading = false;
        }
      });
    }, 250);
  }

  public setTitle(newTitle: string = '') {
    let title = `${this.company}`;
    if (newTitle && newTitle !== '') {
      title += ` | ${newTitle}`;
    }
    this.title.setTitle(title);
  }

  public save(settings: SettingsModel) {
    this.settings = settings;
    this.store();
  }

  public store() {
    this.cookie.put('apiUrl', this.settings.apiUrl);
    this.cookie.put('authUrl', this.settings.authUrl);
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
