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

  setDefault() {
    this.refinput.value = this.default;
    this.refinput.dispatchEvent(new Event(evenlisten, {bubbles: true, cancelable: true}));
    return true;
  }
}
