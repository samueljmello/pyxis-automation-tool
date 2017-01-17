import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

  constructor(private http: Http) {}

  public getRss(url: string): Observable<any> {
    let headers = new Headers();
    headers.append('Accept', 'application/xml');
    return this.http.get(url, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  };

  public getMP3(url: string): Observable<any> {
    let headers = new Headers();
    headers.append('Accept', 'audio/mp3');
    return this.http.get(url, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  };

  private extractData(res: any) {
    return res;
  };

  private handleError(err: any) {
    return Observable.throw([]);
  };
}
