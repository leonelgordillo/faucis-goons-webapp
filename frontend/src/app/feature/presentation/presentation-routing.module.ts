import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartsComponent } from './components/charts/charts.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { HeatMapComponent } from './components/heat-map/heat-map.component';
import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
    {
        path: '' , component: LandingComponent
    },
    {
        path: 'heat-map' , component: HeatMapComponent
    },
    {
        path: 'charts', component: ChartsComponent
    },
    {
        path: 'data-table', component: DataTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PresentationRoutingModule { }
