import {bindable} from "aurelia-framework";

export class AnimateAdobe {
    @bindable src;
    @bindable width=800;
    @bindable height=600;
    @bindable name;//="ZelezoCelek"
    constructor(){}
    attached(){
        //this.adobecanvas = document.getElementById("canvas");
        //this.anim_container = document.getElementById("animation_container");
        //this.dom_overlay_container = document.getElementById("dom_overlay_container");
        console.log('animate-adobe attached()');
        this.getSript(this.src, this.initAdobe());
    }
    //get script element and registers 'onload' callback to be called when the script is loaded
    getScript(source, callback) {
        console.log('fmi getscript()');
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
        prior.parentNode.insertBefore(script, prior);
    }

    initAdobe(){
        let comp=AdobeAn.getComposition("3CC81150E735AE4485D4B0DF526EB8B4");
        //let lib=comp.getLibrary();

        //You can use the variable "stage" after it is created in token create_stage.
        let lib=comp.getLibrary();
        let ss=comp.getSpriteSheet();
        this.exportRoot = new lib[this.name]();
        this.stage = new lib.Stage(canvas);
        //Registers the "tick" event listener.
        let thatanim = this;
        let fnStartAnimation = function() {
            thatanim.stage.addChild(thatanim.exportRoot);
            createjs.Ticker.setFPS(lib.properties.fps);
            createjs.Ticker.addEventListener("tick", thatanim.stage);
        }
        //Code to support hidpi screens and responsive scaling.
        AdobeAn.makeResponsive(false,'both',false,1,[this.adobecanvas,this.anim_container,this.dom_overlay_container]);
        AdobeAn.compositionLoaded(lib.properties.id);
        fnStartAnimation();

    }

    /*
    var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
    function init() {
        canvas = document.getElementById("canvas");
        anim_container = document.getElementById("animation_container");
        dom_overlay_container = document.getElementById("dom_overlay_container");
        var comp=AdobeAn.getComposition("3CC81150E735AE4485D4B0DF526EB8B4");
        var lib=comp.getLibrary();
        handleComplete({},comp);
    }
    function handleComplete(evt,comp) {
        //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
        var lib=comp.getLibrary();
        var ss=comp.getSpriteSheet();
        exportRoot = new lib.ZelezoCelek();
        stage = new lib.Stage(canvas);
        //Registers the "tick" event listener.
        fnStartAnimation = function() {
            stage.addChild(exportRoot);
            createjs.Ticker.setFPS(lib.properties.fps);
            createjs.Ticker.addEventListener("tick", stage);
        }
        //Code to support hidpi screens and responsive scaling.
        AdobeAn.makeResponsive(false,'both',false,1,[canvas,anim_container,dom_overlay_container]);
        AdobeAn.compositionLoaded(lib.properties.id);
        fnStartAnimation();
    }
     */
}