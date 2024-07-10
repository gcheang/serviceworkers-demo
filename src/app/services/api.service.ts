import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ApiService {
  private url = 'api';

  hasConnection = new BehaviorSubject<boolean>(true);
  hasConnection$: Observable<boolean> = this.hasConnection.asObservable();

  updateHasConnection(bool: boolean) {
    this.hasConnection.next(bool);
  }

  constructor(private http: HttpClient) {}

  ping(): Observable<any> {
    if (this.hasConnection.getValue()) {
      return this.http.get(`${this.url}/ping`);
    } else {
      return this.http.get(`${this.url}/does-not-exist`);
    }
  }

  getHeroes(): Observable<any> {
    if (this.hasConnection.getValue()) {
      return this.http.get(`${this.url}/data`);
    } else {
      return this.http.get(`${this.url}/does-not-exist`);
    }
  }
}
