import {Bind2a} from './bind2a';
import {bindable} from 'aurelia-templating';
import {Bind2animtext} from './bind2animtext';

export class Bind2aText extends Bind2a {
  @bindable aname; //name of animation component in AA
  @bindable findex; //index of variable in fmu array

  constructor() {
    super();
  }

  //it is called when all bindable properties are set to class instance;
  bind() {
    //create bind2animation structure
    let binding = new Bind2animtext(this.findex, this.aname);
    this.addbinding(binding);
  }
}
