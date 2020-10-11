import "isomorphic-fetch";
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

describe('markdown element', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });

  it('creates div and section with md content', done => {

    component = StageComponent
      .withResources('elements/markdownaurelia')
      .inView('<markdownaurelia></markdownaurelia>');


    component.create(bootstrap).then(() => {
      const view = component.element;
      const section = view.getElementsByTagName('section');
      expect(section.length).toBe(1);
      const div = view.getElementsByTagName('div');
      expect(div.length).toBe(1);
      done();
    }).catch(e => {
      fail(e);
      done();
    });
  });
});
