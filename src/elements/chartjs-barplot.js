import {Chartjs} from './chartjs';
// eslint-disable-next-line no-unused-vars
import ChartDataLabels from 'chartjs-plugin-datalabels';
//import {BdlChartjs} from './chartjs';
import {bindable} from 'aurelia-templating';
//import {PLATFORM} from 'aurelia-pal';
//@useView(PLATFORM.moduleName('./bdl-chartjs.html'))
//@useView('./chartjs.html')
export class ChartjsBarplot extends Chartjs {
    @bindable fromid;
    @bindable labels;
    @bindable refindex;
    @bindable refvalues=1;
    @bindable extremelimits='0,1';
    @bindable normallimits='0.25,0.75';
    @bindable initialdata='7.5';
    @bindable width='500';
    @bindable height='50';


    constructor() {
      super();
    }

    bind() {
      super.bind();
      if (this.extremelimits) {
        this.elimits = this.extremelimits.split(','); //split by comma
        for (let i = 0; i < this.elimits.length; i++ ) this.elimits[i] = parseFloat(this.elimits[i]);
      }
      if (this.normallimits) {
        this.nlimits = this.normallimits.split(',');
        for (let i = 0; i < this.nlimits.length; i++) this.nlimits[i] = parseFloat(this.nlimits[i]);
      }
      this.type = 'horizontalBar';
      this.chlabels = [];
      this.options.legend.display = false;
      if (!this.options.scales.xAxes) this.options.scales.xAxes = [{}];
      this.options.scales.xAxes[0].ticks = {
        autoSkip: false,
        min: this.elimits[0],
        max: this.elimits[1],
        fontSize: 8
      };
      let myticks = [this.elimits[0], this.nlimits[0], this.nlimits[1], this.elimits[1]];
      console.log('charjs barplot myticks', myticks);
      this.options.scales.xAxes[0].afterBuildTicks = function(scale) {
        scale.ticks = myticks;
        return;
      };
      this.options.scales.xAxes[0].beforeUpdate = function(oScale) {
        return;
      };
      this.options.plugins = {
        datalabels: {
          align: 'right',
          anchor: 'end'

        }
      };
      /*if (!this.options.scales.yAxes) this.options.scales.yAxes = [{}];
      this.options.scales.yAxes[0].ticks = {
        max: 5,
        min: 0,
        stepSize: 0.5
      };*/
    }
}
