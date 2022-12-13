//import Dygraph from 'dygraphs';
//import {Dygraph} from '../utils/dygraph';
import {Dygraph} from '../utils/dygraph';
import {bindable} from 'aurelia-framework';
import {saveAs} from 'file-saver';

export class Dygraphchart {
  @bindable inputs;
  @bindable fromid;
  @bindable maxdata=300;
  @bindable refindex;
  @bindable refvalues=1;
  @bindable throttle=200; //time to throttle chart update, if it is too much at once
  initialdata = true;
  refindices = null;

  constructor() {
    //this.data = [[0, 0, 0]];

    //this.data=[[1, 5], [2, 5], [3, 4.9], [4, 4.8], [5, 5.2]];

    //create lambda function which is added as listener later
    console.log('dygraph chart constructor');
    this.handleValueChange = e => {
      let datapoint = [e.detail.time];
      //e.detail do not reallocate - using same buffer, thus slicing to append to data array
      let edata = e.detail.data.slice();
      if (this.refindices) {
        for (let myindex of this.refindices) datapoint.push(edata[myindex]);
      } else
      {
        for (let i = this.refindex; i < this.refindex + this.refvalues; i++) datapoint.push(edata[i]);
      }
      if (this.initialdata) { this.data = []; this.initialdata = false;}
      //datapoint
      this.data.push(datapoint);
      //shift - remove first element if data is too big
      if (this.data.length > this.maxdata) this.data.shift();
      //console.log('Dygraphchar data', this.data);
      this.updatechart();
      //this.dygraph.updateOptions( { 'file': this.data } );
    };
    this.handleReset = e => {
      this.resetdata();
      this.updatechart();
      //this.dygraph.updateOptions( { 'file': this.data } );
    };
  }

  updatechartfn() {
    this.dygraph.updateOptions( { 'file': this.data } );
  }

  resetdata() {
    this.data = [];
    let initdatapoint = Array(parseInt(this.refvalues, 10) + 1).fill(0);
    this.data.push(initdatapoint);
    this.initialdata = true;
  }

  attached() {
    //listening to custom event fmidata
    console.log('dygraph attached');
    if (this.refindex && (this.refindex.indexOf(',')>0)) this.refindices = this.refindex.split(',');
    let fmielement = document.getElementById(this.fromid);
    if (fmielement) {
      fmielement.addEventListener('fmidata', this.handleValueChange);
      fmielement.addEventListener('fmireset', this.handleReset);
    }
    //labels are separated by , in attribute inputs
    //console.log('BdlDygraphchart attached inputs', this.inputs);
    this.labels = this.inputs? this.inputs.split(','):[];
    //console.log('BdlDygraphchart attached labels', labels);
    //create dygraph
    this.resetdata();
    //console.log('BdlDygraphchart attached initial data init data', initdatapoint, ' data:', this.data);
    this.initdygraph();
    /*data.push([x, y]);
    g.updateOptions( { 'file': data } );*/

    //register throttled update function
    if (typeof this.throttle === 'string') this.throttle = parseInt(this.throttle, 10);

    if (this.throttle>0) {//throttle
      this.updatechart = _.throttle(this.updatechartfn.bind(this), this.throttle);
    } else {//directly call chart update
      this.updatechart = this.updatechartfn.bind(this);
    }

  }

  initdygraph(){
    //console.log('initdygraph:',Dygraph);
    this.dygraph = new Dygraph(this.dygraphcanvas, this.data,
        {
          //Draw a small dot at each point
          drawPoints: true,
          //rolling average period text box to be show
          //showRoller: true,
          //customBars if series is low;middle;high where range between low and high is visualised
          //customBars: true,
          //range selector
          //showRangeSelector: true,
          labels: this.labels
        });
  }

  detached() {
    if (document.getElementById(this.fromid)) document.getElementById(this.fromid).removeEventListener('fmidata', this.handleValueChange);
    if (document.getElementById(this.fromid)) document.getElementById(this.fromid).removeEventListener('fmireset', this.handleReset);
  }

  download() {
    let filename = prompt('File name (*.csv):', 'data.csv');
    if (filename) {
      if (!filename.endsWith('.csv')) filename = filename.concat('.csv');
      let content = this.inputs + '\n' + this.data.map(e => e.join(',')).join('\n');
      let blob = new Blob([content], {type: 'text/csv;charset=utf-8;'});
      saveAs(blob, filename);
    }
  }

  preview() {
    let content = this.inputs + '\n' + this.data.map(e => e.join(',')).join('\n');
    let blob = new Blob([content], {type: 'text/csv;charset=utf-8;'});
    let url = URL.createObjectURL(blob);
    this.popup = window.open(url, 'BodylightPreview', 'width=800,height=600,menubar=no,status=no,titlebar=no,toolbar=no');
  }
}
