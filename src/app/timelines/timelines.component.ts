import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { OfmService } from '../ofm.service';

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.scss']
})
export class TimelinesComponent implements OnInit {

infoData;
events;

timelines;

  constructor(
    private ofm: OfmService,
    private ht: HttpClient
  ) { }

  disabled() {
    alert('Login disabled. User accounts and private maps will come soon');
  }

  ngOnInit(): void {
    this.ht.get('assets/info.json').subscribe(data => {
      this.infoData = data;
    })
    this.ofm.getTimelines().subscribe((data:any) => {
      this.timelines = data;
    })
  }

}
