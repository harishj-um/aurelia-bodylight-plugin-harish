import {Range} from './range';
import {bindable} from 'aurelia-framework';

/**
 * when user clicks or change the input rapidly - it will generate 'number' of events between current and target values tto be sent
 * with 'time' in ms between each event
 */
export class RangeSmooth extends Range {
    @bindable number=5;
    @bindable time=200;

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
    @bindable ids; //optional comma separated id to send value change ,e.g. id1,id2,id3
    @bindable convertors;//comma separated xpression with x as value e.g. (100-2-x)/3,(100-2-x)/3,(100-2-x)/3
    //optional twoway settings - if set - fmudata may set the value of range
    @bindable fromid; //id of fmu component
    @bindable refindex; //index of variable to be listened
    myvalue;
    smoothing=false;
    constructor() {
        super();
        this.handleValueChange = e => {
            this.smoothValue(e);
            e.stopPropagation();
        }
    }

    bind(){
        super.bind();
        this.myvalue = this.default;
    }

    attached(){
        super.attached();
        this.refinput.addEventListener('input',this.handleValueChange);
        this.refnumber.addEventListener('input',this.handleValueChange);
        this.value = parseFloat(this.myvalue);
    }

    detached(){
        this.refinput.removeEventListener('input',this.handleValueChange);
        this.refnumber.removeEventListener('input',this.handleValueChange);
    }

    smoothValue(e){
        if (!this.smoothing) {
            this.smoothing = true;
            this.targetvalue = parseFloat(e.target.value);
            this.currentvalue = this.value;
            this.valuestep = (this.targetvalue - this.currentvalue) / this.number;
            for (let i = 1; i < this.number; i++) {
                setTimeout(() => {
                    this.value += this.valuestep;
                    let event = new CustomEvent('input', {detail: {value: this.value}});
                    this.refsmooth.dispatchEvent(event);
                    console.log('sending value:', this.value);
                }, 500 * i);
            }
            setTimeout(() => {
                this.value = this.targetvalue;
                let event = new CustomEvent('input', {detail: {value: this.value}});
                this.refsmooth.dispatchEvent(event);
                this.smoothing = false;
                console.log('sending value:', this.value);
            }, 500 * this.number);
        } else {
            //only set target value
            this.targetvalue = parseFloat(e.target.value);
            this.valuestep = (this.targetvalue - this.value) / this.number;
        }
    }

}
