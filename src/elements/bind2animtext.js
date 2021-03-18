import {Bind2animation} from './bind2animation';
export class Bind2animtext extends Bind2animation {
  constructor(_findex, _aname, _operation) {
    super(_findex, _aname, 0, 0, 0, 0, _operation);
    this.findex = _findex;
    this.aname = _aname;
  }

  convertf2a(x) {
    if (this.operation) x = this.operation(x);
    let xstr = x.toPrecision(4);
    return xstr;
  }
}
