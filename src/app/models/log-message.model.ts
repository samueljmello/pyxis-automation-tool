export class LogMessageModel {
  public message: string = '';
  public classes: string = '';
  public constructor(Message: string, Classes: string) {
    this.message = Message;
    this.classes = Classes;
  }
}
