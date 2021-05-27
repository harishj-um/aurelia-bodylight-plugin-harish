import Markdownit from 'markdown-it';
import MarkdownItForInline from 'markdown-it-for-inline';
import mk from 'markdown-it-katexx'; //math in md, iktakahiro version seems to be most updated - works with latest katex
import {bindable, inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {HttpClient} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';

//global function to operate on translated markdown in navigation panel
//adds + or - and shows hides list under it
window.bodylightnavopenhide = function(obj) {
  //set show/hide to
  //console.log('openhide()', obj);
  if (obj.nextSibling.className === 'w3-hide') {
    obj.nextSibling.className = 'w3-animate-opacity';
    obj.firstChild.className = 'fa fa-minus';
  } else {
    obj.nextSibling.className = 'w3-hide';
    obj.firstChild.className = 'fa fa-plus';
  }
};

@inject(I18N, HttpClient, EventAggregator)
export class Markdownnav {
  @bindable src;
  @bindable navstyle;
  @bindable base='';
  notinitread=true;

  constructor(i18n, httpclient, ea) {
    this.i18n = i18n;
    this.client = httpclient;
    this.html = '';
    this.navclass = '';
    this.links = [];
    this.currentlink = 'N/A';
    this.ea = ea;
  }

  bind() {
    //console.log('bdlmarkdownnav src:', this.src);
    if (this.notinitread && this.src && this.src.length > 0 && this.mdtoc) this.fetchMDSrc();
  }

  attached() {
    //console.log('bdlmakrdownnav src:', this.src);
    window.markdownnav = this;
    let iterator = MarkdownItForInline;
    // eslint-disable-next-line new-cap
    this.mdtoc = Markdownit({html: true})
      .use(mk, {'throwOnError': true, 'errorColor': ' #cc0000'})
      .use(iterator, 'url', 'link_open', function(tokens, idx) {
        //detect links in list and create array of links used by other components
        let aIndex = tokens[idx].attrIndex('href');
        if (aIndex < 0) {
          //tokens[idx].attrPush(['target', '_blank']);
          //no href
        } else {
          //save detected link into global links array
          let link = tokens[idx].attrs[aIndex][1];
          let linktext = tokens[idx + 1].content;
          //console.log('nav token open + 2:', tokens[idx], tokens[idx+1],tokens[idx+2]);
          window.markdownnav.links.push({url: link, title: linktext});
        }
      });
    this.navclass = (this.navstyle && this.navstyle.length > 0) ? this.navstyle : 'horizontal';
    //adds rule to add a class to li item
    this.mdtoc.renderer.rules.list_item_open = function(tokens, idx, options, env, slf) {
      console.log('markdownnav list item open tokens[idx], options:', tokens, idx);
      //use link as id
      let link = null;
      try {
        link = tokens[idx + 2].children[0].attrs[0][1];
      } catch (e) {
        //ignore
      }
      if (link) return '<li class="navitem" id="' + link + '">';
      return '<li class="navitem">';
    };
    this.mdtoc.renderer.rules.bullet_list_open = function(tokens, idx, options, env, slf) {
      if (window.markdownnavdepth) window.markdownnavdepth++; else window.markdownnavdepth = 1;
      if (window.markdownnavdepth && window.markdownnavdepth === 2) return '<span class="w3-small" onclick="bodylightnavopenhide(this)" ><i class="fa fa-plus"></i></span><ul class="w3-hide">';
      return '<ul>';
    };
    this.mdtoc.renderer.rules.bullet_list_close = function(tokens, idx, options, env, slf) { if (window.markdownnavdepth) window.markdownnavdepth--; return '</ul>';};
    //fetch md source from src attribute
    this.fetchMDSrc();
  }

  fetchMDSrc() {
    let url = (this.src.startsWith('http')) ? this.src : this.base + this.src;
    //console.log('fetchmd src:', this.src);
    //src not empty - then fetch src
    if (this.src && this.src.length > 0) {
      this.notinitread = false;
      this.client.fetch(url)
        .then(response => response.text())
        .then(data => {
          //console.log('fetched md:', data)
          this.text = data;
          //convert from md to html
          this.links = [];
          this.html = this.mdtoc.render(this.text);
          //console.log('markdownnow fetchmd src links:', this.html);
          this.ea.publish('navchange', {links: this.links, text: this.text, html: this.html});
          this.update();
        });
    }
  }

  update() {
    this.mynav.innerHTML = this.html;
  }

  openhide() {
  }

  /*changesrc(...args) {
    //console.log('markdownnav.changesrc() args:', args);
    if (args[1]) this.base = args[1];
    if (args[0] && args[0].length > 0) this.src = args[0];
    this.fetchMDSrc();
  }*/
}
