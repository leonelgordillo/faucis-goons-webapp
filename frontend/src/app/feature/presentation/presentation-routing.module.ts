import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { EconomicMobilityComponent } from './components/economic-mobility/economic-mobility.component';
import { HeatMapComponent } from './components/heat-map/heat-map.component';
import { LandingComponent } from './components/landing/landing.component';
import { PredictionDataComponent } from './components/prediction-data/prediction-data.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';

const routes: Routes = [
    {
        path: '', component: LandingComponent
    },
    {
        path: 'heat-map', component: HeatMapComponent
    },
    {
        path: 'economic-mobility', component: EconomicMobilityComponent
    },
    {
        path: 'prediction', component: PredictionDataComponent
    },
    {
        path: 'project-details', component: ProjectDetailsComponent
    },
    {
        path: 'about-us', component: AboutUsComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PresentationRoutingModule { }
