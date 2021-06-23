import {bindable} from 'aurelia-framework';

export class Range {
  @bindable min;
  @bindable max;
  @bindable default;
  @bindable step;
  @bindable value;
  @bindable title;
  @bindable maxlength;
  @bindable eventlisten='input'; //name of the event to be dispatched - should be same as fmi eventlisten
  refinput;
  refnumber;

  setDefault() {
    this.refinput.value = this.default;
    this.refnumber.value = this.default;
    this.refinput.dispatchEvent(new Event(this.eventlisten, {bubbles: true, cancelable: true}));
    //return true;
  }
}
