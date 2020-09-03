import environment from './environment';
import { CustomElementRegistry } from 'aurelia-web-components';

export function configure(aurelia) {
  /*aurelia.use
    .standardConfiguration()
    .plugin("aurelia-dynamic-html") //needed by markdownaurelia
    // load the plugin ../src
    // The "resources" is mapped to "../src" in aurelia.json "paths"
    .feature('resources');

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
   */
  aurelia.use
    .basicConfiguration()
    //.standardConfiguration()
    .plugin('aurelia-bootstrapper')
    .plugin('aurelia-history-browser')
    .plugin('aurelia-templating-resources')
    .plugin('aurelia-templating-router')
    .plugin('aurelia-dynamic-html')
    .feature('resources/index');
    //use this routine to register component as web component
    /*.globalResources([
      './elements/bdl-range.html',
      './elements/bdl-receptacle.html',
      './elements/bdl-bind2previous',
      './elements/bdl-dygraphchart',
      './elements/bdl-beaker.html',
      './elements/bdl-value',
      './elements/bdl-beakercontrols.html',
      './elements/bdl-markdown',
      './elements/bdl-markdownnav',
      './elements/bdl-simplegif',
      './elements/bdl-capillary.html',
      './elements/bdl-ecg',
      './elements/bdl-chartjs',
      './elements/bdl-chartjs-time',
      './elements/bdl-chartjs-xy',
      './elements/bdl-cardiaccycle.html',
      './elements/bdl-animate-gif',
      './elements/bdl-animate-sync-gif',
      './elements/bdl-animate-control',
      './elements/bdl-quiz',
      './elements/bdl-audio-on-increase',
      './elements/bdl-audio-on-decrease',
      './elements/bdl-sound-on-increase',
      './elements/bdl-markdown-book',
      './elements/bdl-markdown-book-au',
      './elements/bdl-markdown-app.html',
      './elements/bdl-fmi'
    ])*/
  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');
  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }
  // here define start and register prefix bdl-
  aurelia.start().then(() => {
    const registry = aurelia.container.get(CustomElementRegistry);
    registry.fallbackPrefix = 'bdl-';
    registry.useGlobalElements();
  });
}
