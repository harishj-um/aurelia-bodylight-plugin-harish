import {MarkdownBook} from './markdown-book';
import {bindable} from 'aurelia-framework';

export class MarkdownBook2 extends MarkdownBook {
    @bindable summary;
    @bindable index;
    @bindable base='';
    @bindable params;
    shownav=false;

    constructor() {
      super();
    }

    bind() {
      super.bind();
      this.shownav = false;
      console.log('markdownbook bind shownav', this.shownav);
    }
    attached() {
      //super.attached();
      console.log('markdownbook attached shownav', this.shownav);
    }
}
