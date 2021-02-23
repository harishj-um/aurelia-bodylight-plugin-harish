import {Bind2animation} from './bind2animation';
export class Bind2animtext extends Bind2animation {
  constructor(_findex, _aname) {
    super(_findex, _aname, 0, 0, 0, 0);
    this.findex = _findex;
    this.aname = _aname;
  }

  convertf2a(x) {
    let xstr = x.toPrecision(4);
    return xstr;
  }
}
