import {bindable} from 'aurelia-framework';
import 'latest-createjs';

export class AnimateAdobeSs {
  @bindable src;
  @bindable width=800;
  @bindable height=600;
  @bindable name;//="ZelezoCelek"
  //@bindable cid;//="3CC81150E735AE4485D4B0DF526EB8B4";

  constructor(){}
  bind(){}
  attached(){
    //let that = this;
    let continueAfter = () => {
      if (typeof createjs === 'undefined') console.log('WARN: createjs not present,loading script manually not supported yet.');

      //if (!window.createjs) window.createjs = createjs;
      //make this component global - due to further calls
      //this.bindings = [];
      //window.ani = that;
      //detects and if not present - adds script with JS into DOM - so browser will load it, after that, initAdobe() will be called
      this.getScript(this.src, this.init.bind(this));
      //this.ratio = this.width / this.height;
      //window.addEventListener('resize', this.handleResize);
      //this.init();
    };

    //check global instance of createjs - if not present wait 500 ms
    if (typeof createjs === 'undefined') {
      console.log('INFO: waiting 1000ms for createjs ');
      setTimeout(() => continueAfter.bind(this), 1000);
    } else continueAfter();

  }
  init(){
    //canvas = document.getElementById("canvas");
    //anim_container = document.getElementById("animation_container");
    //dom_overlay_container = document.getElementById("dom_overlay_container");
    let cid = Object.keys(AdobeAn.compositions)[0];
    let comp=AdobeAn.getComposition(cid);
    this.lib=comp.getLibrary();
    let loader = new createjs.LoadQueue(false);
    loader.installPlugin(createjs.Sound);
    loader.addEventListener("fileload", function(evt){this.handleFileLoad(evt,comp)}.bind(this));
    loader.addEventListener("complete", function(evt){this.handleComplete(evt,comp)}.bind(this));
    //var lib=comp.getLibrary();
    loader.loadManifest(this.lib.properties.manifest);
  }

  handleFileLoad(evt, comp) {
    var images=comp.getImages();
    if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }
  }
  handleComplete(evt,comp) {
    //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
    //var lib=comp.getLibrary();
    let ss=comp.getSpriteSheet();
    let queue = evt.target;
    let ssMetadata = this.lib.ssMetadata;
    for(let i=0; i<ssMetadata.length; i++) {
      ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
    }
    let keys = Object.keys(this.lib);
    console.log('animate adobe ss lib keys:',keys);
    console.log('animate adobe ss name to be initialized:',this.name);
    //fix '_' before object name
    let exportRoot = new this.lib['_'+this.name]();//new lib._04_Fe_výskyt_HTML5Canvas();
    let stage = new this.lib.Stage(this.canvas);
    //Registers the "tick" event listener.
    let fnStartAnimation = function() {
      stage.addChild(exportRoot);
      createjs.Ticker.setFPS(this.lib.properties.fps);
      createjs.Ticker.addEventListener("tick", stage);
    }
    //Code to support hidpi screens and responsive scaling.
    AdobeAn.makeResponsive(false,'both',false,1,[this.canvas,this.anim_container,this.dom_overlay_container]);
    AdobeAn.compositionLoaded(this.lib.properties.id);
    fnStartAnimation();
  }

  playSound(id, loop) {
    return createjs.Sound.play(id, createjs.Sound.INTERRUPT_EARLY, 0, 0, loop);
  }

  //get script element and registers 'onload' callback to be called when the script is loaded
  getScript(source, callback) {
    //check whether the script is not already there
    if (Array.from(document.getElementsByTagName('script')).filter(x=> x.getAttribute('src') === source).length > 0) {
      console.warn('AnimateAdobe.getScript() WARNING, script is already added into DOM:', source);
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
          //disable previoues definition
          window.ani.destroyAdobe();
          //enable current def
          //console.log('inserting script by thirdparty api');
          window.editorapi.insertScriptById(source, 'adobeobj')
            .then(innerscript => {
              //console.log('third party script node', innerscript);
              try {
                // eslint-disable-next-line no-eval
                eval(innerscript.innerHTML);
              } catch (e) {
                console.warn('Error during evaluation of adobe script. Probably OK to ignore', e.message);
              }
              if (callback) setTimeout(callback, 1000);
            });
        }
        // do callback after 2s
        //if (callback) setTimeout(callback, 1000);
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

}
