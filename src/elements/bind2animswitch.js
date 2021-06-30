import {Bind2animation} from './bind2animation';

export class Bind2animswitch extends Bind2animation {
  trigger = true;
  triggered = false;
  limit = 1e-12;
  constructor(_findex, _aname) {
    super(_findex, _aname, 0, 0, 0, 0, null);
    this.findex = _findex;
    this.aname = _aname;
  }

  convertf2a(x) { return x;}
}
