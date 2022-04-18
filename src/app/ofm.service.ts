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

  getTimelines(){
    return this.http.get('//static.fantasymaps.org/timelines.json');
  }

  getEvents(name: string, date: any, amount?: number): Observable<any> {
    return this.http.get('//static.fantasymaps.org/'+name+'/events.json?around='+date+"&n="+amount)
  }
  s: any;

  getMap(name: string){
    return this.http.get('//static.fantasymaps.org/'+name+'/map.json');
  }
}
