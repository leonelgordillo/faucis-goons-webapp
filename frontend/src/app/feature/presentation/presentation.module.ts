import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PresentationRoutingModule } from './presentation-routing.module';
import { HeatMapComponent } from './components/heat-map/heat-map.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ChartsComponent } from './components/charts/charts.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    HeatMapComponent,
    DataTableComponent,
    LandingComponent,
    NavBarComponent,
    ChartsComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PresentationRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [
    HeatMapComponent,
    DataTableComponent,
    LandingComponent,
    NavBarComponent,
    ChartsComponent,
  ]
})
export class PresentationModule { }
