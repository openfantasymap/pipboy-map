import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
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

  infoData: { info?: string } | null = null;
  timelines: TimelineRow[] | null = null;

  hovered: TimelineRow | null = null;
  tuning: TimelineRow | null = null;
  buildStamp = '0021.05';

  ngOnInit(): void {
    this.ht.get<{ info?: string }>('assets/info.json').subscribe(data => {
      this.infoData = data;
    });
    this.ofm.getTimelines().subscribe((data: any) => {
      this.timelines = data;
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
        '/' + tl.url,
        tl.date,
        tl.base.zoom,
        tl.base.lat,
        tl.base.lng,
      ]);
    }, 720);
  }
}
