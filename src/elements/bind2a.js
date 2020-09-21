import {bindable} from 'aurelia-templating';
import {Bind2animation} from './bind2animation';

/**
 * component used to define binding between Adobe Animation object and FMU model simulation
 */
export class Bind2a {
    @bindable aid; //id of animate - optionall, g
    @bindable fid; //id of fmu component -optional
    @bindable aname; //name of animation component in AA
    @bindable findex; //index of variable in fmu array
    @bindable amin = 0; //minimal value in animate component
    @bindable amax = 100; //maximal value in animate component
    @bindable fmin = 0; //minimal value of variable from fmu model
    @bindable fmax = 100; //maximal value of variable from fmu model
    index=0;

    constructor() {

    }

    //it is called when all bindable properties are set to class instance;
    bind() {
      //push into array
      this.amin = parseFloat(this.amin);
      this.amax = parseFloat(this.amax);
      this.fmin = parseFloat(this.fmin);
      this.fmax = parseFloat(this.fmax);

      //create bind2animation structure
      let binding = new Bind2animation(this.findex, this.aname, this.amin, this.amax, this.fmin, this.fmax);

      //create global bind2animation array
      if (!window.animatebindings) window.animatebindings = [];
      //keep index within the array, will be used when detaching
      this.index = window.animatebindings.push(binding) - 1;
    }

    unbind() {
      //remove binding structure from global array - using index position
      window.animatebindings.splice(this.index, 1);
    }
}
