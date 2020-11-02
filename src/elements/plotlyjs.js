import * as Plotly from 'plotly.js-dist';
import {bindable} from 'aurelia-framework';

export class Plotlyjs {
  @bindable fromid;
  @bindable labels;
  @bindable refindex;
  @bindable refvalues;

  constructor() {
    this.handleValueChange = e => {
      this.updateData(e.detail.data);
    };
  }
  /**
   * process all attributes of <bdl-chart> component and sets appropriate settings of subesquent chartjs
   */
  bind() {
    this.refindex = parseInt(this.refindex, 10);
    this.refvalues = parseInt(this.refvalues, 10);
    this.refendindex = this.refindex + this.refvalues;

    //configure convertors - used to convert units received from fmi
    if (this.convertors) {
      let convertvalues = this.convertors.split(';');
      let identity = x => x;
      this.operation = [];
      for (let i = 0; i < convertvalues.length; i++) {
        if (convertvalues[i].includes(',')) {
          //convert values are in form numerator,denominator contains comma ','
          let convertitems = convertvalues[i].split(',');
          if (convertitems[0] === '1' && convertitems[1] === '1') this.operation.push(identity);
          else {
            let numerator = parseFloat(convertitems[0]);
            let denominator = parseFloat(convertitems[1]);
            this.operation.push(x => x * numerator / denominator);
          }
        } else {
          //convert values are in form of expression, do not contain comma
          if (convertvalues === '1/x') this.operation.push(x => 1 / x);

          else {
            //filter only allowed characters: algebraic, digits, e, dot, modulo, parenthesis and 'x' is allowed
            let expression = convertvalues[i].replace(/[^-\d/*+.()%xe]/g, '');
            console.log('chartjs bind(), evaluating expression:' + convertvalues[i] + ' securely filtered to :' + expression);
            // eslint-disable-next-line no-eval
            this.operation.push(x => eval(expression));
          }
        }
      }
    }


    //sets color of each dataset as different as possible
    //and set initial data in chart
    //set labels - separated by comma
    if (this.labels) this.chlabels = this.labels.split(',');
    //else generate labels as 'variable 1' ...
    else {
      this.chlabels = [...Array(this.refvalues)].map((_, i) => `variable ${i}`);
    }
  }

  attached() {
    //console.log('plotlyjs:', Plotly);
    this.chart = Plotly.newPlot(
      this.plotlydiv,
      [{x: [1, 2, 3, 4], y: [1, 6, 3, 2]}],
      { margin: { t: 0 }});
  }


  updateData(data) {
    //sets data to dataset
    //apply value convert among all data
    let rawdata = data.slice(this.refindex, this.refendindex);
    //if convert operation is defined as array
    if (this.operation) {
      for (let i = 0; i < rawdata.length; i++) {
        //if particular operation is defined
        if (this.operation[i]) rawdata[i] = this.operation[i](rawdata[i]);
      }
    }
    this.chart.data.datasets[0].data = rawdata;
    this.chart.update();
  }
}
