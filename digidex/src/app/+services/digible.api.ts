import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DigibleApi {

  readonly URL = environment.digibleApiUrl;

  constructor(private readonly _http: HttpClient) { }

  public getDigibles(): Observable<any> {
    return this._http.get(this.URL + "collections");
  }

  public getCollectors(): Observable<any> {
    return this._http.get(this.URL + "collectors");
  }
}
