import {bindable} from 'aurelia-templating';
import {Chartjs} from './chartjs';
import {useView} from 'aurelia-templating';

/**
 * shows fixed curve at time -
 * on X is 0,1,2,3,4,5,6,7,8,9
 * on Y is values from FMU variables from refindex to refvalues
 */
@useView('./chartjs.html')
export class ChartjsFixed extends Chartjs {
    @bindable fromid;
    @bindable labels;
    @bindable refindex;
    @bindable refvalues;
    @bindable type;
    @bindable min;
    @bindable max;
    @bindable maxdata=3;

    //@bindable cachesize;
    currentdataset=0;
    constructor(){
        super();
        this.handleValueChange = e => {
            let j = this.currentdataset;
            //all values from refindex to one dataset - as one curve
            if (!this.chart.data.datasets[j]) {
                //do initialize dataset first
                this.chart.data.datasets.push({
                    data: e.detail.data.slice(this.refindex,this.refindex+this.refvalues),
                    label:"",
                    backgroundColor: this.selectColor(0),
                    borderColor: this.selectColor(0),
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false
                })
            } else {
                this.chart.data.datasets[j].data=e.detail.data.slice(this.refindex,this.refindex+this.refvalues);
            }
            //do apply operation on each element of array
            if (this.operation && this.operation[0])
                this.chart.data.datasets[j].data.map(item => {return this.operation[0](item)});
            if (this.currentdataset>=this.maxdata) this.currentdataset=0; else this.currentdataset++;
            this.chart.update();
        };
    }

    bind(){
        super.bind();
        this.type = 'line';
        this.options.legend.display = false;
        let dataset = [];
        dataset.push({
            data: [],
            label:"",
            backgroundColor: this.selectColor(0),
            borderColor: this.selectColor(0),
            borderWidth: 1,
            pointRadius: 1,
            fill: false
        })

        this.data = {
            labels: Array.from(Array(this.refvalues), (_,x) => x+1), //returns [1,2,3,..,refvalues]
            datasets: dataset
        };
        //initialize colors for each dataset
    }

    attached() {
        super.attached();
    }

}
