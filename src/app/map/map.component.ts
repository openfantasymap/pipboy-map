import { Component, OnInit, Input, isDevMode } from '@angular/core';

import { MnDockerService } from '@modalnodes/mn-docker';
import { HttpClient } from '@angular/common/http';

import env from '../../assets/env.json';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

declare const mapboxgl;

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


  atDate = 866;
  atMacroDate = 800;
  atMicroDate = 870;

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

    console.log(this.start);

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
  }

  changeUrl(ev = null): void{
    const c = this.map.getCenter();
    console.log(c);
    this.l.go(`/${this.atDate}/${this.map.getZoom()}/${c.lat}/${c.lng}`);
    if (ev) {
      this.map.getSource('ohm').setSourceProperty(() => {});
    }
  }

  changeStyle(style): void  {
    this.style = style;
    console.log(style);
    this.map.setStyle(style);
  }
}
