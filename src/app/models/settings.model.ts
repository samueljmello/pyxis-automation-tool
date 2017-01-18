import { AccountModel } from '../models/account.model';

export class SettingsModel {
  public fromAccounts: Array<string> = new Array();
  public apiKey: string = '';
  public apiUrl: string = 'https://api.instagram.com/oauth/authorize/';
  public toAccounts: Array<string> = new Array();
  public invalid: boolean = false;
  public constructor(
      APIKey: string = '',
      FromAccounts: Array<string> = new Array(),
      ToAccounts: Array<string> = new Array()
    ) {
    this.apiKey = APIKey;
    this.fromAccounts = FromAccounts;
    this.toAccounts = ToAccounts;
  }
}