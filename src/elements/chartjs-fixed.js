import {bindable} from 'aurelia-templating';
import {Chartjs} from './chartjs';
import {useView} from 'aurelia-templating';
import _ from 'lodash';

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
    @bindable colorindex=0;
    currentcolor;
    previouscolor;
    //@bindable cachesize;
    currentdataset=0;

    constructor(){
        super();
        this.handleValueChange = e => {
            //let j = this.currentdataset;
            //all values from refindex to one dataset - as one curve
            //if (!this.chart.data.datasets[j]) {
                //do initialize dataset first
            this.chart.data.datasets.unshift({
                    data: e.detail.data.slice(this.refindex,this.refindex+this.refvalues),
                    label:"",
                    backgroundColor: this.currentcolor,
                    borderColor: this.currentcolor,
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false
                })
            if(this.chart.data.datasets[1]) {
                this.chart.data.datasets[1].backgroundColor = this.previouscolor;
                this.chart.data.datasets[1].borderColor = this.previouscolor;
            }
            //do apply operation on each element of array
            if (this.operation && this.operation[0])
                this.chart.data.datasets[0].data.map(item => {return this.operation[0](item)});

            if (this.chart.data.datasets.length>this.maxdata) { this.chart.data.datasets.pop();}

            this.updatechart();
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
        if (typeof this.colorindex === 'string') this.colorindex = parseInt(this.colorindex,10);
        //initialize colors for each dataset
        this.currentcolor =  this.selectColor(this.colorindex,65);
        this.previouscolor = this.selectColor(this.colorindex,65,95);
    }

    attached() {
        super.attached();
    }

}
