import {bindable} from "aurelia-framework";
import * as createjs from 'createjs-module';

export class AnimateAdobe {
    @bindable src;
    @bindable width=800;
    @bindable height=600;
    @bindable name;//="ZelezoCelek"
    @bindable cid;//="3CC81150E735AE4485D4B0DF526EB8B4";

    constructor(){
//        console.log('animate-adobe constructor()');
    }
    attached(){
        //this.adobecanvas = document.getElementById("canvas");
        //this.anim_container = document.getElementById("animation_container");
        //this.dom_overlay_container = document.getElementById("dom_overlay_container");
  //      console.log('animate-adobe attached() window.ani.adobecanvas,window.ani.anim_container,window.ani.dom_overlay_container',this.adobecanvas,this.anim_container,this.dom_overlay_container);
        if (!window.createjs) window.createjs = createjs;
        window.ani= this;
        this.getScript(this.src, this.initAdobe);
    }
    //get script element and registers 'onload' callback to be called when the script is loaded
    getScript(source, callback) {
        //console.log('animateadobe getscript()');
        let script = document.createElement('script');
        let prior = document.getElementsByTagName('script')[0];
        script.async = 1;

        script.onload = script.onreadystatechange = function( _, isAbort ) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
                script.onload = script.onreadystatechange = null;
                script = undefined;

                if (!isAbort && callback) setTimeout(callback, 0);
            }
        };

        script.src = window.bdlBaseHref ? window.bdlBaseHref + source : source;
        //console.log('adding custom animate script');
        prior.parentNode.insertBefore(script, prior);
    }

    initAdobe(){
        //console.log('initAdobe() this, window.ani.cid:',this,window.ani.cid);
        if (!window.ani.cid) {
            window.ani.cid = Object.keys(window.AdobeAn.compositions)[0]; //get the first composition
        }
        let comp=window.AdobeAn.getComposition(window.ani.cid);
        //let lib=comp.getLibrary();

        //You can use the variable "stage" after it is created in token create_stage.
        window.ani.lib=comp.getLibrary();
        window.ani.ss=comp.getSpriteSheet();
        window.ani.exportRoot = new window.ani.lib[window.ani.name]();
        window.stage = new window.ani.lib.Stage(window.ani.adobecanvas);
        //Registers the "tick" event listener.
        let fnStartAnimation = function() {
            window.stage.addChild(window.ani.exportRoot);
            //by default ticker uses setTimeout API
            window.createjs.Ticker.timingMode = window.createjs.Ticker.RAF_SYNCHED; //force to use requestAnimationFrame API
            window.createjs.Ticker.framerate = window.ani.lib.properties.fps;
            window.createjs.Ticker.addEventListener("tick", window.stage);
        }
        //Code to support hidpi screens and responsive scaling.
        window.AdobeAn.makeResponsive(false,'both',false,1,[window.ani.adobecanvas,window.ani.anim_container,window.ani.dom_overlay_container]);
        window.AdobeAn.compositionLoaded(window.ani.lib.properties.id);
        fnStartAnimation();
    }

}