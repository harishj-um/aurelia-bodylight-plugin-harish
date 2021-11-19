import {bindable} from 'aurelia-templating';
import {ChartjsFixed} from './chartjs-fixed';
import {useView} from 'aurelia-templating';


/**
 * shows fixed curve at time -
 * on X is 0,1,2,3,4,5,6,7,8,9
 * on Y is values from FMU variables from refindex to refvalues
 * convertors for x and y axis separated by ;
 * refindex, refvalues for y values
 * xrefindex,xrefvalues for x values
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
    @bindable xtofixed = -1;

    //@bindable cachesize;
    currentdataset=0;
    constructor() {
        super();
        this.handleValueChange = e => {
            //let j = this.currentdataset;
            //all values from refindex to one dataset - as one curve
            let ydata = e.detail.data.slice(this.refindex, this.refindex + this.refvalues)
            let xdata = e.detail.data.slice(this.xrefindex, this.xrefindex + this.xrefvalues)
            //
            let data = [];
            for (let i = 0; i < ydata.length; i++) {
                if (this.operation && this.operation[0] && this.operation[1])
                    data.push({x: this.operation[0](xdata[i]), y: this.operation[1](ydata[i])});
                else data.push({x: xdata[i], y: ydata[i]});
            }
            //set labels to x axis
            if (this.xtofixed >= 0) this.chart.data.labels = xdata.map(x => x.toFixed(this.xtofixed));

            //set data xy to chart struct
            //do initialize dataset first
            this.chart.data.datasets.unshift({
                data: data,
                label: "",
                backgroundColor: this.currentcolor,
                borderColor: this.currentcolor,
                borderWidth: 1,
                pointRadius: 1,
                fill: false
            });
            if (this.chart.data.datasets[1]) {
                this.chart.data.datasets[1].backgroundColor = this.previouscolor;
                this.chart.data.datasets[1].borderColor = this.previouscolor;
            }
                if (this.chart.data.datasets.length > this.maxdata) this.chart.data.datasets.pop();
                this.updatechart();
            }
        }


    bind(){
        super.bind();
        this.xrefindex = parseInt(this.xrefindex, 10);
        if (!this.xrefindex) console.warn('xrefindex is not specified');
        this.xrefvalues = parseInt(this.xrefvalues, 10);
        if (this.xrefvalues !== this.refvalues) console.warn('xrefvalues must be equal to refvalues');
    }

    attached() {
        super.attached();
    }

}
