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
  @bindable listenkey; //true or false
  @bindable activationkey; //if defined - then
  actived = false;

  bind() {
    if (this.max) {
      this.maxlength = this.max.length + 4;
    } else this.maxlength = 7;
    if (this.listenkey && this.listenkey === 'true') {
      if (this.activationkey && this.activationkey === 'A') this.actived = true; //first activationkey 'A' is by default actived
      document.onkeypress = function (e) {
        //e = e || window.event;// use e.keyCode
        //if (window.listenrange)
        if (this.activationkey && e.charCode >= 65 && e.charCode <=90 ) { //'A' ..'Z' is pressed
          this.actived = (e.key === this.activationkey);
        }
        if (!(this.activationkey) || (this.actived)) { //activationkey not defined or actived - 'A' or
          let number = e.charCode - 97; //0..9
          let mappedvalue = parseInt(this.min);
          if (number > 0) { //a..j interpolates to values between min and max
            if (number < 9) mappedvalue = parseInt(this.min) + (parseInt(this.max) - parseInt(this.min)) * number / 10;
            else mappedvalue = parseInt(this.max);
          }
          this.setValue(mappedvalue);
        }
      }
    }
  }

  setDefault() {
    this.refinput.value = this.default;
    this.refnumber.value = this.default;
    this.refinput.dispatchEvent(new Event(this.fireevent, {bubbles: true, cancelable: true}));
    //return true;
  }

  setValue(value) {
    this.refinput.value = value;
    this.refnumber.value = value;
    this.refinput.dispatchEvent(new Event(this.fireevent, {
      bubbles: true,
      cancelable: true
    }));
    }
  }
}
