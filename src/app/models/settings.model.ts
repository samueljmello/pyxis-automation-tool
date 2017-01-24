export class SettingsModel {

  public fromAccounts: Array<string> = new Array();
  public apiUrl: string = 'https://api.instagram.com/v1/';
  public apiKey: string = '';
  public authUrl: string = 'https://api.instagram.com/oauth/authorize/';
  public redirectUrl: string = window.location.origin + '/authorize';
  public toAccounts: Array<string> = new Array();

  public constructor(
      APIKey: string = '',
      FromAccounts: Array<string> = new Array(),
      ToAccounts: Array<string> = new Array()
    ) {
    this.apiKey = APIKey;
    this.fromAccounts = FromAccounts;
    this.toAccounts = ToAccounts;
    if (!this.isArrayValid(this.fromAccounts)) {
      this.fromAccounts = [''];
    }
    if (!this.isArrayValid(this.toAccounts)) {
      this.toAccounts = [''];
    }
  }
  
  public valid() {
    if (this.apiUrl
      && this.apiKey
      && this.authUrl
      && this.redirectUrl
      && this.isArrayValid(this.fromAccounts)
      && this.isArrayValid(this.toAccounts)) {
      return true;
    }
    return false;
  }

  public isArrayValid(array: Array<string>) {
    if (array && Array.isArray(array) && array.length > 0 && array[0] !== '') {
      return true;
    }
    return false;
  }
}