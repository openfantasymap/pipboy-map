import { Component, OnInit } from '@angular/core';

import { MnDockerService } from '@modalnodes/mn-docker';
import { HttpClient } from '@angular/common/http';

import env from '../assets/env.json';
import { CbrpnkService } from './cbrpnk.service';

declare const mapboxgl;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  scanlines = true;

  constructor(
    private cbrpnk: CbrpnkService
  ) {}

  ngOnInit() {
    this.cbrpnk.scanlines.subscribe(value=>{
      this.scanlines = value;
    })
  }
}
