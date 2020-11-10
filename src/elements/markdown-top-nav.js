import {Markdownnav} from './markdownnav';
import {bindable, inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {HttpClient} from 'aurelia-fetch-client';

@inject(I18N, HttpClient)
export class MarkdownTopNav extends Markdownnav {
    @bindable src;
    @bindable navstyle;
    @bindable base='';
    notinitread=true;
    previoustitle='Introduction';
    nexttitle='Hemodynamics in Left Ventricle'
    navtitle='Hemodynamics in Left Atria'

    constructor(i18n, httpclient) {
      super(i18n, httpclient);
    }

    update() {}
}
