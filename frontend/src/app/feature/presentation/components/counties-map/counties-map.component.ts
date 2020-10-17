// import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as mobilitydata from "../../data/apple-mobility-tx-counties-with-fips-with-all.json";
import countiesdata from "../../data/counties.json";


import { Component, OnInit, ElementRef, ViewEncapsulation, Input, SimpleChanges, OnChanges, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';

import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { tap, catchError, finalize, filter, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { MatSlider } from '@angular/material/slider';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

import * as d3 from 'd3';
import * as topojson from 'topojson';



@Component({
  selector: 'app-counties-map',
  templateUrl: './counties-map.component.html',
  styleUrls: ['./counties-map.component.scss']
})
export class CountiesMapComponent implements OnInit {

  @ViewChild('slider', { static: true }) slider: MatSlider;
  @ViewChild('group') buttonToggle: MatButtonToggleGroup;

  hostElement; // Native element hosting the SVG container
  svg; // Top level SVG element
  g; // SVG Group element
  w = window;
  doc = document;
  el = this.doc.documentElement;
  body = this.doc.getElementsByTagName('body')[0];

  projection;
  path;

  width = 860;
  height = 500;

  centered;

  legendY: number = this.height - 85

  legendContainerSettings = {
    x: 0,
    y: this.legendY,
    width: 420,
    height: 75,
    roundX: 10,
    roundY: 10,
  }

  legendBoxSettings = {
    width: 50,
    height: 15,
    y: this.legendContainerSettings.y + 38
  }

  zoom;
  active;

  zoomSettings = {
    duration: 1000,
    ease: d3.easeCubicOut,
    zoomLevel: 5
  }

  formatDecimal = d3.format(',.0f');
  legendContainer;

  legendData = [0, 0.2, 0.4, 0.6, 0.8, 1];

  merged: any[] = [];
  covid: any[] = [];
  counties: any[] = [];
  c: any[] = [];
  legendLabels: any[] = [];
  scaleCircle;
  selectedState: string = "Texas"

  numBars = 6;
  start = 30;
  end;

  // May be the only scale we need? Find scale that works best with this relative mobility data
  scale = "Linear";
  type = "Filled";

  // metric = "Transit", "Driving", "Walking", "Aggregate"
  metric: string = "all";
  date;
  dateMin = "2020-01-18";
  dateMax;
  tab = "Totals"

  linearScale;
  colorScaleLinear;
  expScale;
  colorScaleExp;
  logScale;
  colorScaleLog;
  sqrtScale;
  colorScaleSqrt;

  public scaleButtons = ["Sqrrt", "Linear", "Exponential", "Logarithmic"]

  // May not be needed
  private _routerSub = Subscription.EMPTY;

  tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  Slider
  public tickPlacement: string = 'none';
  public value: number;
  public min: number;
  public max: number;
  public smallStep: number = 86400000;

  public tickArea: string = 'none'
  public sliderValue: number;
  public sliderMin: number;
  public sliderMax: number;
  public sliderStep: number = 86400000;

  // public drillDownX: number = -539.001986605247;
  // public drillDownY: number = -653.5193497376141;
  // public drillDownScale: number = 2.379577595818353;
  public drillDownScale: number = 2.079577595818353;
  public drillDownX: number = -349.001986605247;
  public drillDownY: number = -535.5193497376141;

  constructor(
    private elRef: ElementRef,
    public router: Router,
    public route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location
  ) {

    this.hostElement = this.elRef.nativeElement;
    this.location = location;

    this._routerSub = router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.route.params.subscribe(params => {
        if (this.router.url.indexOf('/') != -1) {
          this.removeExistingMapFromParent();
          // this.updateMap(true);
        }
      })
    })
  }

  ngOnInit(): void {
    this.updateMap(true);
  }

  private removeExistingMapFromParent() {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    d3.select(this.hostElement).select('svg').remove();
  }

  updateMap(performZoom) {

    this.active = d3.select(null);

    var that = this;

    this.zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", function (d) {
        that.zoomed(d, that)
      });

    this.projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([this.width / 2, this.height / 2]);

    this.path = d3.geoPath()
      .projection(this.projection);

    this.svg = d3.select(this.hostElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height + 75)
      .on("click", this.stopped, true)

    this.svg.append('rect')
      .attr('class', 'background')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', '#FFFFFF')
      .on('click', function (d) {
        //  Don't zoom out when selecting rect
        // that.reset(d, that);      })
      });

    // this.svg
    // .call(this.zoom); // delete this line to disable free zooming

    this.g = this.svg.append('g');

    // that.covid = coviddata.counties;
    that.covid = mobilitydata.counties;

    that.dateMax = d3.max(that.covid, function (d: any) {
      return d.date
    });



    // Mat Slider Values
    that.sliderMin = new Date(that.dateMin).getTime();
    var max = new Date(that.dateMax);
    max.setHours(23, 59, 59, 999);
    that.sliderMax = max.getTime();

    // default to end date
    if (!that.date) {
      that.date = that.dateMin;
      // that.slider.value = that.value
      that.sliderValue = that.sliderMin;
    }

    // Set date to max date if no data is available
    // if (that.date > that.dateMax) {
    //   that.date = that.dateMax;
    //   that.value = that.max;
    //   this.location.go('counties/' + this.selectedState + '/' + this.type + '/' + this.scale + '/' + this.metric + '/' + this.date);
    // }

    var covidMax = that.covid.filter(function (d) {
      return d.date === that.dateMax && d.state === that.selectedState;
    })

    var covid = that.covid.filter(function (d) {
      return d.state === that.selectedState
    });

    that.start = 90;

    // Get data for max date

    switch (that.metric) {
      case "walking":
        that.end = d3.max(covid, function (d: any) {
          if (d.transportation_type == "walking") {
            return d.relative_mobility
          }
        })
        break
      case "transit":
        that.end = d3.max(covid, function (d: any) {
          if (d.transportation_type == "transit") {
            return d.relative_mobility
          }
        })
        break;
      case "driving":
        that.end = d3.max(covid, function (d: any) {
          if (d.transportation_type == "driving") {
            return d.relative_mobility
          }
        })
        break;
        case "all":
          that.end = d3.max(covid, function (d: any) {
            if (d.transportation_type == "driving") {
              return d.relative_mobility
            }
          })
        break;
    }


    // Get covid mobility date for current date
    that.covid = that.covid.filter(function (d) {
      return d.date === that.date && d.state === that.selectedState && d.transportation_type === that.metric;
    });

    that.counties = topojson.feature(countiesdata, countiesdata.objects.collection).features;

    if (that.selectedState != 'All') {
      that.counties = that.counties.filter(function (d) {
        return d.properties.state === that.selectedState
      })

      if (that.drillDownX && performZoom) {
        that.svg.transition()
          .duration(750)
          .call(that.zoom.transform, d3.zoomIdentity
            .translate(that.drillDownX, that.drillDownY)
            .scale(that.drillDownScale))
      }
      else {
        that.svg.transition()
          .duration(0)
          .call(that.zoom.transform, d3.zoomIdentity
            .translate(that.drillDownX, that.drillDownY)
            .scale(that.drillDownScale))
      }
    }

    that.merged = that.join(that.covid, that.counties, "fips", "fips", function (county, covid) {

      var metric;

      switch (that.metric) {
        case "walking":
          if(covid) {
            metric = covid ? covid.relative_mobility : 0;
          }
          break;
        case "transit":
          if(covid) {
            metric = covid ? covid.relative_mobility : 0;
          }
          break;
        case "driving":
          if(covid) {
            metric = covid ? covid.relative_mobility : 0;
          }
          break;
        case "all":
          metric = covid ? covid.relative_mobility : 0;
          break;
      }

      return {
        name: county.properties.name,
        metric: metric,
        geometry: county.geometry,
        type: county.type,
        state: county.properties.state
      };
    });

    // Sort for bubble overlays
    that.merged = that.merged.sort((a, b) => a.metric > b.metric ? - 1 : (a.metric < b.metric ? 1 : 0))

    // Scale Types

    // Linear Scale
    switch (that.type) {
      case "Filled":
        that.linearScale = d3.scaleLinear()
          .domain([that.start, 175])
          .range([0, 1]);
        break;
      case "Bubble":
        that.linearScale = d3.scaleLinear()
          .domain([that.start, that.end])
          .range([0, 8]);
        break;
    }

    switch (that.metric) {
      case "all":
        that.colorScaleLinear = d3.scaleSequential(d =>
          d3.interpolateBlues(that.linearScale(d))
        );
      break;
      case "driving":
        that.colorScaleLinear = d3.scaleSequential(d =>
          d3.interpolateOranges(that.linearScale(d))
        );
      break;
      case "transit":
        that.colorScaleLinear = d3.scaleSequential(d =>
          d3.interpolateGreens(that.linearScale(d))
        );
      break;
      case "walking":
        that.colorScaleLinear = d3.scaleSequential(d =>
          d3.interpolateReds(that.linearScale(d))
        );
      break;
        
    }

    // Exponential Scale
    switch (that.type) {
      case "Filled":
        that.expScale = d3
          .scalePow()
          .exponent(Math.E)
          .domain([that.start, that.end])
          .range([0, 1]);
        break;
      case "Bubble":
        that.expScale = d3
          .scalePow()
          .exponent(Math.E)
          .domain([that.start, that.end])
          .range([0, 8]);
        break;
    }

    that.colorScaleExp = d3.scaleSequential(d =>
      d3.interpolateReds(that.expScale(d))
    );

    // Log Scale
    switch (that.type) {
      case "Filled":
        that.logScale = d3.scaleLog().domain([that.start, that.end])
          .range([0, 1]);
        break;
      case "Bubble":
        that.logScale = d3.scaleLog().domain([that.start, that.end])
          .range([0, 8]);
        break;
    }

    that.colorScaleLog = d3.scaleSequential(d =>
      d3.interpolateReds(that.logScale(d))
    );

    // Sqrt Scale
    switch (that.type) {
      case "Filled":
        that.sqrtScale = d3.scaleSqrt().domain([that.start, 200])
          .range([.1, 1]);
        break;
      case "Bubble":
        that.sqrtScale = d3.scaleSqrt().domain([that.start, that.end])
          .range([.1, 8]);
        break;
    }



    that.colorScaleSqrt = d3.scaleSequential(d =>
      d3.interpolateReds(that.sqrtScale(d))
    );

    switch (that.type) {
      case "Filled":
        that.legendLabels = [
          "<" + that.getMetrics(0),
          ">" + that.getMetrics(0),
          ">" + that.getMetrics(0.2),
          ">" + that.getMetrics(0.4),
          ">" + that.getMetrics(0.6),
          ">" + that.getMetrics(0.8)
        ];
        break;
      case "Bubble":
        that.legendLabels = [
          "<" + that.getMetrics(0 * 30),
          ">" + that.getMetrics(0 * 30),
          ">" + that.getMetrics(0.2 * 30),
          ">" + that.getMetrics(0.4 * 30),
          ">" + that.getMetrics(0.6 * 30),
          ">" + that.getMetrics(0.8 * 30)
        ];
        break;
    }

    that.g
      .attr('class', 'county')
      .selectAll('path')
      .data(that.merged)
      .enter()
      .append('path')
      .attr('d', that.path)
      .attr('class', 'county')
      .attr('stroke', 'grey')
      .attr('stroke-width', 0.3)
      // .attr('cursor', 'pointer')
      .attr("width", 600)
      .attr("height", 400)
      .attr('fill', function (d) {
        var metric = d.metric;
        var metric = metric ? metric : 0;
        if (that.type == "Filled" && metric > 0) {
          switch (that.scale) {
            case "Linear":
              return that.colorScaleLinear(metric);
            case "Exponential":
              return that.colorScaleExp(metric);
            case "Logarithmic":
              return that.colorScaleLog(metric);
            case "Sqrrt":
              return that.colorScaleLog(metric)
          }
        }
        else {
          return "#f2f2f2"
        }
      })

      .on('mouseover', function (d) {
        that.tooltip.transition()
          .duration(200)
          .style('opacity', .9);

        that.tooltip.html(d.name + `<br/><b>Relative Mobility :</b> ` + that.formatDecimal(d.metric))
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY) + 'px')
        // .style('left', (event.pageX) + 'px')
        // .style('top', (event.pageY) + 'px')

        that.changeDetectorRef.detectChanges();
      })

      .on('mouseout', function (d) {
        that.tooltip.transition()
          .duration(300)
          .style('opacity', 0);

        that.changeDetectorRef.detectChanges();
      });

    if (that.type == "Bubble") {
      that.g
        .attr("class", "bubble")
        .selectAll('circle')
        .data(that.merged)
        .enter().append("circle")
        .attr("transform", function (d) { return "translate(" + that.path.centroid(d) + ")"; })
        .attr("r", function (d) {
          switch (that.scale) {
            case "Linear":
              return that.linearScale(d.metric);
            case "Exponential":
              return that.expScale(d.metric);
            case "Logarithmic":
              return that.logScale(d.metric);
            case "Sqrrt":
              return that.sqrtScale(d.metric);
          }
        })
        .on('mouseover', function (d) {
          that.tooltip.transition()
            .duration(200)
            .style('opacity', .9);

          that.tooltip.html(d.name + '<br/><b>Total ' + this.metric + ':</b> ' + that.formatDecimal(d.metric))
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px')
          // .style('left', (event.pageX) + 'px')
          // .style('top', (event.pageY) + 'px')

          that.changeDetectorRef.detectChanges();;
        })
        .on('mouseout', function (d) {
          that.tooltip.transition()
            .duration(300)
            .style('opacity', 0);

          that.changeDetectorRef.detectChanges();;
        });
    }

    that.legendContainer = that.svg.append('rect')
      .attr('x', that.legendContainerSettings.x)
      .attr('y', that.legendContainerSettings.y)
      .attr('rx', that.legendContainerSettings.roundX)
      .attr('ry', that.legendContainerSettings.roundY)
      .attr('width', that.legendContainerSettings.width)
      .attr('height', that.legendContainerSettings.height)
      .attr('id', 'legend-container')
      .style('fill', '#FFFFFF');


    var legend = that.svg.selectAll('g.legend')
      .data(that.legendData)
      .enter().append('g')
      .attr('class', 'legend')

    if (that.type == 'Filled') {

      // Creating legend based on scale factor
      legend
        .append("rect")
        .attr("x", function (d, i) {
          return (
            that.legendContainerSettings.x + that.legendBoxSettings.width * i + 20
          );
        })
        .attr("y", that.legendBoxSettings.y)
        .attr("width", that.legendBoxSettings.width)
        .attr("height", that.legendBoxSettings.height)
        .style("fill", function (d, i) {
          switch (that.scale) {
            case "Linear":
              return that.colorScaleLinear(that.linearScale.invert(d));
            case "Exponential":
              return that.colorScaleExp(that.expScale.inverd(d));
            case "Logarithmic":
              return that.colorScaleLog(that.logScale.invert(d));
            case "Sqrrt":
              return that.colorScaleSqrt(that.sqrtScale.invert(d));
          }
        })
        .style("opacity", 0.9)

      // Adding text to legend
      legend
        .append("text")
        .attr("x", function (d, i) {
          return (
            that.legendContainerSettings.x + that.legendBoxSettings.width * i + 30
          );
        })
        .attr("y", that.legendContainerSettings.y + 72)
        .style("font-size", 12)
        .text(function (d, i) {
          return that.legendLabels[i];
        })
    }

    if (that.type == 'Bubble') {
      legend
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", function (d, i) {
          return (
            that.legendContainerSettings.x + (that.legendBoxSettings.width + 20) * i + 20
          );
        })
        .attr("cy", that.legendBoxSettings.y)
        .attr("r", function (d, i) {
          d = d * 30;
          switch (that.scale) {
            case "Linear":
              return that.linearScale(that.linearScale.invert(d));
            case "Exponential":
              return that.expScale(that.expScale.invert(d));
            case "Logarithmic":
              return that.logScale(that.logScale.invert(d));
            case "Sqrrt":
              return that.sqrtScale(that.sqrtScale.invert(d));
          }
        })

      legend
        .append("text")
        .attr("x", function (d, i) {
          return (
            that.legendContainerSettings.x + (that.legendBoxSettings.width + 20) * i + 30
          );
        })
        .attr("y", that.legendContainerSettings.y + 72)
        .style("font-size", 12)
        .style("font-weight", "bold")
        .text(function (d, i) {
          return that.legendLabels[i];
        });
    }

    legend
      .append("text")
      .attr("x", that.legendContainerSettings.x + 13)
      .attr("y", that.legendContainerSettings.y + 14)
      .style("font-size", 14)
      .style("font-weight", "bold")
      .text(`Texas Mobility by ${this.metric} during Covid-19 Pandemic`)
  }

  getMetrics(rangeValue) {
    switch (this.scale) {
      case "Linear":
        return this.formatDecimal(this.linearScale.invert(rangeValue));
      case "Exponential":
        return this.formatDecimal(this.expScale.invert(rangeValue));
      case "Logarithmic":
        return this.formatDecimal(this.logScale.invert(rangeValue));
      case "Sqrrt":
        let result = this.formatDecimal(this.sqrtScale.invert(rangeValue));
        return result
    }
  }

  reset(d, p) {
    p.active.classed("active", false);
    p.active = d3.select(null);

    p.svg.transition()
      .duration(750)
      .class(p.zoom.transform, d3.zoomIdentity);
  }

  // If the drag behavior prevents the default click also stop propogation so we don't click-to-zoom
  stopped(d) {
    if (d3.event.defaultPrevented) {
      d3.event.stopPropogation();
    }
    // if (event.defaultPrevented) {
    //   event.stopPropogation();
    // }
  }

  zoomed(d, p) {
    p.g.style("stroke-width", 1.5 / d3.event.transform.k + 'px');
    p.g.attr("transform", d3.event.transform)
    // p.g.style("stroke-width", 1.5 / event.transform.k + 'px');
    // p.g.attr("transform", event.transform)
  }

  join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
      m = mainTable.length,
      lookupIndex = [],
      output = [];
    for (var i = 0; i < l; i++) { // loop through 1 items
      var row = lookupTable[i];
      lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) {
      var y = mainTable[j];
      var x = lookupIndex[y.properties[mainKey]]; // get corresponding row from lookupTable
      output.push(select(y, x)); // Select only the column(s) you need
    }
    return output;
  }

  selectedScaleChange(value) {
    this.scale = value;
    this.location.go(`counties/' + ${this.selectedState}/${this.type}/${this.scale}/${this.metric}/${this.date}`)
    this.removeExistingMapFromParent();
    this.updateMap(true);
  }

  selectedTypeChange(e, btn) {
    this.type = btn.text;
    this.location.go(`counties/${this.selectedState}/${this.type}/${this.scale}/${this.metric}/${this.date}`)
  }

  valueChange(e) {
    console.log(e);
    this.value = e.value;
    this.date = formatDate(new Date(this.value), 'yyyy-MM-dd', 'en');
    // this.location.go('counties/' + this.selectedState + '/' + this.type + '/' + this.scale + '/' + this.metric + '/' + this.date);
    //  this.dateChanged.emit(this.date);
    this.removeExistingMapFromParent();
    this.updateMap(false);
  }

  metricChange(e) {
    console.log(e)
    this.removeExistingMapFromParent();
    this.updateMap(false);
  }

  updateSlider(updateType) {

    if(updateType == "increment") {
      let tempSliderValue = this.sliderValue + 86400000;
      if (tempSliderValue > this.sliderMax) {
        return;
      }
      else {
        this.sliderValue += 86400000;
        this.date = formatDate(new Date(this.sliderValue), 'yyyy-MM-dd', 'en');
      }
    } 
    else {
      let tempSliderValue = this.sliderValue - 86400000;
      if (tempSliderValue < this.sliderMin) {
        return;
      }
      else {
        this.sliderValue -= 86400000;
        this.date = formatDate(new Date(this.sliderValue), 'yyyy-MM-dd', 'en');
      }
    }
    this.removeExistingMapFromParent();
    this.updateMap(false);  


  }
}

