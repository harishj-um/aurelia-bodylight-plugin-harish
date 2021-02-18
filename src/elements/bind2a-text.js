import {Bind2a} from './bind2a';
import {bindable} from "aurelia-templating";

export class Bind2aText extends Bind2a {
  @bindable aname; //name of animation component in AA
  @bindable findex; //index of variable in fmu array

  constructor() {
    super();
  }
}
