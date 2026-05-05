import { Component, OnInit, inject } from '@angular/core';
import { CbrpnkService } from './cbrpnk.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private cbrpnk = inject(CbrpnkService);

  scanlines = true;

  ngOnInit() {
    this.cbrpnk.scanlines.subscribe(value => {
      this.scanlines = value;
    });
  }
}
