import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { HttpService } from '../services/http.service';

import { SettingsModel } from '../models/settings.model';
import { LogMessageModel } from '../models/log-message.model';

@Component({
  selector: 'process-component',
  templateUrl: 'process.component.html'
})
export class ProcessComponent {

  private loading: boolean = false;
  private configuration: boolean = false;
  private processing: boolean = false;
  private redirecting: boolean = false;
  private error: boolean = false;
  private errorMessage: string = '';
  private code: string = '';

  private settings: SettingsModel = new SettingsModel();

  private toDoMessages: Array<any> = new Array();
  private processLog: Array<LogMessageModel> = new Array();
  private processColor: string = 'primary';
  private processProgress: number = 0;

  constructor(private http: HttpService, private cookie: CookieService, private route: ActivatedRoute, public dialog: MdDialog) {
    this.loading = true;
    setTimeout(() => {
      this.restoreSettings();
    }, 750);
  }

  private restoreSettings() {
    this.settings = new SettingsModel(
      this.cookie.get('apiKey'),
      this.getCookieAndParse('fromAccounts'),
      this.getCookieAndParse('toAccounts')
    );
    if (!this.isArrayValid(this.settings.fromAccounts)) {
      this.settings.fromAccounts = [''];
    }
    if (!this.isArrayValid(this.settings.toAccounts)) {
      this.settings.toAccounts = [''];
    }
    if (this.cookie.get('authUrl')) {
      this.settings.authUrl = this.cookie.get('authUrl');
    }
    if (this.cookie.get('apiUrl')) {
      this.settings.apiUrl = this.cookie.get('apiUrl');
    }
    if (this.cookie.get('tokenUrl')) {
      this.settings.tokenUrl = this.cookie.get('tokenUrl');
    }
    this.route.queryParams.subscribe((data) => {
      if (!this.settings.apiKey && data !== undefined && data['code'] !== undefined) {
        this.code = data['code'];
        this.processRedirect(2);
        // this.settings.apiKey = data['code'];
        // this.cookie.put('apiKey', data['code']);
      } else if (!this.settings.apiKey && data !== undefined && data['error'] !== undefined) {
        this.error = true;
        this.errorMessage = data['error'];
      }
      if (!this.settings.apiKey) {
        this.redirecting = true;
      } else if (!this.isArrayValid(this.settings.fromAccounts) || !this.isArrayValid(this.settings.toAccounts)) {
        this.settings.invalid = true;
        this.toggleConfiguration(true);
      }
      this.loading = false;
    });

  }

  private switchToRedirect() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.configuration = false;
      this.redirecting = true;
    }, 1000);
  }

  private processRedirect(task: number) {
    const cId = process.env.PYXIS_INSTAGRAM_CLIENT_ID;
    const rUrl = encodeURI(process.env.PYXIS_INSTAGRAM_REDIRECT_URL);
    const code = this.code;
    switch(task) {
      default:
      case 1:
        window.location.href = this.settings.authUrl + `?client_id=${cId}&redirect_uri=${rUrl}&response_type=code`;
        break;
      case 2:
        this.http.post(this.settings.tokenUrl, {
          client_id: cId,
          code: code,
          redirect_uri: rUrl
        }).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log('error');
          }
        );
        break;
      case 0:
        this.redirecting = false;
        break;
    }
  }

  private getCookieAndParse(key: string) {
    const cookie = this.cookie.get(key);
    if (cookie) {
      return JSON.parse(cookie);
    }
    return cookie;
  }

  private toggleConfiguration(which: boolean = undefined) {
    if (which !== undefined) {
      this.configuration = which;
      this.redirecting = !which;
    } else {
      this.configuration = !this.configuration;
      this.redirecting = !this.redirecting;
    }
    if (!this.configuration) {
      this.doSave();
    }
  }

  private refreshFeed() {

  }

  private saveSettings() {
    this.setConfigurationDefaults();
    this.doSave();
    if (this.isSettingsValid()) {
      this.toggleConfiguration(false);
      this.settings.invalid = false;
      this.loading = false;
    } else {
      this.toggleConfiguration(true);
      this.settings.invalid = true;
      this.loading = false;
    }
  }

  private doSave() {
    this.cookie.put('apiUrl', this.settings.apiUrl);
    this.cookie.put('authUrl', this.settings.authUrl);
    this.cookie.put('tokenUrl', this.settings.tokenUrl);
    this.cookie.put('apiKey', this.settings.apiKey);
    this.cookie.put('fromAccounts', JSON.stringify(this.settings.fromAccounts));
    this.cookie.put('toAccounts', JSON.stringify(this.settings.toAccounts));
    for (let i = 0; i < this.settings.fromAccounts.length; i++) {
      this.settings.fromAccounts[i] = this.settings.fromAccounts[i].trim();
      if (this.settings.fromAccounts[i] === '') {
        this.settings.fromAccounts.splice(i,1);
      }
    }
    for (let i = 0; i < this.settings.toAccounts.length; i++) {
      this.settings.toAccounts[i] = this.settings.toAccounts[i].trim();
      if (this.settings.toAccounts[i] === '') {
        this.settings.toAccounts.splice(i,1);
      }
    }
  }

  private isSettingsValid() {
    if (this.settings.apiUrl
      && this.settings.authUrl
      && this.settings.tokenUrl
      && this.isArrayValid(this.settings.fromAccounts) 
      && this.isArrayValid(this.settings.toAccounts)) {
      return true;
    }
    return false;
  }

  private isArrayValid(array: Array<string>) {
    if (array && Array.isArray(array) && array.length > 0 && array[0] !== '') {
      return true;
    }
    return false;
  }

  private setConfigurationDefaults() {
    this.loading = true;
  }

  private processFeed() {

  }

  private processItems() {

  }

  private processItem() {

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

  private log(message: string, classes: string = '') {
    const date = new Date();
    const dateTime = [
      date.getMonth() + 1,
      date.getDate(),
      date.getFullYear()
    ].join('/') + ' ' +
      [
        this.padLeft(date.getHours()),
        this.padLeft(date.getMinutes()),
        this.padLeft(date.getSeconds()),
      ].join(':');
    const logItem = new LogMessageModel(`[${dateTime}] ${message}`, classes);
    this.processLog.unshift(logItem);
  }

  private padLeft(val: any) {
    var len = (String(10).length - String(val).length) + 1;
    return len > 0 ? new Array(len).join('0') + val : val;
  }

}
