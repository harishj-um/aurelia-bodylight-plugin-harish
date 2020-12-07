//import {Markdownnav} from './markdownnav';
import {bindable, inject} from 'aurelia-framework';
//import {I18N} from 'aurelia-i18n';
//import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';


//@inject(I18N, HttpClient)
@inject(EventAggregator)
export class MarkdownTopNav {
    @bindable src;
    @bindable navstyle;
    @bindable base='';
    @bindable nav=false;
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
      console.log('top nav links:', this.links);
    }

    updatetitles(hashstruct) {
      //this.currentlink
      if (hashstruct[0]) this.currentlink = hashstruct[0];
      if (hashstruct.index) this.currentlink = hashstruct.index;
      let currentitem = this.links.find(item => item.url === this.currentlink);
      if (currentitem) this.navtitle = currentitem.title;
    }

    showhidenav() {
      this.nav = ! this.nav;
    }

    changesrc(...args) {
      console.log('markdown-top-nav changesrc args:', args);
      //console.log('markdown-bottom-nav links:', this.links);
      //parse global window.markdownnav.links to get prev and next title
      //let prevtitle = '';
      let currentlink = '#' + args[0];
      if (window.markdownnav) {
        this.navtitle = window.markdownnav.links[currentlinkindex].title;
      }
    }
}
