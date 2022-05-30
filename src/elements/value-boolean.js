import {bindable} from "aurelia-templating";
import {Value} from "./value";

export class ValueBoolean extends Value {
    @bindable valuetrue=""; //text to be displayed when true
    @bindable valuefalse=""; //text to be displayed when false

    constructor(...rest) {
        super(...rest);
    }

}
