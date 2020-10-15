import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-prediction-graph',
  templateUrl: './prediction-graph.component.html',
  styleUrls: ['./prediction-graph.component.scss']
})
export class PredictionGraphComponent implements OnInit {

  categories = [
    { value: "food-services", viewValue: "Food Services" },
    { value: "automotive", viewValue: "Automotive" },
    { value: "clothing", viewValue: "Clothing" }

  ]

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', lineTension:0 },
    { data: [54, 23, 56, 78, 82, 43, 90], label: 'Series B', lineTension:0 },
    { data: [54, 21, 89, 15, 54, 66, 37], label: 'Series C', lineTension:0 },


  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions = {
    responsive: true,
    legend: {
      display: false
    },

  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'darkseagreen',
      // backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'maroon',
      // backgroundColor: 'darkseagreen',
    },
    {
      borderColor: 'orange',
      // backgroundColor: 'white',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];


  constructor() { }

  ngOnInit(): void {
  }

}
