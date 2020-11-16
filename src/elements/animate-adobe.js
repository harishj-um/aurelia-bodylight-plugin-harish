import {bindable} from 'aurelia-framework';
import * as createjs from 'createjs-module';

/**
 * Exposes animation exported from Adobe Animate to JS CreateJS
 *
 */
export class AnimateAdobe {
    @bindable src;
    @bindable width=800;
    @bindable height=600;
    @bindable name;//="ZelezoCelek"
    @bindable cid;//="3CC81150E735AE4485D4B0DF526EB8B4";
    @bindable fromid;
    animationstarted = false;

    constructor() {
      //        console.log('animate-adobe constructor()');
      this.handleValueChange = e => {
        this.handleData(e);
      };
    }

    /**
     * adds listeners to the component 'fromid' and listens to following
     * 'animatestart' starts all animation
     * 'animatestop' stops all animation
     * 'fmidata' handles data and per bind2animation structure sets animation value
     */
    bind() {
      if (this.fromid) {
        let fromel = document.getElementById(this.fromid);
        if (fromel) {
          fromel.addEventListener('animatestart', this.startAllAnimation);
          fromel.addEventListener('animatestop', this.stopAllAnimation);
          fromel.addEventListener('fmidata', this.handleValueChange);
          fromel.addEventListener('fmistart', this.enableAnimation);
          fromel.addEventListener('fmistop', this.disableAnimation);
        } else {
          console.error('adobe-animate component cannot find control element with id:', this.fromid);
        }
      }
    }
    attached() {
      //this.adobecanvas = document.getElementById("canvas");
      //this.anim_container = document.getElementById("animation_container");
      //this.dom_overlay_container = document.getElementById("dom_overlay_container");
      //      console.log('animate-adobe attached() window.ani.adobecanvas,window.ani.anim_container,window.ani.dom_overlay_container',this.adobecanvas,this.anim_container,this.dom_overlay_container);
      //set global instance of createjs
      if (!window.createjs) window.createjs = createjs;
      //make this component global - due to further calls
      this.bindings = [];
      window.ani = this;
      //adds script in src attribute into DOM - so browser will load it, after that, initAdobe() will be called
      this.getScript(this.src, this.initAdobe);
      this.ratio = this.width / this.height;
      //window.addEventListener('resize', this.handleResize);
    }

    makeResponsive(isResp, respDim, isScale, scaleType, domContainers) {
      //let lastW; let lastH; let lastS = 1;
      window.addEventListener('resize', window.ani.handleResize);
      window.ani.isResp=isResp;
      window.ani.respDim = respDim;
      window.ani.isScale = isScale;
      window.ani.scaleType= scaleType;
      window.ani.domContainers = domContainers;
      window.ani.handleResize();
    }

    handleResize() {
      let w = window.ani.lib.properties.width; let h = window.ani.lib.properties.height;
      let iw = window.innerWidth;
      let ih = window.innerHeight;
      if (window.ani.adobecanvas && window.ani.adobecanvas.parentElement && window.ani.adobecanvas.parentElement.parentElement && window.ani.adobecanvas.parentElement.parentElement.parentElement) {
        iw = window.ani.adobecanvas.parentElement.parentElement.parentElement.offsetWidth;
        ih = window.ani.adobecanvas.parentElement.parentElement.parentElement.offsetHeight;
      }
      ih = iw / ( w / h );
      //let iw = window.innerWidth; let ih = window.innerHeight;
      let pRatio = window.devicePixelRatio || 1; let xRatio = iw / w; let yRatio = ih / h; let sRatio = 1;
      if (window.ani.isResp) {
        if ((window.ani.respDim === 'width' && window.ani.lastW === iw) || (window.ani.respDim === 'height' && window.ani.lastH === ih)) {
          sRatio = window.ani.lastS;
        } else if (!window.ani.isScale) {
          if (iw < w || ih < h) {sRatio = Math.min(xRatio, yRatio);}
        } else if (window.ani.scaleType === 1) {
          sRatio = Math.min(xRatio, yRatio);
        } else if (window.ani.scaleType === 2) {
          sRatio = Math.max(xRatio, yRatio);
        }
      }
        window.ani.domContainers[0].width = w * pRatio * sRatio;
        window.ani.domContainers[0].height = h * pRatio * sRatio;
        window.ani.domContainers.forEach(function(container) {
        container.style.width = w * sRatio + 'px';
        container.style.height = h * sRatio + 'px';
      });
      window.ani.stage.scaleX = pRatio * sRatio;
      window.ani.stage.scaleY = pRatio * sRatio;
      window.ani.lastW = iw; window.ani.lastH = ih; window.ani.lastS = sRatio;
      window.ani.stage.tickOnUpdate = false;
      window.ani.stage.update();
      window.ani.stage.tickOnUpdate = true;
    }

