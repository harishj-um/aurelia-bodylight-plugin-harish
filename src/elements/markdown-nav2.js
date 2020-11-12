import {bindable, inject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import {HttpClient} from 'aurelia-fetch-client';
import {Markdownnav} from './markdownnav';

@inject(I18N, HttpClient)
export class MarkdownNav2 extends Markdownnav {
    @bindable src;
    @bindable navstyle;
    @bindable base='';
    notinitread=true;

    constructor(i18n, httpclient) {
      super(i18n, httpclient);
    }
}
