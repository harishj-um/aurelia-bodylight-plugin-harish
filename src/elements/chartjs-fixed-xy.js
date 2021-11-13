import {bindable} from 'aurelia-templating';
import {ChartjsFixed} from './chartjs-fixed';
import {useView} from 'aurelia-templating';


/**
 * shows fixed curve at time -
 * on X is 0,1,2,3,4,5,6,7,8,9
 * on Y is values from FMU variables from refindex to refvalues
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

    //@bindable cachesize;
    currentdataset=0;
    constructor(){
        super();
        this.handleValueChange = e => {
            let j = this.currentdataset;
            //all values from refindex to one dataset - as one curve
            let ydata = e.detail.data.slice(this.refindex,this.refindex+this.refvalues)
            let xdata = e.detail.data.slice(this.xrefindex,this.xrefindex+this.xrefvalues)
            //
            let data = [];for (let i=0;i<ydata.length;i++) data.push({x:xdata[i],y:ydata[i]});
            //set labels to x axis
            this.chart.data.labels = xdata;
            //set data xy to chart struct
            if (!this.chart.data.datasets[j]) {
                //do initialize dataset first
                this.chart.data.datasets.push({
                    data: data,
                    label:"",
                    backgroundColor: this.selectColor(0),
                    borderColor: this.selectColor(0),
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false
                })
            } else {
                this.chart.data.datasets[j].data=data;
            }
            //do apply operation on each element of array
            if (this.operation && this.operation[0])
                this.chart.data.datasets[j].data.map(item => {return {x:item.x,y:this.operation[0](item.y)}}); //operation on y
            if (this.currentdataset>=this.maxdata) this.currentdataset=0; else this.currentdataset++;
            this.chart.update();
        };
    }

    bind(){
        super.bind();
        if (!this.xrefindex) console.warn('xrefindex is not specified');
        if (this.xrefvalues !== this.refvalues) console.warn('xrefvalues must be equal to refvalues');
    }

    attached() {
        super.attached();
    }

}
