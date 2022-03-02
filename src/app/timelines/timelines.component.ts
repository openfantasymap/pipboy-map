import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
    private ht: HttpClient
  ) { }

  ngOnInit(): void {
    this.ht.get('/assets/timelines.json').subscribe((data:any) => {
      this.timelines = data;
    })
  }

}
