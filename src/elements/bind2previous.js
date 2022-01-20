import {bindable} from 'aurelia-framework';

/**
 * Bind2Previous binds two components identified by "fromid" and "toid" it changes the 'value' attribute of the 'toid' element
 * <bind2previous fromid="id1" toid="id2"></bind2previous>
 *
 * <bdl-fmi id="id4" inputs="id4,id1,id6,..."></bdl-fmi> fmi component registers event listener and change the value on behalf of it
 *
 */
export class Bind2previous {
  @bindable fromid;
  @bindable event = 'input'
  @bindable toid;
  @bindable toattribute;

  constructor() {
    //document.getElementById("id${window.ids - 2}").addEventListener("change", myfun${window.ids});
    /*function myfun${window.ids}(event){
        document.getElementById("id${window.ids - 1}").value = event.target.value;
   }*/
    this.handleValueChange = e => {
      //console.log('handleValueChange, e,fromid,toid', e);
      let value = e.detail ? e.detail.value : e.target.value;
      if (this.toattribute) {
        let el = document.getElementById(this.toid);
        el.setAttribute(this.toattribute, value);
        //fix setting depended input attributes -e.g. in <range>
        let inputs = el.getElementsByTagName('input');
        if (inputs.length > 0) {
          for (let input of inputs) input.setAttribute(this.toattribute,value);
        }
      }
      else document.getElementById(this.toid).value = value;
    };
  }

  attached() {
    document.getElementById(this.fromid).addEventListener(this.event, this.handleValueChange);
  }
  detached() {
    if (document.getElementById(this.fromid)) document.getElementById(this.fromid).removeEventListener('input', this.handleValueChange);
  }
}
