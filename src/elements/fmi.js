import {bindable} from 'aurelia-framework';

export const thirdpartytimeout = 5000;

export class Fmi {
  @bindable fminame='N/A';
  @bindable tolerance=0.000001;//0.000030517578
  @bindable starttime=0;
  @bindable stoptime=0; //if >0 then fmi will stop at stoptime
  @bindable guid='N/A';
  @bindable id;
  @bindable inputs;
  @bindable otherinputs;
  @bindable valuereferences;
  @bindable ticksToUpdate = 30;
  @bindable src;
  @bindable fstepsize=0.01;
  @bindable controlid;
  @bindable showcontrols=true;
  @bindable fpslimit = 60;
  @bindable showtime = false;
  @bindable showtimemultiply = 1;
  @bindable eventlisten = 'input';//input==continuous/change==when user drops the value
  @bindable mode="continuous"; //continuous or oneshot
  @bindable stepsperframe = 1;

  cosimulation=1;
  stepSize=0.01;//0.0078125;

  doingstep=false;
  animationstarted=false;
  measurefps=false;
  fpstick=0;
  stepi=0;
  resetBeforeChange = false;
  simulationtime = 0;
  isOneshot = false;

  constructor() {
    //create lambda function which is added as listener later
    this.changeinputs = [];
    this.handleValueChange = e => {
      //e.target; //triggered the event
      let targetid;
      if (e.detail && e.detail.id) targetid = e.detail.id;
      else if (e.target.id.length > 0) targetid = e.target.id;
      else targetid = e.target.parentElement.parentElement.id;
      let targetvalue = (e.detail && e.detail.value) ? e.detail.value : e.target.value;
      this.changeinputs.push({id: targetid, value: targetvalue}); //detail will hold the value being changed
      //determine whether it is fixed parameter - further reset is needed?
      this.resetBeforeChange = this.resetBeforeChange || this.inputreferences[targetid].fixed;
      //do step if mode is oneshot
      if (this.isOneshot) setTimeout(this.step.bind(this),100); //do simulation step after 100 ms
    };
    this.handleDetailChange = e => {
      this.changeinputs.push({valuereference: e.detail.valuereference, value: e.detail.value, fromid: e.detail.id}); //detail will hold the value being changed
      console.log('fmi handle detail change', this.changeinputs);
      //do step if mode is oneshot
      if (this.isOneshot) setTimeout(this.step.bind(this),100); //do simulation step after 100 ms
    };
    this.handleStart = e => {
      this.startevent(e);
    };
    this.handleStop = e=> {
      this.stopevent(e);
    };
    //this handles event to register inputs - may be sent by subsequent component which change inputs/outputs communicating with fmi
    this.handleRegister = ()=> {
      this.deregisterInputs();
      this.registerInputs();
      if (this.isOneshot) this.step(); //do simulation step immediately;
    }
    this.inst = {};
  }

