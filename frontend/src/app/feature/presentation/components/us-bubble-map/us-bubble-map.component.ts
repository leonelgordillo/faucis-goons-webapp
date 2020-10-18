// import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as mobilitydata from "../../data/apple-mobility-us.json";
import * as statesdata from "../../data/states.json";

import { Component, OnInit, ElementRef, ViewEncapsulation, Input, SimpleChanges, OnChanges, ChangeDetectorRef, ViewChild, EventEmitter, Output } from '@angular/core';

import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { tap, catchError, finalize, filter, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { MatSlider } from '@angular/material/slider';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

import * as d3 from 'd3';



@Component({
  selector: 'app-us-bubble-map',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './us-bubble-map.component.html',
  styleUrls: ['./us-bubble-map.component.scss']
})
export class UsBubbleMapComponent implements OnInit {

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

  width = 960;
  height = 500;

  centered;

  legendContainerSettings = {
    x: 0,
    y: this.height,
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
  states: any[] = [];
  c: any[] = [];
  legendLabels: any[] = [];
  scaleCircle;

  numBars = 6;
  start;
  end;

  // May be the only scale we need? Find scale that works best with this relative mobility data
  scale = "Sqrrt";
  type = "Bubble";

  // metric = "Transit", "Driving", "Walking", "Aggregate"
  metric: string = "driving";
  date;
  dateMin = "2020-01-18";
  dateMax;

  linearScale;
  colorScaleLinear;
  expScale;
  colorScaleExp;
  logScale;
  colorScaleLog;
  sqrtScale;
  colorScaleSqrt;

  public scaleButtons = ["Sqrrt", "Linear", "Exponential", "Logarithmic"]

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

  constructor(
    private elRef: ElementRef,
    public router: Router,
    public route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location
  ) {

    this.hostElement = this.elRef.nativeElement;
    this.location = location;

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.route.params.subscribe(params => {
        // this.selectedState = this.route.snapshot.params['selectedState'];
        // if (this.route.snapshot.params['selectedType']) {
        //   var button = this.typeButtons.find(({ text }) => text === this.type);
        //   button.selected = false;
        //   this.type = this.route.snapshot.params['selectedType'];
        //   var button = this.typeButtons.find(({ text }) => text === this.type);
        //   button.selected = true;
        // }

        // if (this.route.snapshot.params['selectedScale']) {
        //   this.scale = this.route.snapshot.params['selectedScale'];
        // }

        // if (this.route.snapshot.params['selectedTab']) {
        //   this.tab = this.route.snapshot.params['selectedTab'];
        // }

        // if (this.route.snapshot.params['selectedMetric']) {
        //   this.metric = this.route.snapshot.params['selectedMetric'];
        // }

        // if (this.route.snapshot.params['selectedDate']) {
        //   this.date = this.route.snapshot.params['selectedDate'];
        //   var value = new Date(this.date);
        //   value.setHours(23, 59, 59, 999);
        //   this.value = value.getTime();
        //   this.slider.value = value.getTime();
        // }
        // else {
        //   this.date = formatDate(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd', 'en');
        // }

        // if (this.router.url.indexOf('/counties') != -1) {
        if (this.router.url.indexOf('/') != -1) {
          this.removeExistingMapFromParent();
          // this.updateMap(true);
        }

      })
    })
  }

  ngOnInit(): void {
    this.updateMap();

    setInterval(() => {
      if (this.date < this.dateMax) {
        this.sliderValue += 86400000;
        this.date = formatDate(new Date(this.sliderValue), 'yyyy-MM-dd', 'en');
        this.removeExistingMapFromParent();
        this.updateMap();
      }
    }, 250)
  }

  private removeExistingMapFromParent() {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    d3.select(this.hostElement).select('svg').remove();
  }

  updateMap() {

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
      .attr("preserveAspectRatio", "xMinYMid")
      .attr("viewBox", `0 0 ${this.width} ${this.height+75}`)
      .classed("svg-content", true)
      // .attr('width', this.width)
      // .attr('height', this.height + 75)
      .on("click", this.stopped, true)

    this.svg.append('rect')
      .attr('class', 'background')
      .attr('width', this.width)
      .attr('height', this.height)
      // .style('fill', 'rgba(58, 122, 168)')
      // .style('opacity', 0.4)
      .on('click', function (d) {
        //  Don't zoom out when selecting rect
        // that.reset(d, that);      })
      });

    // this.svg
    // .call(this.zoom); // delete this line to disable free zooming

    this.g = this.svg.append('g');

    // that.covid = coviddata.counties;
    that.covid = mobilitydata.states;

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
      that.sliderValue = that.sliderMin;
    }

    // Set date to max date if no data is available
    if (that.date > that.dateMax) {
      that.date = that.dateMax;
      that.value = that.max;
    }

    var covidMax = that.covid.filter(function (d) {
      return d.date === that.dateMax;
    })

    // var covid = that.covid.filter(function (d) {
    //   return d.state === that.selectedState
    // });

    that.start = 90

    // Get data for max date

    switch (that.metric) {
      case "walking":
        that.end = d3.max(that.covid, function (d: any) {
          if (d.transportation_type == "walking") {
            return d.relative_mobility
          }
        })
        break
      case "transit":
        that.end = d3.max(that.covid, function (d: any) {
          if (d.transportation_type == "transit") {
            return d.relative_mobility
          }
        })
        break;
      case "driving":
        that.end = d3.max(that.covid, function (d: any) {
          if (d.transportation_type == "driving") {
            return d.relative_mobility
          }
        })
        break;
      case "Total Deaths":
        that.end = d3.max(covidMax, function (d: any) {
          return d.deaths;
        })
        break;
    }

    // Get covid date for current date
    that.covid = that.covid.filter(function (d) {
      return d.date === that.date && d.transportation_type === that.metric && d.state != "Puerto Rico";
    });

    that.states = statesdata.features;

    that.merged = that.join(that.covid, that.states, "state", "name", function (state, covid) {

      var metric;
      switch (that.metric) {
        case "walking":
          if (covid) {
            metric = covid ? covid.relative_mobility : 0;
          }
          break;
        case "transit":
          if (covid) {
            metric = covid ? covid.relative_mobility : 0;
          }
          break;
        case "driving":
          if (covid) {
            metric = covid ? covid.relative_mobility : 0;
          }
          break;
        case "all":
          metric = covid ? covid.daily_deaths : 0;
          break;
      }

      return {
        name: state.properties.name,
        metric: metric,
        geometry: state.geometry,
        type: state.type,
        state: state.properties.state
      };
    });

    // Sort for bubble overlays
    that.merged = that.merged.sort((a, b) => a.metric > b.metric ? - 1 : (a.metric < b.metric ? 1 : 0))

    // Scale Types

    // Linear Scale
    switch (that.type) {
      case "Filled":
        that.linearScale = d3.scaleLinear()
          .domain([that.start, 150])
          .range([0, 1]);
        break;
      case "Bubble":
        that.linearScale = d3.scaleLinear()
          .domain([that.start, 150])
          .range([0, 15]);
        break;
    }

    that.colorScaleLinear = d3.scaleSequential(d =>
      d3.interpolateReds(that.linearScale(d))
    );

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
        that.sqrtScale = d3.scaleSqrt().domain([that.start, that.end])
          .range([.1, 1]);
        break;
      case "Bubble":
        that.sqrtScale = d3.scaleSqrt().domain([that.start, 110])
          .range([.1, 7]);
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
      .attr('class', 'state')
      // .attr('class', 'county')
      .selectAll('path')
      .data(that.merged)
      .enter()
      .append('path')
      .attr('d', that.path)
      .attr('class', 'state')
      // .attr('class', 'county')
      .attr('stroke', 'white')
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
          return "#FFFFFF"
        }
      })

      .on('mouseover', function (d) {
        that.tooltip.transition()
          .duration(200)
          .style('opacity', .9);

        that.tooltip.html(d.name + `<br/><b>TOTAL ` + that.metric + `:</b> ` + that.formatDecimal(d.metric))
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
        // .attr("transform", function (d) { return "translate(" + that.path.centroid(d) + ")"; })
        .attr("transform", function (d) {
          var t = that.path.centroid(d);
          if (t[0] > 0 && t[1] > 0) {
            return "translate(" + t[0] + "," + t[1] + ")";
          } else {
            return "";
          }
        })
        .attr("r", function (d) {
          switch (that.scale) {
            case "Linear":
              return that.linearScale(d.metric);
            case "Exponential":
              return that.expScale(d.metric);
            case "Logarithmic":
              return that.logScale(d.metric);
            case "Sqrrt":
              var ss = that.sqrtScale(d.metric);
              if (ss < 0) {
                return 0
              }
              return that.sqrtScale(d.metric);
          }
        })
        // .on("click", function (d) {
        //   that.clicked(d, that, this);
        // })
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
      .style('opactity', '0.5');


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
        // .style("opacity", 0.5)
        .style("opacity", 1)


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
      .text(`US Mobility by ${this.metric} during Covid-19 Pandemic`)
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
        return this.formatDecimal(this.sqrtScale.invert(rangeValue));

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
    this.removeExistingMapFromParent();
    this.updateMap();
  }

  selectedTypeChange(e, btn) {
    this.type = btn.text;
  }

  valueChange(e) {
    // console.log(e);
    this.value = e.value;
    this.date = formatDate(new Date(this.value), 'yyyy-MM-dd', 'en');

    this.removeExistingMapFromParent();
    this.updateMap();
  }

  metricChange(e) {
    // console.log(e)
    this.removeExistingMapFromParent();
    this.updateMap();
  }

  updateSlider(updateType) {
    if (updateType == "increment") {
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
    this.updateMap();
  }

  getDate(value) {
    return new Date(value)
  }
}

