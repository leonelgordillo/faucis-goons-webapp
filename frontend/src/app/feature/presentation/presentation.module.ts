import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PresentationRoutingModule } from './presentation-routing.module';
import { HeatMapComponent } from './components/heat-map/heat-map.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ChartsComponent } from './components/charts/charts.component';
import { CountiesMapComponent } from './components/counties-map/counties-map.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UsBubbleMapComponent } from './components/us-bubble-map/us-bubble-map.component';



@NgModule({
  declarations: [
    HeatMapComponent,
    DataTableComponent,
    LandingComponent,
    NavBarComponent,
    ChartsComponent,
    CountiesMapComponent,
    UsBubbleMapComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PresentationRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  exports: [
    HeatMapComponent,
    DataTableComponent,
    LandingComponent,
    NavBarComponent,
    ChartsComponent,
    CountiesMapComponent,
    UsBubbleMapComponent
  ]
})
export class PresentationModule { }
