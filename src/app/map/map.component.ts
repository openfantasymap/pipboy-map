import { DecimaldatePipe } from './../decimaldate.pipe';
import { Component, OnInit, Input, isDevMode } from '@angular/core';

import { MnDockerService } from '@modalnodes/mn-docker';
import { HttpClient } from '@angular/common/http';

import env from '../../assets/env.json';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NicedatePipe } from '../nicedate.pipe';

declare const mapboxgl;
declare const vis;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map;
  ts;

  layers;

  @Input() style;

  start = {
    center: [1.57, 43.67],
    zoom: 4
  };


  atDate = 866.001;
  atMacroDate = 800;
  atMicroDate = 870;

  timeline;

  constructor(
    private ds: MnDockerService,
    private ar: ActivatedRoute,
    private l: Location
  ) { }

  ngOnInit(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWJyaWNrbyIsImEiOiJjanRkajJ4dzYwZGcwNDNvOGQybnZ2aWU0In0.dHeKsAVs3BmZ0biKTOi7wg';
    this.ts = this.ds.getEnv('TILESERVER');
    this.ar.params.subscribe(params => {
      this.atDate = params.year;
      this.start.center = [params.x, params.y];
      this.start.zoom = params.z;
      if (this.map) {
        this.map.panTo(this.start.center);
      }
    });

    this.atDate = this.ar.snapshot.params.year;
    this.start.center = [this.ar.snapshot.params.x, this.ar.snapshot.params.y];
    this.start.zoom = this.ar.snapshot.params.z;

    this.style = this.style;

    this.map = new mapboxgl.Map({
      container: 'ohm_map',
      style: this.style, // stylesheet location
      center: this.start.center, // starting position [lng, lat]
      zoom: this.start.zoom, // starting zoom
      transformRequest: (url, resourceType) => {
        let nurl = url;
        if (isDevMode()) {
          nurl = nurl.replace('https://tiles.openhistorymap.org', this.ts);
        }
        if (resourceType === 'Tile' && url.indexOf('openhistory') >= 0) {
          return {
            url: nurl.replace('{atDate}', this.atDate.toString())
          };
        }
      }

    });

    this.map.on('moveend', () => {
      this.changeUrl();
    });

    const container = document.getElementById('visualization');

    const items = new vis.DataSet([
      { id: 1, content: 'Rome', start: new Date(-753, 4, 21), end: new Date(476, 1, 1), className: 'politics-rome'}
    ]);

      // Create a Timeline
    this.timeline = new vis.Timeline(container, items, {
      showCurrentTime: false
    });

    this.timeline.addCustomTime(this.toFloatDate(this.atDate), 'atTime');

    this.timeline.on('click', (properties) => {
      this.atDate = this.toDateFloat(properties.time);
      this.timeline.setCustomTime(this.toFloatDate(this.atDate), 'atTime');
      this.changeUrl();
    });

    this.timeline.on('rangechanged', (properties) => {
    });
  }

  changeUrl(ev = null): void{
    const c = this.map.getCenter();
    this.l.go(`/${this.atDate}/${this.map.getZoom()}/${c.lat}/${c.lng}`);
    if (ev) {
      this.map.getSource('ohm').setSourceProperty(() => {});
    }
  }

  changeStyle(style): void  {
    this.style = style;
    this.map.setStyle(style);
  }

  toDateFloat(date: Date): number{
    let ret = date.getFullYear();
    ret += (date.getMonth() + 1) / 12;
    ret += (date.getDate()) * (1 / 12 / 30);
    ret += (date.getHours()) * (1 / 12 / 30 / 24);
    ret += (date.getMinutes()) * (1 / 12 / 30 / 24 / 60);
    ret += (date.getSeconds()) * (1 / 12 / 30 / 24 / 60 / 60);
    return ret;
  }

  toFloatDate(date: number): Date{
    const dd = new DecimaldatePipe();
    return dd.transform(date);
  }
}
