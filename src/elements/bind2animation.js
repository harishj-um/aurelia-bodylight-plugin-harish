/** Bind2animation class instance
 * keeps min and max values of FMU model simulation and calling
 *  convertf2a converts value to animation value between min-max
 * **/
export class Bind2animation {
    findex; //index of variable from FMU
    aname; //name of the animation object - should end by _anim
    amin;amax; //min and max values for animation (usually 0-100)
    fmin;fmax; //min and max values from FMU model simulation
    k1;k2;k3; //internal koefficients

    constructor(_findex, _aname, _amin, _amax, _fmin, _fmax) {
      this.findex = _findex;
      this.aname = _aname; //can be obtained by Object.keys(window.ani.lib).filter(name => name.endsWith('Celek'))
      this.amin = _amin;
      this.amax = _amax;
      this.fmin = _fmin;
      this.fmax = _fmax;
      this.k1 = (1 / (this.fmax - this.fmin));
      this.k2 = (this.fmin / (this.fmax - this.fmin));
      this.k3 = (this.amax - this.amin);
    }

    /** convertf2a converts value to animation value between min-max
    * uses linear approximation,
    * values beyond limits are converted to min or max
 **/
    convertf2a(x) {
      if (x < this.fmin) return this.amin;
      if (x < this.fmax) return this.amin + (x * this.k1 - this.k2) * this.k3;
      return this.amax;
    }
}
