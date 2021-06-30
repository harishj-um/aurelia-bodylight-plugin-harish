import {Bind2animation} from './bind2animation';

export class Bind2animswitch extends Bind2animation {
  //trigger = true;
  triggered = false;
  limit;
  constructor(_findex, _aname, limit) {
    super(_findex, _aname, 0, 0, 0, 0, null);
    this.findex = _findex;
    this.aname = _aname;
    this.limit = limit;
  }

  convertf2a(x) { return x;}

  handleValue(animobj, value) {
    if (!this.triggered) {
      //not triggered - check if animation should start
      if (value > this.limit) {
        animobj.startAnimation(this.aname);
        this.triggered = true;
      }
    } else {
      //triggered - check if animation should stop
      if (value <= this.limit) {
        animobj.stopAnimation(this.aname);
        this.triggered = false;
      }
    }
  }
}
