import { AccountModel } from './account.model';

export class SettingsModel {

  public apiUrl: string = 'https://api.instagram.com/v1/';
  public authUrl: string = 'https://api.instagram.com/oauth/authorize/';
  public redirectUrl: string = window.location.origin + '/authorize';
  public clientId: string = '';

  public fromAccounts: Array<AccountModel> = new Array();
  public toAccounts: Array<AccountModel> = new Array();

  public constructor(
      FromAccounts: Array<AccountModel> = new Array(),
      ToAccounts: Array<AccountModel> = new Array()
    ) {
    this.fromAccounts = FromAccounts;
    this.toAccounts = ToAccounts;
  }
  
  public valid() {
    if (this.apiUrl
      && this.authUrl
      && this.redirectUrl
      && this.clientId
      && this.isArrayValid(this.fromAccounts)
      && this.isArrayValid(this.toAccounts)) {
      return true;
    }
    return false;
  }

  public errorDetails(): string {
    let message = '';
    if (!this.valid()) {
      message = '<p>The following fields are in error:</p>';
      message += '<ul>';
      if (!this.apiUrl) {
        message += '<li>Instagram API URL</li>';
      }
      if (!this.authUrl) {
        message += '<li>Authorization Authentication Endpoint</li>';
      }
      if (!this.clientId) {
        message += '<li>Client ID</li>';
      }
      if (!this.isArrayValid(this.fromAccounts)) {
        message += '<li>From Accounts</li>';
      }
      if (!this.isArrayValid(this.toAccounts)) {
        message += '<li>To Accounts</li>';
      }
      message += '</ul>';
    }
    return message;
  }

  public isArrayValid(array: Array<AccountModel>) {
    if (array && Array.isArray(array) && array.length > 0 && array[0].token !== '') {
      return true;
    }
    return false;
  }
}