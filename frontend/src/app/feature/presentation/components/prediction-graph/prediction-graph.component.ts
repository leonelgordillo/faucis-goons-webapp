import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { countyList } from '../../data/county-list';
import { DataService } from '../../services/data.service';
import { PredictionService } from '../../services/prediction.service';

@Component({
  selector: 'app-prediction-graph',
  templateUrl: './prediction-graph.component.html',
  styleUrls: ['./prediction-graph.component.scss']
})
export class PredictionGraphComponent implements OnInit {

  counties = countyList;
  public selectedCounty;
  // startMinDate = new Date(2020, 8, 27);
  // startMaxDate = new Date(2020, 9, 5);
  // endMinDate = new Date(2020, 8, 27);
  // endMaxDate = new Date(2020, 9, 5);
  startMinDate;
  startMaxDate;
  endMinDate;
  endMaxDate;
  serializedStartDate = new FormControl();
  serializedEndDate = new FormControl(); 
  displayedCounty;
  displayedRanking;

  p10: any
  p50: any
  p90: any


  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'p10', lineTension:0 },
    { data: [], label: 'p50', lineTension:0 },
    { data: [], label: 'p90', lineTension:0 },


  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions = {
    responsive: true,
    legend: {
      display: true
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Relative Mobility"
        }
      }]
    }

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


  constructor(private predictionService: PredictionService,
              private dataService: DataService) { }

  ngOnInit(): void {

    this.predictionService.getDataEndDate().subscribe((res) => {

      let date = res.dataEndDate.replace('Z', '')
      let tempDate = new Date(date);
      let tempStartMinDate = new Date(tempDate.getTime() + (1*24*3600000));
      let tempStartMaxDate = new Date(tempStartMinDate.getTime() + (12*24*3600000))
      let tempEndMinDate = new Date(tempStartMinDate.getTime() + (1*24*3600000))
      let tempEndMaxDate = new Date(tempStartMaxDate.getTime() + (1*24*3600000))


      this.startMinDate = tempStartMinDate;
      this.startMaxDate = tempStartMaxDate;
      this.endMinDate = tempEndMinDate;
      this.endMaxDate = tempEndMaxDate;
    })
  }

  updateEndMin(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      let date = event.value.getTime();
      this.endMinDate.setTime(date + (1*24*3600000));
    }
    return;

  }

  updateStartMax(event: MatDatepickerInputEvent<Date>): void {

    if (event.value) {
      let date = event.value.getTime();
      this.startMaxDate.setTime(date - (1*24*3600000)) 
    }
    return;
  }

  queryForecaster(): void {

    if (this.serializedEndDate && this.serializedStartDate && this.selectedCounty) {
      if (this.serializedStartDate.valid && this.serializedEndDate.valid){


        this.predictionService.getCountyMobilityPrediction(this.selectedCounty, this.serializedStartDate.value, this.serializedEndDate.value)
          .subscribe((data) => {

            let predictions = data.forecast.Predictions

            this.displayedCounty = this.selectedCounty + ", TX"
            this.displayedRanking = `- ${data.avgMobility.ranking}th Highest`

            this.dataService.changeCounty(this.selectedCounty);

            this.p10 = predictions.p10
            this.p50 = predictions.p50
            this.p90 = predictions.p90

            this.lineChartData[0].data = this.p10.map((v) => v.Value);
            this.lineChartData[1].data = this.p50.map((v) => v.Value);
            this.lineChartData[2].data = this.p90.map((v) => v.Value);

            let options = { weekday: 'short', month: 'short', day: 'numeric' };


            this.lineChartLabels = this.p10.map((v) => {
              let newDate = new Date(v.Timestamp)
              let formattedDate = newDate.toLocaleDateString("en-US", options) 
              return formattedDate;
            });
          })

      } else {
        console.log("ERROR");
      }
    }
    return;

    
  }

}
