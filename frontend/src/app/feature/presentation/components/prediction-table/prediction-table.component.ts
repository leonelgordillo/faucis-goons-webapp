import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { DataService } from '../../services/data.service';
import demographicData from '../../data/demographic_tx_counties_condensed.json';

@Component({
  selector: 'app-prediction-table',
  templateUrl: './prediction-table.component.html',
  styleUrls: ['./prediction-table.component.scss']
})
export class PredictionTableComponent implements OnInit {

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective; // Now you can reference your chart via `this.chart`


  county;
  femaleData = [];
  maleData = [];


  public lineChartData: ChartDataSets[] = [
    { data: this.maleData, label: 'Male' },
    { data: this.femaleData, label: 'Female' },

  ];

  public lineChartLabels: Label[] = ['<5', '5-13', '14-17', '18-24', '24-34', '35-44', '45-54', '55-64', '65+'];
  public lineChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        stacked: true,
        id: 'Population',
        type: 'linear',
        position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'Population'
        },
        // ticks: {
        //   min: 100,
        //   max: 20000
        // }
      }],
      xAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Age'
        },
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: '#1D4C81',
    },
    {
      backgroundColor: 'orange',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'bar';
  public lineChartPlugins = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    this.dataService.currentCounty.subscribe((county) => {
      this.county = county
      this.updateChart();
    })
  }

  updateChart(): void {
    let filteredData = demographicData.filter((obj) => {
      return obj.CTYNAME == this.county
    })

    this.femaleData = [];
    this.maleData = [];

    this.maleData.push(filteredData[0].UNDER5_MALE)
    this.maleData.push(filteredData[0].AGE513_MALE)
    this.maleData.push(filteredData[0].AGE1417_MALE)
    this.maleData.push(filteredData[0].AGE1824_MALE)
    this.maleData.push(filteredData[0].AGE2534_MALE)
    this.maleData.push(filteredData[0].AGE3544_MALE)
    this.maleData.push(filteredData[0].AGE4554_MALE)
    this.maleData.push(filteredData[0].AGE5564_MALE)
    this.maleData.push(filteredData[0].AGE5564_MALE)
    this.maleData.push(filteredData[0].AGE65PLUS_MALE)

    this.femaleData.push(filteredData[0].UNDER5_FEM)
    this.femaleData.push(filteredData[0].AGE513_FEM)
    this.femaleData.push(filteredData[0].AGE1417_FEM)
    this.femaleData.push(filteredData[0].AGE1824_FEM)
    this.femaleData.push(filteredData[0].AGE2534_FEM)
    this.femaleData.push(filteredData[0].AGE3544_FEM)
    this.femaleData.push(filteredData[0].AGE4554_FEM)
    this.femaleData.push(filteredData[0].AGE5564_FEM)
    this.femaleData.push(filteredData[0].AGE5564_FEM)
    this.femaleData.push(filteredData[0].AGE65PLUS_FEM)

    this.lineChartData[0].data = this.maleData;
    this.lineChartData[1].data = this.femaleData;

    // this.chart.chart.update();
  }
}
