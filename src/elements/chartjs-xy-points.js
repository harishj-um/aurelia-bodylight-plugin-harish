import {ChartjsXy} from './chartjs-xy';
import {bindable, useView} from 'aurelia-templating';
//import {PLATFORM} from 'aurelia-pal';
//@useView(PLATFORM.moduleName('./bdl-chartjs.html'))
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

    index = 0;

    constructor() {
      super();
      this.handleValueChange = e => {
        //e.detail do not reallocate - using same buffer, thus slicing to append to data array
        //let datapoints =e.detail.data.slice(this.refindex, this.refendindex);
        let j = 0;
        //put first value on x axis, others on y axis other values
        for (let i = (this.refindex + 1); i < this.refindex + this.refvalues; i++) {
          //remember only current x,y value - on the index
          this.chart.data.datasets[j].data[this.index] = {x: e.detail.data[this.refindex], y: e.detail.data[i]};
          j++;
        }
        //console.log('chartjs-xy handlevaluechange datasets, e.detail.data',this.chart.data.datasets, e.detail.data);
        this.chart.update();
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
      this.options.tooltips.callbacks = {
        label: function(tooltipItem, data) {
          if (data.datasets.length < 2) return tooltipItem.yLabel;
          let label = '(' + data.datasets[0].data[tooltipItem.index].y + ') (' + data.datasets[1].data[tooltipItem.index].y + ') ' +
                    'd:' + Math.abs(data.datasets[0].data[tooltipItem.index].y - data.datasets[1].data[tooltipItem.index].y);
          return label;
        }
      };
      this.type = 'scatter';
      this.plugins = null;
    }
    addpoint() {this.index++;}
    removepoint() {if (this.index > 0) this.index--;}
}
