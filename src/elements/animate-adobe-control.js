import {bindable} from 'aurelia-templating';
export class AnimateAdobeControl {
    @bindable id;
    animationstarted = false;
    frame = 0;

    startstop() {
      console.log('animateadobecontrol startstop()', this);
      this.animationstarted = ! this.animationstarted;
      let eventname;
      if (this.animationstarted) {
        if (window.ani) window.ani.enableAnimation();
        eventname = 'animatestart';
      }
      else  eventname = 'animatestop';
      let event = new CustomEvent(eventname, {detail: {time: this.frame}}); //send start signal on frame 0
      //dispatch event - it should be listened by some other component
      document.getElementById(this.id).dispatchEvent(event);
    }

    step() {
      if (!this.animationstarted) this.startstop();
      setTimeout(()=>{this.startstop();}, 50);
    }
}
