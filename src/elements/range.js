import {bindable} from 'aurelia-framework';

export class Range {
  @bindable min;
  @bindable max;
  @bindable default;
  @bindable step;
  @bindable value;
  @bindable title;
  @bindable fireevent='input'; //name of the event to be dispatched - should be same as fmi eventlisten
  refinput;
  refnumber;

  bind() {
    if (this.max) {
      this.maxlength = this.max.length + 4;
    } else this.maxlength = 7;
  }

  setDefault() {
    this.refinput.value = this.default;
    this.refnumber.value = this.default;
    this.refinput.dispatchEvent(new Event(this.fireevent, {bubbles: true, cancelable: true}));
    //return true;
  }
}
