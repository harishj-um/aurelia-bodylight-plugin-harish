export class FmiInterface {
    contructor(inst) {
        this.inst = inst;
    }
    //defines just interface for methods
    initialize() {
        if (this.inst instanceof Promise) this.inst.then(inst => {this.fmiinst = inst; this.inst2 = inst; this.initialize1();});
        else {this.inst2 = this.inst; this.initialize1();}
    }

    initialize1() {
        this.fmiEnterInit(this.fmiinst);
        this.fmiExitInit(this.fmiinst);
    }

}