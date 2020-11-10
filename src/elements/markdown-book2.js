import {MarkdownBook} from './markdown-book';
import {bindable} from 'aurelia-framework';

export class MarkdownBook2 extends MarkdownBook {
    @bindable summary;
    @bindable index;
    @bindable base='';
    @bindable params;

    constructor() {
      super();
    }
}
