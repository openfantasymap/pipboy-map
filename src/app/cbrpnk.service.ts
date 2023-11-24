import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CbrpnkService {
  public scanlines: EventEmitter<boolean> = new EventEmitter<boolean>();
  setScanlines(status: any) {
    this.scanlines.emit(status);
  }

  constructor() { }
}
