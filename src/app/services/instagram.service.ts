import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { Jsonp } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class InstagramService {

  private url: string;
  private token: string;

  constructor(
    private http: Http,
    private jsonp: Jsonp
  ) {}

  public setup(url: string, token: string) {
    if (url.substr(-1) !== '/') {
      url += '/';
    }
    this.url = url;
    this.token = token;
  }

  private get(endpoint: string, params: string = ''): Observable<any> {
    let headers = this.headers();
    let token = encodeURIComponent(this.token);
    let url = this.url + this.trim(endpoint);
    if (params !== '') {
      params += '&';
    }
    return this.jsonp.get(`${url}?${params}access_token=${token}&callback=JSONP_CALLBACK`, { headers: this.headers() })
      .map(this.extractData)
      .catch(this.handleError);
  };

  private post(endpoint: string, data: any): Observable<any> {
    let headers = this.headers();
    headers.append('Authorization', this.token);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + this.trim(endpoint), JSON.stringify(data), { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  };

  private headers(): Headers {
    let headers = new Headers();
    return headers;
  }

  private trim(endpoint: string) {
    if (endpoint.substr(0,1) === '/') {
      endpoint = endpoint.substr(1);
    }
    return endpoint.trim();
  }

  private extractData(res: any) {
    if (res !== undefined && res._body !== undefined) {
      return res._body;
    }
    return res;
  };

  private handleError(err: any) {
    console.log(err);
    return Observable.throw([]);
  };
  
  /**
  * 
  * API CALLS
  *
  */

  public getSelf(): Observable<any> {
    return this.get('users/self')
      .map(this.extractData)
      .catch(this.handleError);
  };

  public getSearch(user: string): Observable<any> {
    return this.get('users/search', `q=${user}`)
      .map(this.extractData)
      .catch(this.handleError);
  };
}
