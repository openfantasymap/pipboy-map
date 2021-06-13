import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OhmService } from './ohm.service';

@Injectable({
  providedIn: 'root'
})
export class OfmService extends OhmService{

  constructor(
    http: HttpClient
  ) { 
    super(http);
  }

  getEvents(date: any, amount?: number): Observable<any> {
    return this.http.get('//static.fantasymaps.org/'+name+'/events.json')
  }
  s: any;

  getMap(name){
    return this.http.get('//static.fantasymaps.org/'+name+'/map.json');
  }
}
