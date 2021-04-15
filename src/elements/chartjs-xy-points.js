import {ChartjsXy} from './chartjs-xy';
import {bindable, useView} from 'aurelia-templating';
//import {PLATFORM} from 'aurelia-pal';
//@useView(PLATFORM.moduleName('./bdl-chartjs.html'))

//modified simple implementation of throttle from https://jsfiddle.net/jonathansampson/m7G64/
function throttle(callback, limit) {
  let wait = false;                  // Initially, we're not waiting
  return function() {               // We return a throttled function
    if (!wait) {                   // If we're not waiting
      callback.call();           // Execute users function
      wait = true;               // Prevent future invocations
      setTimeout(function() {   // After a period of time
        wait = false;          // And allow future invocations
      }, limit);
    }
  };
}

@useView('./chartjs-xy-points.html')
export class ChartjsXyPoints extends ChartjsXy {
    @bindable fromid;
    @bindable labels;
    @bindable refindex;
    @bindable refvalues;
    @bindable min;
    @bindable max;
    @bindable xmin;
    @bindable xmax;
    @bindable atitle='Add Point';
    @bindable rtitle='Remove Point';
    showlines = false;
    @bindable convertors;


    index = 0;

    constructor() {
      super();
      this.handleValueChange = e => {
        //e.detail do not reallocate - using same buffer, thus slicing to append to data array
        let rawdata = e.detail.data.slice(this.refindex, this.refendindex);
        //do value conversion based on convertors
        if (this.operation) {
          for (let i = 0; i < rawdata.length; i++) {
            //if particular operation is defined
            if (this.operation[i]) rawdata[i] = this.operation[i](rawdata[i]);
          }
        }
        let j = 0;
        //put each first value on x axis, second on y axis
        for (let i = 1; i < this.refvalues; i = i + 2) {
          //remember only current x,y value - on the index
          this.chart.data.datasets[j].data[this.index] = {x: rawdata[i - 1], y: rawdata[i]};
          //increment dataset - if more dataset are available
          j++;
        }
        //throttle - update values every 1 s only
        throttle(this.chart.update(), 1000);
      };
    }
    bind() {
      super.bind();
      console.log('chartjs xy point bind()');
      if (this.xmin) {
        //sets yscale min
        if (!this.options) this.options = {};
        if (!this.options.scales) this.options.scales = {};
        if (!this.options.scales.xAxes) this.options.scales.xAxes = [{}]; //chartjs 2.9.4
        if (!this.options.scales.xAxes[0].ticks) this.options.scales.xAxes[0].ticks = {}; //chartjs 2.9.4
        this.options.scales.xAxes[0].ticks.min = parseFloat(this.xmin);
      }
      if (this.xmax) {
        //sets yscale max
        if (!this.options) this.options = {};
        if (!this.options.scales) this.options.scales = {};
        if (!this.options.scales.xAxes) this.options.scales.xAxes = [{}]; //chartjs 2.9.4
        if (!this.options.scales.xAxes[0].ticks) this.options.scales.xAxes[0].ticks = {}; //chartjs 2.9.4
        this.options.scales.xAxes[0].ticks.max = parseFloat(this.xmax);
        //if (this.min) this.options.scales.yAxes[0].ticks.stepSize = (this.options.scales.yAxes[0].ticks.max - this.options.scales.yAxes[0].ticks.min) / 10;
      }
      //customize tooltip display
      this.options.tooltips.callbacks = {
        footer: function(tooltipItem, data) {
          if (data.datasets.length < 2) return tooltipItem[0].yLabel;
          let label = [];
          label.push('1:(' + data.datasets[0].data[tooltipItem[0].index].x.toPrecision(2) + ',' + data.datasets[0].data[tooltipItem[0].index].y.toPrecision(2) + ')');
          label.push('d:' + Math.abs(data.datasets[0].data[tooltipItem[0].index].y - data.datasets[1].data[tooltipItem[0].index].y).toPrecision(2));
          label.push('2:(' + data.datasets[1].data[tooltipItem[0].index].x.toPrecision(2) + ',' + data.datasets[1].data[tooltipItem[0].index].y.toPrecision(2) + ')');
          return label;
        }
      };
      this.type = 'scatter';
      this.plugins = null;
    }
    addpoint() {this.index++;}
    removepoint() {if (this.index > 0) this.index--;}
}
