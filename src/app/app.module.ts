import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared.module';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { StyleSelectorComponent } from './style-selector/style-selector.component';
import { DecimaldatePipe } from './decimaldate.pipe';
import { NicedatePipe } from './nicedate.pipe';
import { DateComponent } from './date/date.component';
import { TimelinesComponent } from './timelines/timelines.component';
import { ShareDirective } from './share.directive';
import { EnvService } from './env.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StyleSelectorComponent,
    DecimaldatePipe,
    NicedatePipe,
    DateComponent,
    TimelinesComponent,
    ShareDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => inject(EnvService).load()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
