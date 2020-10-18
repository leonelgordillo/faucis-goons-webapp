import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import retailData from '../../data/retail-sales-data.json';
import mobilityData from '../../data/apple-mobility-monthly.json';


@Component({
  selector: 'app-retail-sales-graph',
  templateUrl: './retail-sales-graph.component.html',
  styleUrls: ['./retail-sales-graph.component.scss']
})
export class RetailSalesGraph implements OnInit {




  retailSectors = []
  selectedSector;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Walking', yAxisID: "Mobility", lineTension: 0 },
    { data: [], label: 'Driving', yAxisID: "Mobility", lineTension: 0 },
    { data: [], label: 'Transit', yAxisID: "Mobility", lineTension: 0 },
    { data: [], label: 'Sector', lineTension: 0, borderDash: [5,5] },



  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        id: 'RetailSales',
        type: 'linear',
        position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'Retail Sales'
        }
      }, {
        id: 'Mobility',
        type: 'linear',
        position: 'right',
        scaleLabel: {
          display: true,
          labelString: 'Relative Mobility'
        }
      }]
    }

  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'orange',
      // backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'maroon',
      // backgroundColor: 'darkseagreen',
    },
    {
      borderColor: '#1D4C81',
      // backgroundColor: 'white',
    },
    {
      borderColor: 'black',
      // backgroundColor: 'white',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];


  constructor() { }

  ngOnInit(): void {

    let filteredArr = retailData.filter((obj) => {
      return obj.month == 'Jan'
    })
    let sectors = filteredArr.map((obj) => {
      return obj.business_sector;
    })
    this.retailSectors = sectors;

    let walkingData = mobilityData.filter((obj) => {
      return obj.transportation_type == "walking";
    })
    let drivingData = mobilityData.filter((obj) => {
      return obj.transportation_type == "driving";
    })
    let transitData = mobilityData.filter((obj) => {
      return obj.transportation_type == "transit";
    })

    this.lineChartData[0].data = walkingData.map((obj) => {
      return Number.parseInt(obj.relative_mobility_mean);
    })
    this.lineChartData[1].data = drivingData.map((obj) => {
      return Number.parseInt(obj.relative_mobility_mean);
    })
    this.lineChartData[2].data = transitData.map((obj) => {
      return Number.parseInt(obj.relative_mobility_mean);
    })

    this.lineChartData[3].data = retailData.filter((obj) => {
      return obj.business_sector == this.selectedSector;
    })
    .map((obj) => {
      return Number.parseInt(obj.sales);
    })
  }

  updateSectorData(): void {
    this.lineChartData[3].data = retailData.filter((obj) => {
      return obj.business_sector == this.selectedSector;
    })
    .map((obj) => {
      return Number.parseInt(obj.sales);
    })
  }

}
