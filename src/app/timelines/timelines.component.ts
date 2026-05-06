import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, NgZone, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OfmService } from '../ofm.service';

interface TimelineRow {
  url: string;
  name: string;
  date: number | string;
  base: { zoom: number; lat: number; lng: number };
  bgimg?: string;
  color?: string;
  bg?: string;
}

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.scss'],
  standalone: false,
})
export class TimelinesComponent implements OnInit {
  private ofm = inject(OfmService);
  private ht = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  infoData: { info?: string } | null = null;
  timelines: TimelineRow[] | null = null;
  fetchError: string | null = null;

  hovered: TimelineRow | null = null;
  tuning: TimelineRow | null = null;
  buildStamp = '0021.05';

  ngOnInit(): void {
    this.ht.get<{ info?: string }>('assets/info.json').subscribe(data => {
      this.infoData = data;
    });
    this.ofm.getTimelines().subscribe({
      next: (data: any) => {
        // belt-and-braces: re-enter the zone and force CD. Some upstream
        // observable in OfmService is escaping the zone (likely the chained
        // concatMap over /assets/env.json + cross-origin XHR), and without
        // this wrapper the view never re-renders even though the property
        // is set.
        this.zone.run(() => {
          if (Array.isArray(data)) {
            this.timelines = data.filter(
              (t: any) => t && t.url && t.base && typeof t.base.zoom !== 'undefined'
            );
          } else {
            this.timelines = [];
            this.fetchError = 'Upstream returned non-array payload';
          }
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        this.zone.run(() => {
          this.timelines = [];
          this.fetchError =
            err?.status
              ? `HTTP ${err.status} :: ${err.statusText || 'fetch failed'}`
              : err?.message || 'fetch failed';
          this.cdr.detectChanges();
        });
        console.error('[timelines] getTimelines failed:', err);
      },
    });
  }

  pad(n: number, width = 3): string {
    const s = String(n);
    return s.length >= width ? s : '0'.repeat(width - s.length) + s;
  }

  signalBars(i: number): string {
    const bars = ['████', '███▒', '███░', '██▒░', '██░░', '█▒░░'];
    return bars[i % bars.length];
  }

  rowStatus(i: number): string {
    const s = ['STAB', 'STAB', 'STAB', 'EXP.', 'STAB', 'LIM.', 'STAB', 'STAB'];
    return s[i % s.length];
  }

  yearStamp(date: number | string | undefined): string {
    if (date === undefined || date === null) return '——————';
    const n = typeof date === 'number' ? date : parseFloat(date);
    if (Number.isNaN(n)) return String(date).toUpperCase();
    const sign = n < 0 ? '−' : '';
    const y = Math.trunc(Math.abs(n));
    return `CIR. ${sign}${y}`;
  }

  hover(tl: TimelineRow | null) {
    this.hovered = tl;
  }

  tuneTo(tl: TimelineRow, ev: MouseEvent) {
    if (this.tuning) return;
    ev.preventDefault();
    this.tuning = tl;
    setTimeout(() => {
      this.router.navigate([
        tl.url,
        tl.date,
        tl.base.zoom,
        tl.base.lat,
        tl.base.lng,
      ]);
    }, 720);
  }
}
