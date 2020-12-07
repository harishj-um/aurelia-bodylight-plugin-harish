//import {Markdownnav} from './markdownnav';
import {bindable, inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {HttpClient} from 'aurelia-fetch-client';
//import {WatchHashCore} from "../attributes/watch-hash-core";

@inject(I18N, HttpClient)
export class MarkdownBottomNav {
    @bindable src;
    @bindable navstyle;
    @bindable base='';
    notinitread=true;
    previoustitle='';//Introduction';
    nexttitle='';//Hemodynamics in Left Ventricle'
    @bindable content;

    constructor(i18n, httpclient) {
      //super(i18n, httpclient);
    }

    bind() {
      //this.params = 'index,0';
      //        super.bind();
    }

    update() {

    }
    next() {
      console.log('markdown bottom nav next');
    }
    previous() {
      console.log('markdown bottom nav previous');
    }

    changesrc(...args) {
      console.log('markdown-bottom-nav changesrc args:', args);
      //console.log('markdown-bottom-nav links:', this.links);
      //parse global window.markdownnav.links to get prev and next title
      //let prevtitle = '';
      let currentlink = '#' + args[0];
      if (window.markdownnav) {
        let currentlinkindex = window.markdownnav.links.findIndex(x => x.url === currentlink);
        this.nexttitle = currentlinkindex > 0 ? window.markdownnav.links[currentlinkindex - 1].title : '';
        this.nextlink = currentlinkindex > 0 ? window.markdownnav.links[currentlinkindex - 1].url : '';
        this.previoustitle = currentlinkindex < (window.markdownnav.links.length - 1) ? window.markdownnav.links[currentlinkindex + 1].title : '';
        this.previouslink = currentlinkindex < (window.markdownnav.links.length - 1) ? window.markdownnav.links[currentlinkindex + 1].url : '';
      }
    }
    contentChanged(newv, oldv) {
      console.log('markdown-bottom-na contentchanged', oldv, newv);
      console.log('markdown-bottom-nav links:', window.markdownnav.links);
    }
}
