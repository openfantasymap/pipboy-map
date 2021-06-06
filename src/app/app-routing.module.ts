import { MapComponent } from './map/map.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimelinesComponent } from './timelines/timelines.component';


const routes: Routes = [
  { path: '', component: TimelinesComponent},
  { path: ':timeline', redirectTo: ':timeline/866/4/43.67/1.57', pathMatch: 'full' },
  { path: ':timeline/:year/:z/:y/:x', component: MapComponent },
  { path: ':timeline/:year/:z/:y/:x/:rels', component: MapComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
