import environment from './environment';
import { CustomElementRegistry } from 'aurelia-web-components';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
  //all components from src (resources/index) will be registered as web component
    .feature('resources/index');
  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');
  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }
  // here define start and register prefix bdl-
  aurelia.start().then(() => {
    const registry = aurelia.container.get(CustomElementRegistry);
    registry.fallbackPrefix = 'bdl-';
    registry.mandatoryPrefix = true;
    registry.useGlobalElements();
  });
}
