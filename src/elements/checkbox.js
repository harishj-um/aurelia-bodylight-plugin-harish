import {bindable} from 'aurelia-framework';
export class Checkbox {
    @bindable min=0; //default 0 if not checked
    @bindable max=1; //default 1 if checked
    @bindable title;
    @bindable default;
    value;
    isChecked=false;

    bind() {
      if (this.default) {
        //console.log('checkbox default,', this.default);
        this.isChecked = this.default === 'true';
      }
      //console.log('checkbox bind() min:' + this.min + ' max:' + this.max + ' default:' + this.default + ' ischecked' + this.isChecked);
    }
}
