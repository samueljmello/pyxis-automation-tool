import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { CookieService } from 'angular2-cookie/core';
import { HttpService } from '../services/http.service';

import { AccountModel } from '../models/account.model';
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
    if (this.cookie.get('apiUrl')) {
      this.settings.apiUrl = this.cookie.get('apiUrl');
    }

    this.route.queryParams.subscribe((data) => {
      if (!this.settings.apiKey && data !== undefined && data['code'] !== undefined) {
        this.settings.apiKey = data['code'];
        this.cookie.put('apiKey', data['code']);
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
    if (this.settings.apiKey) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.configuration = false;
      this.redirecting = true;
    }, 1000);
  }

  private processRedirect(task: number) {
    switch(task) {
      default:
      case 1:
        const cId = process.env.PYXIS_INSTAGRAM_CLIENT_ID;
        const rUrl = encodeURI(process.env.PYXIS_INSTAGRAM_REDIRECT_URL);
        window.location.href = this.settings.apiUrl + `?client_id=${cId}&redirect_uri=${rUrl}&response_type=code`;
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
    } else {
      this.configuration = !this.configuration;
    }
  }

  private refreshFeed() {

  }

  private saveSettings() {
    this.setConfigurationDefaults();
    if (this.isSettingsValid()) {
      console.log('saving settings');
      this.cookie.put('apiUrl', this.settings.apiUrl);
      this.cookie.put('apiKey', this.settings.apiKey);
      this.cookie.put('fromAccounts', JSON.stringify(this.settings.fromAccounts));
      this.cookie.put('toAccounts', JSON.stringify(this.settings.toAccounts));
      this.toggleConfiguration(false);
      this.settings.invalid = false;
      this.loading = false;
    } else {
      this.toggleConfiguration(true);
      this.settings.invalid = true;
      this.loading = false;
    }
  }

  private isSettingsValid() {
    if (this.settings.apiUrl 
      && this.settings.apiKey 
      && this.isArrayValid(this.settings.fromAccounts) 
      && this.isArrayValid(this.settings.toAccounts)) {
      return true;
    }
    return false;
  }

  private isArrayValid(array: Array<string>) {
    console.log(array);
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