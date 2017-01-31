import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';

import { InstagramService } from '../services/instagram.service';
import { StateService } from '../services/state.service';

import { SettingsModel } from '../models/settings.model';

@Component({
  selector: 'configure-component',
  templateUrl: 'configure.component.html'
})
export class ConfigureComponent implements OnInit {

  private settings: SettingsModel = new SettingsModel();

  constructor(
    private cookie: CookieService,
    private instagram: InstagramService,
    private router: Router,
    private state: StateService
  ) {}

  public ngOnInit() {
    this.settings = this.state.settings;
    this.state.loading = false;
  }

  private save() {
    this.state.loading = true;
    this.state.save(this.settings);
    this.instagram.setup(this.settings.apiUrl);
    if (this.settings.valid()) {
      this.state.error = false;
      this.state.goTo('process');
    } else {
      this.state.error = true;
      this.state.errorMessage = this.settings.errorDetails();
      this.state.loading = false;
    }
  }

  private trackByIndex(index: number, value: number) {
    return index;
  }

  private authorize() {
    let logout = window.open(
      'https://www.instagram.com/accounts/logout',
      'logout',
      this.createWindowProperties()
    );
    self.focus();
    setTimeout(() => {
      logout.close();
      window.location.href = this.authorizationUrl();
    }, 2000);
  }

  private addAccount(what: string) {
    this.cookie.put('authArray', what);
    this.authorize();
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

  private authorizationUrl(): string {
    const clientId = this.state.clientId;
    const redirectUrl = encodeURI(this.settings.redirectUrl);
    let authUrl = this.settings.authUrl;
    authUrl += `?client_id=${clientId}`;
    authUrl += `&redirect_uri=${redirectUrl}`;
    authUrl += `&response_type=token`;
    authUrl += `&scope=public_content`;
    return authUrl;
  }

  private createWindowProperties(): string {
    const x = Math.round(window.screen.availWidth / 2);
    const y = Math.round(window.screen.availHeight / 2);
    const props = [
      'titlebar',
      'menubar',
      'status',
      'toolbar',
      'resizable',
      'menubar',
      'location',
    ]
    let propString = `width=100,height=100,left=${x},top=${y}`;
    for (let i = 0; i < props.length; i++) {
      propString += `,${props[i]}=no`;
    }
    return propString;
  }
}