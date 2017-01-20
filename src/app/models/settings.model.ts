export class SettingsModel {
  public fromAccounts: Array<string> = new Array();
  public apiKey: string = '';
  public apiUser: any;
  public apiUrl: string = 'https://api.instagram.com/v1/';
  public authUrl: string = 'https://api.instagram.com/oauth/authorize/';
  public tokenUrl: string = 'http://localhost:3000/api.php';
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