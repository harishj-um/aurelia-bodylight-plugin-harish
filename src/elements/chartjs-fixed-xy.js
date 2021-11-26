import {bindable} from 'aurelia-templating';
import {ChartjsFixed} from './chartjs-fixed';
import {useView} from 'aurelia-templating';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';

/**
 * shows fixed curve at time -
 * on X isvalues from FMU variables from xrefindex to xrefvalues
 * on Y is values from FMU variables from refindex to refvalues
 * convertors for x and y axis separated by ;
 * refindex, refvalues for y values
 * xrefindex,xrefvalues for x values
 * refpointindex
 */
@useView('./chartjs.html')
export class ChartjsFixedXy extends ChartjsFixed {
    @bindable fromid;
    @bindable labels;
    @bindable refindex;
    @bindable refvalues;
    @bindable type;
    @bindable min;
    @bindable max;
    @bindable maxdata=3;
    @bindable xrefindex;
    @bindable xrefvalues;
    @bindable xtofixed = 0;
    @bindable refpointindex;
    @bindable xrefpointindex;

    //@bindable cachesize;
    currentdataset=0;
    constructor() {
        super();
        this.handleValueChange = e => {
            //let j = this.currentdataset;
            //all values from refindex to one dataset - as one curve
            let ydata = e.detail.data.slice(this.refindex, this.refindex + this.refvalues)
            let xdata = e.detail.data.slice(this.xrefindex, this.xrefindex + this.xrefvalues)
            let xpoint = 0;
            let ypoint= 0;
            //point to highlight
            if (this.refpointindex) {
                xpoint = e.detail.data[this.xrefpointindex];
                ypoint = e.detail.data[this.refpointindex];
            }
            //convertors
            if (this.operation && this.operation[0] && this.operation[1]){
                xdata = xdata.map(x => this.operation[0](x));
                ydata = ydata.map(y => this.operation[1](y));
                if (this.refpointindex) {
                    xpoint = this.operation[0](xpoint);
                    ypoint = this.operation[1](ypoint);
                }
            }
            let data = [];
            for (let i = 0; i < ydata.length; i++) {
                data.push({x: xdata[i], y: ydata[i]});
            }
            let data2 = [{x:xpoint,y:ypoint}];

            //set labels to x axis
            if (this.xtofixed >= 0) this.chart.data.labels = xdata.map(x => x.toFixed(this.xtofixed));

            //set data xy to chart struct
            //do initialize dataset first
            let newdataset = {
                data: data,
                label: "",
                backgroundColor: this.currentcolor,
                borderColor: this.currentcolor,
                borderWidth: 1,
                pointRadius: 1,
                fill: false
            };
            let colorindex = 1;
            if (this.refpointindex) {
                let newpointdataset = {
                    data: data2,
                    label: "",
                    backgroundColor: this.currentcolor,
                    borderColor: this.currentcolor,
                    borderWidth: 1,
                    pointRadius: 2,
                    fill: false
                }
                this.chart.data.datasets[0] = newdataset;
                this.chart.data.datasets.unshift(newpointdataset);
            } else {
                this.chart.data.datasets.unshift(newdataset);
            }
            if (this.chart.data.datasets[colorindex]) {
                this.chart.data.datasets[colorindex].backgroundColor = this.previouscolor;
                this.chart.data.datasets[colorindex].borderColor = this.previouscolor;
            }
            if (this.chart.data.datasets[colorindex+1]) {
                this.chart.data.datasets[colorindex+1].backgroundColor = this.previouscolor2;
                this.chart.data.datasets[colorindex+1].borderColor = this.previouscolor2;
            }
                if (this.chart.data.datasets.length > this.maxdata) this.chart.data.datasets.pop();
                this.updatechart();
            }
        }


    bind(){
        super.bind();
        this.data.labels = [];
        this.xrefindex = parseInt(this.xrefindex, 10);
        if (!this.xrefindex) console.warn('xrefindex is not specified');
        this.xrefvalues = parseInt(this.xrefvalues, 10);
        if (this.xrefvalues !== this.refvalues) console.warn('the value of "xrefvalues" must be equal to "refvalues"');
        this.xrefpointindex = parseInt(this.xrefpointindex, 10);
    }

    attached() {
        super.attached();
    }

}