  registerInputs(){
    if (this.inputs) { //register DOM elements to listen to their 'change' event directly
      let inputparts = this.inputs.split(';'); //splits groups delimited by ;
      this.inputreferences = [];
      for (let inputpart of inputparts) {
        let myinputs = inputpart.split(','); //splits reference and id by ,
        let numerator = (myinputs.length > 2) ? parseFloat(myinputs[2]) : 1;
        let denominator = (myinputs.length > 3) ? parseFloat(myinputs[3]) : 1;
        let addconst = (myinputs.length > 4) ? parseFloat(myinputs[4]) : 0;
        let fixedsignature = (myinputs.length > 5) ? (myinputs[5] === 'f') : false;
        if (isNaN(addconst)) {
          addconst = 0;
          fixedsignature = myinputs[4] === 'f';
        } //fixes bug, setting  instead of NaN, when 4th param is omited and instead 'f' or 't' is specified
        let inputref = {ref: myinputs[1], numerator: numerator, denominator: denominator, addconst: addconst, fixed: fixedsignature};
        if (this.inputreferences[myinputs[0]]) {
          this.inputreferences[myinputs[0]].fixed = this.inputreferences[myinputs[0]].fixed || fixedsignature;
          this.inputreferences[myinputs[0]].refs.push(inputref); //first is id second is reference
        }
          else
            this.inputreferences[myinputs[0]] = {fixed:fixedsignature,refs:[inputref]}; //first is id second is reference
        //register change event - the alteration is commited
        let dependentEl = document.getElementById(myinputs[0]);
        //now register 'change' event or eventlisten
        if (dependentEl) dependentEl.addEventListener(this.eventlisten, this.handleValueChange);
        else console.warn('cannot register changes for non-existing element id:', myinputs[0]);
        console.log('registering input, ref, num,den,add,fixed', myinputs[0], myinputs[1], numerator, denominator, addconst, fixedsignature);
      }
    }
    if (this.otherinputs) {
      let otherinputtargets = this.otherinputs.split(';');
      for (let target of otherinputtargets) {
        document.getElementById(target).addEventListener('fmiinput', this.handleDetailChange);
      }
    }
    //if oneshot - do step
    if (this.isOneshot) {
      //console.log('oneshot scheduling startevent in promise() to do step()')
      setTimeout(this.sendStartEvent.bind(this),1000);
      console.log('oneshot scheduling promise() to do step()')
      setTimeout(this.step.bind(this),1500);
    } //do simulation step after 100 ms
  }

  deregisterInputs() {
    //do removeListeners()
    if (this.inputs) {
      let inputparts = this.inputs.split(';');
      for (let inputpart of inputparts) {
        let myinputs = inputpart.split(',');
        try {
          document.getElementById(myinputs[0]).removeEventListener(this.eventlisten, this.handleValueChange);
        } catch (e) { }

      }
    }
    if (this.otherinputs) {
      let otherinputtargets = this.otherinputs.split(';');
      for (let target of otherinputtargets) {
        try {
          document.getElementById(target).removeEventListener('fmiinput', this.handleDetailChange);
        } catch (e) { }
      }
    }
  }

  attached() {
    console.log('fmi attached');
    this.mydata = [0, 0];
    //split references by ,
    this.references = this.valuereferences.split(',');

    this.registerInputs();

    //if src is not specified - then expects that fmi scripts is loaded in HTML page prior thus should be available
    if (this.src && this.src.length > 0) {
      console.log('loading script first, then init fmi');
      //keep 'this' reference in global for callback
      window.thisfmi = this;
      this.getScript(this.src, this.initfmi);
    } else { //src is specified, thus load it - browser loads it at the end, thus adding the rest as callback after loaded
      console.log('init fmi without loading script: fminame, this:', this.fminame, this);
      this.initfmi();
    }

    if (this.controlid) {
      document.getElementById(this.controlid).addEventListener('fmistart', this.handleStart);
      document.getElementById(this.controlid).addEventListener('fmistop', this.handleStop);
    }

    if (typeof this.showcontrols === 'string') {
      this.showcontrols = (this.showcontrols === 'true');
    }
    document.addEventListener('fmiregister',this.handleRegister);
    //sending attached event - some may detect it to register it's outpu listener if attached before
    let event = new CustomEvent('fmiattached');
    document.dispatchEvent(event);
  }

