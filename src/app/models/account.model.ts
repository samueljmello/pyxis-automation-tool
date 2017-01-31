export class AccountModel {

  public token: string;
  public id: string;
  public name: string;
  public username: string;
  public image: string;

  constructor(Token: string, Id: string, Name: string, Username: string, Image: string) {
    this.token = Token;
    this.id = Id;
    this.name = Name;
    this.username = Username;
    this.image = Image;
  }

}