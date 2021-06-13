import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OhmService {

  constructor(
    protected http: HttpClient
  ) { }

  getEvents(date, amount = 20): Observable<any> {
    return this.http.get('http://51.15.160.236:9034/events/' + date + '?limit=' + amount);
  }
s
}
