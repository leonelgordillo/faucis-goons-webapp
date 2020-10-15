import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PresentationRoutingModule } from './presentation-routing.module';
import { HeatMapComponent } from './components/heat-map/heat-map.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { LandingComponent } from './components/landing/landing.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LineGraphComponent } from './components/line-graph/line-graph.component';
import { CountiesMapComponent } from './components/counties-map/counties-map.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartsModule } from 'ng2-charts';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UsBubbleMapComponent } from './components/us-bubble-map/us-bubble-map.component';
import { PredictionDataComponent } from './components/prediction-data/prediction-data.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { EconomicMobilityComponent } from './components/economic-mobility/economic-mobility.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PredictionGraphComponent } from './components/prediction-graph/prediction-graph.component';
import { PredictionTableComponent } from './components/prediction-table/prediction-table.component';



@NgModule({
  declarations: [
    HeatMapComponent,
    DataTableComponent,
    LandingComponent,
    NavBarComponent,
    LineGraphComponent,
    CountiesMapComponent,
    UsBubbleMapComponent,
    PredictionDataComponent,
    ProjectDetailsComponent,
    EconomicMobilityComponent,
    AboutUsComponent,
    PredictionGraphComponent,
    PredictionTableComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PresentationRoutingModule,
    MatSidenavModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [],
  exports: [
    HeatMapComponent,
    DataTableComponent,
    LandingComponent,
    NavBarComponent,
    LineGraphComponent,
    CountiesMapComponent,
    UsBubbleMapComponent,
    PredictionGraphComponent,
    PredictionTableComponent,
  ]
})
export class PresentationModule { }