  //detects whether script with FMU is already loaded, if not it adds it to DOM and loads
  //get script element and registers 'onload' callback to be called when the script is loaded
  getScript(source, callback) {
    //check whether the script is not already there
    if (Array.from(document.getElementsByTagName('script')).filter(x=> x.getAttribute('src') === source).length > 0) {
      console.log('fmi.getScript() WARNING, script is already added into DOM:', source);
      //do callback?
      if (callback) setTimeout(callback, 0);
      return;
    }
    //console.log('fmi getscript()');
    let script = document.createElement('script');
    let prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onerror = function() {
      if (!script.readyState || /loaded|complete/.test(script.readyState) ) {
        script.onerror = script.onload = script.onreadystatechange = null;
        script = undefined;
        // try to insert script by other app for previewing - scripts might be inserted into DOM
        if (window.editorapi && (typeof window.editorapi.insertScriptById === 'function')) {
          console.log('inserting script by thirdparty api');
          window.editorapi.insertScriptById(source, 'fmiobj');
        }
        //do callback even if isAbort - scripts might be inserted into DOM by another app
        if (callback) setTimeout(callback, 1200);
      }
    };

    script.onload = script.onreadystatechange = function( _, isAbort ) {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
        script.onerror = script.onload = script.onreadystatechange = null;
        script = undefined;
        //do callback - scripts might be inserted into DOM by another app
        if (!isAbort && callback) setTimeout(callback, 0);
      }
    };

