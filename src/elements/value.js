import {bindable} from 'aurelia-templating';
import _ from 'lodash';

export class Value {
  @bindable fromid;
  @bindable refindex;
  @bindable convertors;
  @bindable precision=4;
  @bindable throttle=500;

  constructor() {
    //create lambda function which is added as listener later
    this.handleValueChange = e => {
      //e.detail do not reallocate - using same buffer, thus slicing to append to data array
      //let edata = e.detail.data.slice();

      //throttle update to reasonable frequency
      // _.throttle(()=> this.updateValue(e.detail.data[this.refindex]), this.throttle)();
      //call throttled function with args
      this.myupdatevalue(e.detail.data[this.refindex])
    };
  }

  bind() {
    //register throttled update function
    if (typeof this.throttle === 'string') this.throttle = parseInt(this.throttle, 10);
    if (typeof this.precision === 'string') this.precision = parseInt(this.precision, 10);
    this.myupdatevalue = _.throttle(this.updateValue, this.throttle);
    //configure convertors - used to convert units received from fmi
    if (this.convertors) {
      let convertvalues = this.convertors.split(';');
      let identity = x => x;
      this.operation = [];
      for (let i = 0; i < convertvalues.length; i++) {
        if (convertvalues[i].includes(',')) {
          //convert values are in form numerator,denominator contains comma ','
          let convertitems = convertvalues[i].split(',');
          if (convertitems[0] === '1' && convertitems[1] === '1' && convertitems[2] === '0') this.operation.push(identity);
          else {
            let numerator = parseFloat(convertitems[0]);
            let denominator = parseFloat(convertitems[1]);
            this.operation.push(x => x * numerator / denominator);
          }
        } else {
          //convert values are in form of expression, do not contain comma
          if (convertvalues === '1/x') this.operation.push(x=> 1 / x);

          else {
            // for eval() security filter only allowed characters:
            // algebraic, digits, e, dot, modulo, parenthesis and 'x' and 'e' is allowed
            let expression = convertvalues[i].replace(/[^-\d/*+.()%xe]/g, '');
            console.log('chartjs bind(), evaluating expression:' + convertvalues[i] + ' securely filtered to :' + expression);
            // eslint-disable-next-line no-eval
            this.operation.push(x => eval(expression));
          }
        }
      }
    }
  }

  attached() {
    //listening to custom event fmidata
    document.getElementById(this.fromid).addEventListener('fmidata', this.handleValueChange);

  }

  detached() {
    if (document.getElementById(this.fromid)) document.getElementById(this.fromid).removeEventListener('fmidata', this.handleValueChange);
  }

  updateValue(rawvalue) {
    if (this.operation) this.value = this.operation[0](rawvalue).toPrecision(this.precision); // * this.numerator / this.denominator + this.addconst;
    else this.value = rawvalue.toPrecision(this.precision);
  }
}
