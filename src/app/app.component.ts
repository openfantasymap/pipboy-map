import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CbrpnkService } from './cbrpnk.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private cbrpnk = inject(CbrpnkService);
  private router = inject(Router);

  scanlines = true;
  isHome = true;

  ngOnInit() {
    this.cbrpnk.scanlines.subscribe(value => {
      this.scanlines = value;
    });
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.isHome = e.urlAfterRedirects === '/';
      });
  }
}