    script.src = window.bdlBaseHref ? window.bdlBaseHref + source : source;
    prior.parentNode.insertBefore(script, prior);
  }

  //make inst object globally - in case of globals (non-src) declaration
  initfmi() {
    let that = {};
    if (window.thisfmi) {
      that.fminame = window.thisfmi.fminame;
      console.log('using global fmi initfmi() fminame', that.fminame );
    } else {
      that.fminame = this.fminame;
      console.log('using local fmi initfmi() fminame', that.fminame );
    }

    //create instance
    let myinst = window[that.fminame]();
    //EMSDK v 3.x compiles fmu to Promise based api
    if (myinst instanceof Promise) {
      myinst.then(inst => {
        that.inst = inst;
        if (!window.fmiinst) { window.fmiinst = [];}
        window.fmiinst[that.fminame] = that;
        //console.log('fmi callback from Promise that', that, that.inst);
        //do one step if mode is oneshot
        //https://newbedev.com/pass-correct-this-context-to-settimeout-callback
        if (window.thisfmi.isOneshot) {
          //console.log('oneshot scheduling startevent in promise() to do step()')
          setTimeout(window.thisfmi.sendStartEvent.bind(window.thisfmi),1000);
          console.log('oneshot scheduling promise() to do step()')
          setTimeout(window.thisfmi.step.bind(window.thisfmi),1500);
        } //do simulation step after 100 ms
      });
    } else { //older EMSDK prior 3.x compiles directly to api, keep compatibility
      that.inst = myinst;
      if (!window.fmiinst) { window.fmiinst = [];}
      window.fmiinst[that.fminame] = that;
      //console.log('fmi callback that, that.inst', that, that.inst);
      //do one step if mode is oneshot
      //https://newbedev.com/pass-correct-this-context-to-settimeout-callback
      if (window.thisfmi.isOneshot) {
        console.log('oneshot scheduling direct(nopromise) to do step()')
        setTimeout(window.thisfmi.sendStartEvent.bind(window.thisfmi),1000)
        setTimeout(window.thisfmi.step.bind(window.thisfmi),1500);
      } //do simulation step after 100 ms
    }
  }

  bind() {
    this.isOneshot = this.mode === 'oneshot';
    if (this.isOneshot) {
      this.showcontrols = false;
    }
    if (typeof this.stoptime === 'string') {
      this.stoptime=parseInt(this.stoptime);
    }
    if (typeof this.stepsperframee === 'string') {
      this.stepsperframe=parseInt(this.stepsperframe);
    }
  }

  detached() {
    document.removeEventListener('fmiregister',this.handleRegister);
    if (this.animationstarted) {this.startstop();}
    this.deregisterInputs();
    if (this.controlid) {
      document.getElementById(this.controlid).removeEventListener('fmistart', this.handleStart);
      document.getElementById(this.controlid).removeEventListener('fmistop', this.handleStop);
    }
  }

  /**
   * Implements a rudimentary browser console logger for the FMU.
   */
  consoleLogger(componentEnvironment, instanceName, status, category, message, other) {
    /* Fills variables into message returned by the FMU, the C way */
    const formatMessage = (message1, other1) => {
      // get a new pointer
      let ptr = this.inst._malloc(1);
      // get the size of the resulting formated message
      let num = this.inst._snprintf(ptr, 0, message1, other1);
      this.inst._free(ptr);
      num++; // TODO: Error handling num < 0
      ptr = this.inst._malloc(num);
      this.inst._snprintf(ptr, num, message1, other1);

      // return pointer to the resulting message string
      return ptr;
    };

    // eslint-disable-next-line new-cap
    console.log('FMU(' + this.inst.UTF8ToString(instanceName) +  ':' + status + ':' + this.inst.UTF8ToString(category) + ') msg: ' + this.inst.UTF8ToString(formatMessage(message, other))
    );
    this.inst._free(formatMessage);
  }

  initialize() {
    console.log('fmi initialize()');
    this.fmiEnterInit(this.fmiinst);
    this.fmiExitInit(this.fmiinst);
  }

  instantiate() {
    //first define FMI API function names;
    const sReset = 'fmi2Reset';
    const sInstantiate = 'fmi2Instantiate';
    const sSetup = 'fmi2SetupExperiment';
    const sEnterinit = 'fmi2EnterInitializationMode';
    const sExitinit = 'fmi2ExitInitializationMode';
    const sSetreal = 'fmi2SetReal';
    const sSetboolean = 'fmi2SetBoolean';
    const sGetreal = 'fmi2GetReal';
    const sGetboolean = 'fmi2GetBoolean';
    const sDostep = 'fmi2DoStep';
    const sCreateCallback = 'createFmi2CallbackFunctions';
    this.stepTime = 0;
    this.stepSize = (typeof(this.fstepsize) === 'string' ) ? parseFloat(this.fstepsize) : this.fstepsize;
    this.mystep = this.stepSize;
    //console callback ptr, per emsripten create int ptr with signature viiiiii
    if (window.fmiinst) this.inst = window.fmiinst[this.fminame].inst;
    //else this.inst = null;//if (window.thisfmi) {this.inst = window.thisfmi.inst;}

    console.log('instantiate() this.inst', this.inst);
    //set the fminame and JS WASM function references
    let separator = '_';
    let prefix = this.fminame;
    //console.log('attached fminame:', that.fminame);
    // OpenModelica exports function names without prefix
    if (typeof this.inst._fmi2GetVersion === 'function') {
      prefix = '';
      separator = '';
    }
    //now use a 'cwrap' delivered by emscripten to facilitate calling C functions with C primitives (string,number) from Javascript
    this.fmiCreateCallback = this.inst.cwrap(sCreateCallback, 'number', ['number']);
    this.fmiReset = this.inst.cwrap(prefix + separator + sReset, 'number', ['number']);
    this.fmiInstantiate = this.inst.cwrap(prefix + separator + sInstantiate, 'number', ['string', 'number', 'string', 'string', 'number', 'number', 'number']);
    this.fmiSetup = this.inst.cwrap(prefix + separator + sSetup, 'number', ['number', 'number', 'number', 'number', 'number', 'number']);
    this.fmiEnterInit = this.inst.cwrap(prefix + separator + sEnterinit, 'number', ['number']);
    this.fmiExitInit = this.inst.cwrap(prefix + separator + sExitinit, 'number', ['number']);
    this.fmiSetReal = this.inst.cwrap(prefix + separator + sSetreal, 'number', ['number', 'number', 'number', 'number']);
    this.fmiGetReal = this.inst.cwrap(prefix + separator + sGetreal, 'number', ['number', 'number', 'number', 'number']);
    this.fmiSetBoolean = this.inst.cwrap(prefix + separator + sSetboolean, 'number', ['number', 'number', 'number', 'number']);
    this.fmiGetBoolean = this.inst.cwrap(prefix + separator + sGetboolean, 'number', ['number', 'number', 'number', 'number']);
    this.fmiDoStep = this.inst.cwrap(prefix + separator + sDostep, 'number', ['number', 'number', 'number', 'number']);
    this.fmiGetVersion = this.inst.cwrap(prefix + separator + 'fmi2GetVersion', 'string');
    this.fmiGetTypesPlatform = this.inst.cwrap(prefix + separator + 'fmi2GetTypesPlatform', 'string');
    this.fmi2FreeInstance = this.inst.cwrap(prefix + separator + 'fmi2FreeInstance', 'number', ['number']);
    this.instantiated = false;
    //calculate pow, power of stepsize
    this.pow = this.stepSize < 1 ? -Math.ceil(-Math.log10(this.stepSize)) : Math.ceil(Math.log10(this.stepSize)); //use Math.trunc ??
    //console.log('instantiate() this', this);
    this.consoleLoggerPtr = this.inst.addFunction(this.consoleLogger.bind(this), 'viiiiii');
    this.callbackptr = this.fmiCreateCallback(this.consoleLoggerPtr);
    //console.log('fminame',this.fminame);
    //console.log('guid',this.guid);
    //console.log('callbackptr',this.callbackptr);
    //console.log('fmiinstantiate fnc:',this.fmiInstantiate);
    //create instance of model simulation
    this.fmiinst = this.fmiInstantiate(this.fminame, this.cosimulation, this.guid, '', this.callbackptr, 0, 0); //last 1 debug, 0 nodebug
    this.setupExperiment();
  }

  setupExperiment() {
    //setup experiment
    this.fmiSetup(this.fmiinst, 1, this.tolerance, this.starttime, 0);
    console.log('setupExperiment() fmiinst', this.fmiinst);
    this.instantiated = true;
  }

  simulate() {}

  setReal(query, value, count) {
    console.log('setreal query,value,count', query, value, count);
    return this.fmiSetReal(this.fmiinst, query.byteOffset, count, value.byteOffset);
  }

  setBoolean(query, value, count) {
    return this.fmiSetBoolean(this.fmiinst, query.byteOffset, count, value.byteOffset);
  }

  /**
   * Loads Reals from FMU
   */
  getReal(query, output, count) {
    return this.fmiGetReal(this.fmiinst, query.byteOffset, count, output.byteOffset);
  }

  /**
   * Loads Booleans from FMU
   */
  getBoolean(query, output, count) {
    return this.fmiGetBoolean(this.fmiinst, query.byteOffset, count, output.byteOffset);
  }

  startevent(e) {
    console.log('fmi startevent recieved', e);
    if (!this.animationstarted) this.startSimulation();
  }

  stopevent(e) {
    console.log('fmi stopevent recieved', e);
    if (this.animationstarted) this.stopSimulation();
  }

  //action to be performed when clicking the play/pause button
  //sends fmistart/fmistop event and starts/stops simulation
  startstop() {
    if (this.animationstarted) {
      this.stopSimulation();
      this.sendStopEvent();
      this.perfend();
    } else {
      this.perfstart();
      this.sendStartEvent();
      this.startSimulation();
    }
  }

  //defines action to be done during browser animationframe and starts
  startSimulation() {
    this.animationstarted = true;
    this.fpsInterval = 1000 / (isNaN(this.fpslimit) ? parseInt(this.fpslimit, 10) : this.fpslimit);
    this.then = window.performance.now();
    const performAnimation = (newtime) => {
      if (!this.animationstarted) return;
      this.request = requestAnimationFrame(performAnimation);
      if (this.fpslimit && (this.fpslimit < 60)) {
        if (isNaN(this.fpslimit)) this.fpslimit = parseInt(this.fpslimit, 10);
        this.now = newtime;
        //console.log('limiting fps to fpslimit, newtime, now, then, fpsinterval', this.fpslimit, newtime, this.now, this.then, this.fpsInterval);
        this.elapsed = this.now - this.then;
        //console.log('elapsed,fpsinterval', this.elapsed, this.fpsInterval);
        if (this.elapsed > this.fpsInterval) {
          this.then = this.now - (this.elapsed % this.fpsInterval);
          this.step();
        }
      } else {
        for (let i =0;i<this.stepsperframe;i++) this.step();
      }
    };
    performAnimation();
  }

  //cancels all action to be done during browser animationframe and starts
  stopSimulation() {
    //stop animation
    this.animationstarted = false;
    cancelAnimationFrame(this.request);
  }

  //sends fmistop event
  sendStopEvent() {
    //create custom event
    let event = new CustomEvent('fmistop', {detail: {time: this.round(this.stepTime, this.pow)}});
    //dispatch event - it should be listened by some other component
    document.getElementById(this.id).dispatchEvent(event);
  }

  sendStartEvent() {
    //create custom event
    console.log('fmi.sendStartEvent(). Sending start event for adobeobj');
    let event = new CustomEvent('fmistart', {detail: {time: this.round(this.stepTime, this.pow)}});
    //dispatch event - it should be listened by some other component
    document.getElementById(this.id).dispatchEvent(event);
    //animate using requestAnimationFrame
  }

  round(value, decimals) {
    if (decimals < 0) {let posdecimals = -decimals; return Number(Math.round(value + 'e' + posdecimals) + 'e-' + posdecimals);}
    return Number(Math.round(value + 'e-' + decimals) + 'e+' + decimals);
  }

  step() {
    //this = window.thisfmi;
    //primitive semaphore, only one instance can perform this call
    if (!this.doingstep) {
      console.log('fmu step()');
      this.doingstep = true;

      try {
      if (!this.instantiated) {
        this.instantiate();
        this.initialize();
      }
      this.stepi++;

      //changeinputs
      if (this.resetBeforeChange) {
        //fmi call
        this.setupExperiment();
        //do reset
        this.fmiReset(this.fmiinst);
        //setting fixed parameters are now allowed
        this.setInputVariables();
        //initialize
        this.initialize();
        //make big step from 0 to current stepTime ???
        //const res =
        //make big step only if it is not oneshot
        if (!this.isOneshot) this.fmiDoStep(this.fmiinst, 0, this.stepTime, 1);
        else this.stepTime = 0;
        //reset the signature
        this.resetBeforeChange = false;
      } else {
        //do only change of variables
        this.setInputVariables();
      }
      //dostep
      //compute step to round the desired time
      const res = this.fmiDoStep(this.fmiinst, this.stepTime, this.mystep, 1);
      this.stepTime = this.stepTime + this.mystep;
      this.mystep = this.stepSize; //update correction step to current step
      if (res === 1 || res === 2) {
        console.warn('step() returned state<>0, doing reset()', res);
        this.fmiReset(this.fmiinst);
        this.initialize();
      }

      //distribute simulation data to listeners
      this.mydata = this.getReals(this.references);

      //create custom event
      let event = new CustomEvent('fmidata', {detail: {time: this.round(this.stepTime, this.pow), data: this.mydata}});
      //dispatch event - it should be listened by some other component
      document.getElementById(this.id).dispatchEvent(event);
      //compute showtime
      if (this.showtime) this.simulationtime = this.secondsToTime(this.stepTime, this.showtimemultiply);
      //do computation only every tickstoupdate tick
      if (this.measurefps) {
        if (this.fpstick === 0) {
          this.startfpstime = window.performance.now();
        }
        this.fpstick++;
        if (this.fpstick >= this.ticksToUpdate) {
          this.fpsInterval = 1000 / (isNaN(this.fpslimit) ? parseInt(this.fpslimit, 10) : this.fpslimit);
          //update ticks - so it will be every 3 seconds
          this.ticksToUpdate = Math.round(3000 / this.fpsInterval);
          //do correction step calculation
          if (this.stepSize < 1) {
            this.pow = -Math.ceil(-Math.log10(this.stepSize));
          } else {
            this.pow = Math.ceil(Math.log10(this.stepSize));
          }
          this.mystep = this.round(this.stepTime + this.stepSize, this.pow) - this.stepTime;
          //do fps calculation
          this.fps = (1000 * this.ticksToUpdate / (window.performance.now() - this.startfpstime)).toPrecision(4);
          this.fpstick = 0;
        }
      }
      //stop simulation when stoptime is defined and reached
      if (this.stoptime>0 && this.animationstarted && this.stoptime<this.stepTime) {
          this.startstop();
        }
    } catch (err) {
        console.error('error catched during fmu step',err);
      }
      finally {
        this.doingstep = false;
      }
    }
  }

  setInputVariables() {
    if (this.changeinputs.length > 0) {
      while (this.changeinputs.length > 0) {
        let myinputs = this.changeinputs.shift(); //remove first item
        //console.log('changing inputs', myinputs);
        //set real - reference is in - one input one reference
        //sets individual values - if id is in input, then reference is taken from inputs definition
        console.log('changing inputs,id,value', this.inputreferences, myinputs.id, myinputs.value);
        for (let iref of this.inputreferences[myinputs.id].refs) {
          let normalizedvalue = myinputs.value * iref.numerator / iref.denominator + iref.addconst;
          if (myinputs.id) this.setSingleReal(iref.ref, normalizedvalue);
          // if reference is in input, then it is set directly
          else if (myinputs.valuereference) this.setSingleReal(myinputs.valuereference, normalizedvalue);
        }
      }
      //flush all in one call to fmi
      this.flushRealQueue();
    }
  }

  reset() {
    this.stepTime = 0;
    this.stepSize = (typeof(this.fstepsize) === 'string' ) ? parseFloat(this.fstepsize) : this.fstepsize;
    this.mystep = this.stepSize;
    this.setupExperiment();
    this.fmiReset(this.fmiinst);
    //set input variables for possible change of non-tunable - fixed parameter values
    this.setInputVariables();
    this.initialize();
    //create custom event
    let event = new CustomEvent('fmireset');
    //dispatch event - it should be listened by some other component
    document.getElementById(this.id).dispatchEvent(event);
  }

  /* routines to alloc buffer for getting/setting from fmi*/
  createBuffer(arr) {
    let size = arr.length * arr.BYTES_PER_ELEMENT;
    let ptr = this.inst._malloc(size);
    return { ptr, size };
  }

  createAndFillBuffer(arr) {
    const buffer = this.createBuffer(arr);
    this.fillBuffer(buffer, arr);
    return buffer;
  }

  freeBuffer(buffer) {
    if (buffer.ptr !== null) {
      this.inst._free(buffer.ptr);
    }
    buffer.ptr = null;
    buffer.size = null;
  }

  viewBuffer(buffer) {
    return new Uint8Array(this.inst.HEAPU8.buffer, buffer.ptr, buffer.size);
  }

  fillBuffer(buffer, arr) {
    const view = this.viewBuffer(buffer);
    view.set(new Uint8Array(arr.buffer));
    return buffer;
  }

  getReals(references) {
    const queryBuffer = this.createAndFillBuffer(new Int32Array(references));
    const query = this.viewBuffer(queryBuffer);
    const outputBuffer = this.createBuffer(new Float64Array(references.length));
    const output = this.viewBuffer(outputBuffer);

    this.getReal(query, output, references.length);

    const real = new Float64Array(output.buffer, output.byteOffset, references.length);

    this.freeBuffer(queryBuffer);
    this.freeBuffer(outputBuffer);
    return real;
  }

  getSingleReal(reference) {
    const queryBuffer = this.createAndFillBuffer(new Int32Array([reference]));
    const query = this.viewBuffer(queryBuffer);
    const outputBuffer = this.createBuffer(new Float64Array(1));
    const output = this.viewBuffer(outputBuffer);

    this.getReal(query, output, 1);

    const real = new Float64Array(output.buffer, output.byteOffset, 1);

    this.freeBuffer(queryBuffer);
    this.freeBuffer(outputBuffer);
    return real[0];
  }

  /**
     * Adds a real value to setRealQueue
     */
  setSingleReal(reference, value) {
    console.log('setSingleReal reference,value', reference, value);
    if (!this.setRealQueue) {
      this.setRealQueue = {
        references: [],
        values: []
      };
    }
    this.setRealQueue.references.push(reference);
    this.setRealQueue.values.push(value);
  }

  flushRealQueue() {
    if (this.setRealQueue) {
      const referenceBuffer = this.createAndFillBuffer(new Int32Array(this.setRealQueue.references));
      const references = this.viewBuffer(referenceBuffer);
      const valueBuffer = this.createAndFillBuffer(new Float64Array(this.setRealQueue.values));
      const values = this.viewBuffer(valueBuffer);

      this.setReal(references, values, this.setRealQueue.references.length);
      this.freeBuffer(referenceBuffer);
      this.freeBuffer(valueBuffer);

      this.setRealQueue = false;
    }
  }

  flushBooleanQueue() {
    if (this.setBooleanQueue) {
      const referenceBuffer = this.createAndFillBuffer(new Int32Array(this.setBooleanQueue.references));
      const references = this.viewBuffer(referenceBuffer);
      const valueBuffer = this.createAndFillBuffer(new Int32Array(this.setBooleanQueue.values));
      const values = this.viewBuffer(valueBuffer);

      this.setBoolean(references, values, this.setBooleanQueue.references.length);
      this.freeBuffer(referenceBuffer);
      this.freeBuffer(valueBuffer);

      this.setBooleanQueue = false;
    }
  }

  /**
     */
  setSingleBoolean(reference, value) {
    if (!this.setBooleanQueue) {
      this.setBooleanQueue = {
        references: [],
        values: []
      };
    }
    this.setBooleanQueue.references.push(reference);
    this.setBooleanQueue.values.push(value);
  }

  /**
     * Loads a single boolean value based on reference, this is a shorthand function.
     * It is recommended to use Module.getBoolean with reusable mallocs.
     */
  getSingleBoolean(reference) {
    const queryBuffer = this.createAndFillBuffer(new Int32Array([reference]));
    const query = this.viewBuffer(queryBuffer);
    const outputBuffer = this.createBuffer(new Int32Array(1));
    const output = this.viewBuffer(outputBuffer);
    this.getBoolean(query, output, 1);
    const bool = new Int32Array(output.buffer, output.byteOffset, 1);
    this.freeBuffer(queryBuffer);
    this.freeBuffer(outputBuffer);
    return bool[0];
  }
  getBooleans(references) {
    const queryBuffer = this.createAndFillBuffer(new Int32Array(references));
    const query = this.viewBuffer(queryBuffer);
    const outputBuffer = this.createBuffer(new Int32Array(references.length));
    const output = this.viewBuffer(outputBuffer);
    this.getBoolean(query, output, references.length);
    const bool = new Int32Array(output.buffer, output.byteOffset, references.length);
    this.freeBuffer(queryBuffer);
    this.freeBuffer(outputBuffer);
    return bool;
  }

  secondsToTime(sec, multiply = 1) {
    let x = Math.floor(sec * multiply);
    let seconds = Math.floor(x % 60).toString().padStart(2, '0');
    x /= 60;
    let minutes = Math.floor(x % 60).toString().padStart(2, '0');
    x /= 60;
    let hours = Math.floor(x % 24).toString().padStart(2, '0');
    x /= 24;
    let days = Math.floor(x);
    return ' ' + days + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  perfstartTime;
  perfendTime;

  perfstart() {
    this.perfstartTime = new Date();
  };

  //outputs how many s the simulation was performed - at the end of simulation, good to measure performance
  perfend() {
    this.perfendTime = new Date();
    var timeDiff = this.perfendTime - this.perfstartTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    // get seconds
    console.warn("Simulation took "+ timeDiff + " seconds");
  }
}
