import {bindable} from 'aurelia-framework';
export class Buttonparams {
    @bindable value;
    @bindable title;
    @bindable ids;
    @bindable values;
    showinputs=false; //debug to show inputs true, otherwise false
    values2send=[];
    ids2send=[];

    constructor() {}

    attached() {
      console.log('button.attached() ids2send, values2send', this.ids2send, this.values2send);
    }
    bind() {
      console.log('button.bind()');
      this.ids2send = this.ids.split(',');
      this.createids = [];
      //put to createids only elements which are not part of DOM yet. - these are created in HTML template
      for (let myid of this.ids2send) {if (! document.getElementById(myid)) this.createids.push(myid);}
      this.values2send = this.values.split(',');
    }

    switchvalues() {
      if (this.ids2send.length !== this.values2send.length) {console.log('warning ids and values contain different number of items.', this.ids2send, this.values2send); return;}
      for (let i = 0; i < this.ids2send.length; i++) {
        let inputel = document.getElementById(this.ids2send[i]);
        inputel.value = this.values2send[i];
        let event = new Event('change');
        inputel.dispatchEvent(event);
      }
    }
}
