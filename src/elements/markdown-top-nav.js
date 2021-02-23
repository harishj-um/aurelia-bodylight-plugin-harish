//import {Markdownnav} from './markdownnav';
import {bindable, inject} from 'aurelia-framework';
//import {I18N} from 'aurelia-i18n';
//import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {parseHashParamString} from '../attributes/utils';

//@inject(I18N, HttpClient)
@inject(EventAggregator)
export class MarkdownTopNav {
    @bindable src;
    @bindable navstyle;
    @bindable base='';
    @bindable nav=false;
    @bindable index;
    @bindable toc=true;
    notinitread=true;
    previoustitle='';//Introduction';
    nexttitle='';//Hemodynamics in Left Ventricle'
    navtitle='';//Hemodynamics in Left Atria';
    currentlink='';

    constructor(ea) {
      //super(i18n, httpclient);
      this.ea = ea;
    }

    attached() {
      this.ea.subscribe('navchange', navstruct => this.updatenav(navstruct));
      this.ea.subscribe('hashchange', hashstruct => this.updatetitles(hashstruct));
    }

    updatenav(navstruct) {
      this.links = navstruct.links;
      this.updatetitles(parseHashParamString(window.location.hash));
      console.log('top nav links:', this.links);
    }

    updatetitles(hashstruct) {
      //this.currentlink
      console.log('top nav hash:', hashstruct);
      if (window.markdownnav) {
        let currentlink = '#' + (hashstruct[0].length > 0 ? hashstruct[0] : this.index);
        let currentlinkindex = window.markdownnav.links.findIndex(x => x.url === currentlink);
        this.navtitle = (currentlinkindex > 0) && (currentlinkindex < window.markdownnav.links.length)
          ? window.markdownnav.links[currentlinkindex].title
          : '';
      }
    }

    showhidenav() {
      this.nav = ! this.nav;
    }

    showhidetoc() {
        this.toc = ! this.toc;
    }

    changesrc(...args) {
      console.log('markdown-top-nav changesrc args:', args);
      //console.log('markdown-bottom-nav links:', this.links);
      //parse global window.markdownnav.links to get prev and next title
      if (window.markdownnav) {
        let currentlink = '#' + (args[0].length > 0 ? args[0] : this.index);
        let currentlinkindex = window.markdownnav.links.findIndex(x => x.url === currentlink);
        this.navtitle = (currentlinkindex > 0) && (currentlinkindex < window.markdownnav.links.length)
          ? window.markdownnav.links[currentlinkindex].title
          : '';
      }
    }
}
