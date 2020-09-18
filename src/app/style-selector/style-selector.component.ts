import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ohm-style-selector',
  templateUrl: './style-selector.component.html',
  styleUrls: ['./style-selector.component.scss']
})
export class StyleSelectorComponent implements OnInit {
  @Input() styleBase = 'https://raw.githubusercontent.com/openhistorymap/mapstyles/master/';

  @Output() styleChange: EventEmitter<string> = new EventEmitter<string>();

  styles: Observable<any[]>;

  selected = 'political';

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.styles = this.http.get<any[]>(this.styleBase + 'styles.json');
  }

  change(ev){
    this.styleChange.next(this.styleBase + ev.value);
  }

}
