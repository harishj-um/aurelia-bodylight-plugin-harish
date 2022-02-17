import {bindable} from 'aurelia-framework';
export class Buttonparams {
    //@bindable value;
    @bindable title;
    @bindable ids;
    @bindable values;
    @bindable resetvalues;
    @bindable ticks2reset = 1;
    @bindable fromid;
    @bindable fireevent='input'; //name of the event to be fired
    //@bindable findex; //optional index of variables which will be set to values array fmu-index
    //@bindable convertors; //optional convertor?? value-convertor
    showinputs=false; //debug to show inputs true, otherwise false
    values2send=[];
    ids2send=[];
    resetvalues2send=[];
    currenttick = 0;

    constructor() {
      this.handleTick = e => {
        this.currenttick++;
        if (this.currenttick >= this.ticks2reset) {
          //do reset values
          if (this.ids2send.length !== this.resetvalues2send.length) {
            console.warn('warning ids and values contain different number of items.', this.ids2send, this.resetvalues2send);
            return;
          }
          //set reset values
          for (let i = 0; i < this.ids2send.length; i++) {
            let inputel = document.getElementById(this.ids2send[i]);
            inputel.value = this.resetvalues2send[i];
            let event = new Event('change');
            inputel.dispatchEvent(event);
          }
          //remove event listener - do not need to listen the event anymore
          const fromel = document.getElementById(this.fromid);
          if (fromel) {
            fromel.removeEventListener('fmidata', this.handleTick);
          }
        }
      };
    }

    bind() {
      //console.log('button.bind()');
      this.ids2send = this.ids.split(',');
      this.createids = [];
      //create those ids not yet in HTML DOM and put them to createids array
      for (let myid of this.ids2send) {if (! document.getElementById(myid)) this.createids.push(myid);}
      this.values2send = this.values.split(',');
      //reset value - after some time period or after some event
      if (this.resetvalues) {
        this.resetvalues2send = this.resetvalues.split(',');
      }
      //get ticks2reset value - parse into number (int),default 1
      if (typeof this.ticks2reset === 'string') {
        this.ticks2reset = parseInt(this.ticks2reset, 10);
        if (isNaN(this.ticks2reset)) this.ticks2reset = 1;
      }
    }

    attached() {
      //in this stage, view creates the virtual inputs as in createids array, the inputs are then consumed by fmu component
      //console.log('button.attached() ids2send, values2send', this.ids2send, this.values2send);
    }

    /*
    this is fired when the button is pressed, it sets values to the defined state
    dispatch the event and if resetvalues is set - then listen fmidata event
     */
    switchvalues() {
      if (this.ids2send.length !== this.values2send.length) {console.warn('warning ids and values contain different number of items.',this.ids2send, this.values2send); return;}
      for (let i = 0; i < this.ids2send.length; i++) {
        let inputel = document.getElementById(this.ids2send[i]);
        inputel.value = this.values2send[i];
        let event = new Event(this.fireevent);
        inputel.dispatchEvent(event);
      }

      //if resetvalues are set, listen to ticks - fmidata event and after defined ticks2reset the values are set to resetvalues
      if (this.resetvalues) {
        this.currenttick = 0;
        const fromel = document.getElementById(this.fromid);
        if (fromel) {
          fromel.addEventListener('fmidata', this.handleTick);
        }
      }
    }
}