    //handleResize(); // First draw
    detached() {
      //stop animation
      this.disableAnimation();
      //remove script
      this.removeScript(this.src);
      //destroy bindings
      this.bindings = [];
      //remove listeners
      let fromel = document.getElementById(this.fromid);
      if (fromel) {
        fromel.removeEventListener('animatestart', this.startAllAnimation);
        fromel.removeEventListener('animatestop', this.stopAllAnimation);
        fromel.removeEventListener('fmidata', this.handleValueChange);
        fromel.removeEventListener('fmistart', this.enableAnimation);
        fromel.removeEventListener('fmistop', this.disableAnimation);
      }
    }

    removeScript(source) {
      let src = window.bdlBaseHref ? window.bdlBaseHref + source : source;
      let tags = document.getElementsByTagName('script');
      for (let i = tags.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (tags[i] && tags[i].getAttribute('src') !== null && tags[i].getAttribute('src').indexOf(src) !== -1) {tags[i].parentNode.removeChild(tags[i]);} //remove element by calling parentNode.removeChild()
      }
    }

    //get script element and registers 'onload' callback to be called when the script is loaded
    getScript(source, callback) {
      //check whether the script is not already there
      if (Array.from(document.getElementsByTagName('script')).filter(x=> x.getAttribute('src') === source).length > 0) {
        console.log('AnimateAdobe.getScript() WARNING, script is already added into DOM:', source);
        //do callback?
        if (callback) setTimeout(callback, 0);
        return;
      }
      //console.log('animateadobe getscript()');
      let script = document.createElement('script');
      let prior = document.getElementsByTagName('script')[0];
      script.async = 1;
      //set that after onload a callback will be executed
      script.onerror = function() {
        if (!script.readyState || /loaded|complete/.test(script.readyState) ) {
          script.onerror = script.onload = script.onreadystatechange = null;
          script = undefined;
          // try to insert script by other app for previewing - scripts might be inserted into DOM
          if (window.editorapi && (typeof window.editorapi.insertScriptById === 'function')) {
            console.log('inserting script by thirdparty api');
            window.editorapi.insertScriptById(source);
          }
          // do callback after 1s
          if (callback) setTimeout(callback, 1000);
        }
      };
      script.onload = script.onreadystatechange = function( _, isAbort ) {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
          script.onerror = script.onload = script.onreadystatechange = null;
          script = undefined;

          if (!isAbort && callback) setTimeout(callback, 0);
        }
      };
      //set script source - if base url is defined then base is prefixed
      script.src = window.bdlBaseHref ? window.bdlBaseHref + source : source;
      //add custom animate script into DOM - the onload will be called then
      prior.parentNode.insertBefore(script, prior);
    }

    //this is called after animate script is loaded into DOM, so global AdobeAn is available
    initAdobe() {
      //take the first composition
      if (!window.ani.cid) {
        window.ani.cid = Object.keys(window.AdobeAn.compositions)[0]; //get the first composition
      }
      window.ani.comp = window.AdobeAn.getComposition(window.ani.cid);
      //let lib=comp.getLibrary();

      //get library to manipulate and other components
      window.ani.lib = window.ani.comp.getLibrary();
      window.ani.ss = window.ani.comp.getSpriteSheet();
      window.ani.exportRoot = new window.ani.lib[window.ani.name]();
      //set stage to be bind into ref='adobecanvas' DOM element of this component
      window.ani.stage = new window.ani.lib.Stage(window.ani.adobecanvas);
      window.stage = window.ani.stage;
      //Registers the "tick" event listener.
      let fnStartAnimation = function() {
        window.ani.stage.addChild(window.ani.exportRoot);
        //by default ticker uses setTimeout API, force to use requestAnimationFrame API
        window.createjs.Ticker.timingMode = window.createjs.Ticker.RAF_SYNCHED;
        window.createjs.Ticker.framerate = window.ani.lib.properties.fps;
        //window.createjs.Ticker.addEventListener('tick', window.ani.stage);
        window.ani.enableAnimation();
      };
      //Code to support hidpi screens and responsive scaling.
      //window.AdobeAn.makeResponsive(true, 'both', true, 1, [window.ani.adobecanvas, window.ani.anim_container, window.ani.dom_overlay_container]);
      window.ani.makeResponsive(true, 'both', true, 1, [window.ani.adobecanvas, window.ani.anim_container, window.ani.dom_overlay_container]);
      window.AdobeAn.compositionLoaded(window.ani.lib.properties.id);
      //window.ani.handleResize();
      fnStartAnimation();
      setTimeout(()=>{
        //get all objects from animation
        window.ani.objs = Object.keys(window.ani.exportRoot.children[0]);
        //filter objects by purpose - so it can be bind to model value
        window.ani.animobjs = window.ani.objs.filter(name => name.endsWith('_anim'));
        window.ani.textobjs = window.ani.objs.filter(name => name.endsWith('_text'));
        window.ani.playobjs = window.ani.objs.filter(name => name.endsWith('_play'));
        //stop all animation
        window.ani.stopAllAnimation();
        //disable animation ticker
        window.ani.disableAnimation();
      }, 1000);
    }

    /**
     * starts animation of particular object
     * @param objname
     */
    startAnimation(objname) {
      if (this.exportRoot && this.exportRoot.children[0][objname]) {
        this.exportRoot.children[0][objname].play();
      }
      //this.timeline.addTween(cjs.Tween.get(this.instance).to({alpha:1},159).wait(1));
    }

    /**
     * stops animation of particular object
     * @param objname
     */
    stopAnimation(objname) {
      if (this.exportRoot && this.exportRoot.children[0][objname]) {
        this.exportRoot.children[0][objname].stop();
      }
    }

    /**
     * set the animation value of the object objname
     * @param objname
     * @param value
     */

    setAnimationValue(objname, value) {
      //console.log('adobe-animate() setting window.ani.exportRoot.children[0][' + objname + '].gotoAndStop(' + value + ')');
      if (window.ani.exportRoot) {
        //resolve path from string
        const resolvePath = (object, path, defaultValue) => path
          .split('.')
          .reduce((o, p) => o ? o[p] : defaultValue, object);
        let myobj = resolvePath(window.ani.exportRoot.children[0], objname, undefined);
        if (myobj) myobj.gotoAndStop(Math.floor(value));

        //window.ani.exportRoot.children[0][objname].gotoAndStop(value);
      }
    }

    /**
     * stops all animation
     */
    stopAllAnimation() {
      if (window.ani.stage) {
        window.ani.stage.stop();
      }
    }

    disableAnimation() {
      window.ani.animationstarted = false;
      if (window.ani.stage) {window.createjs.Ticker.removeEventListener('tick', window.ani.stage);}
    }

    enableAnimation() {
      if (window.ani.stage) {window.createjs.Ticker.addEventListener('tick', window.ani.stage);}
      window.ani.animationstarted = true;
    }

    /**
     * starts all animation
     */
    startAllAnimation() {
      if (window.ani.stage) {
        //TODO call removeEventListener and refactor adding listener when animation should start
        if (!window.ani.animationstarted) window.ani.enableAnimation();//window.createjs.Ticker.addEventListener('tick', window.ani.stage);
        window.ani.stage.play();
      }
    }

    /**
     * starts animation for 20 ms and stops it again
     */
    stepAllAnimation() {
      if (window.ani.stage) {
        window.ani.stage.play();
        setTimeout(()=>{window.ani.stage.stop();}, 20);
      }
    }

    /**
     * Sets text content of object in Adobe Animate
     * @param objname
     * @param textvalue
     */
    setText(objname, textvalue) {
      if (window.ani.exportRoot) {
        window.ani.exportRoot.children[0][objname].text = textvalue;
      }
    }

    /**
     * Uses values in e.detail.data and converts them to animation values
     * @param e
     */
    handleData(e) {
      let bindings = window.animatebindings;
      if (!bindings) return;
      for (let binding of bindings) {
        //binding = {findex:findex,aname:aname,amin:amin,amax:amax,fmin:fmin,fmax:fmax}
        let value = e.detail.data[binding.findex];
        if (binding.aname.endsWith('_text')) {
          this.setText(binding.aname, value);
        } else
        if (binding.aname.endsWith('_anim')) {
          let convertedvalue = binding.convertf2a(value);
          this.setAnimationValue(binding.aname, convertedvalue);
        }
      }
    }
}
