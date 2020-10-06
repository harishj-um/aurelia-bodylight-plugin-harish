# Aurelia plugin with Bodylight web components 
[![Build Status](https://travis-ci.com/creative-connections/aurelia-bodylight-plugin.svg?branch=master)](https://travis-ci.com/creative-connections/aurelia-bodylight-plugin)
 [![Project stage: Development][project-stage-badge: Development]][project-stage-page]

[project-stage-badge: Development]: https://img.shields.io/badge/Project%20Stage-Development-yellowgreen.svg
[project-stage-page]: https://blog.pother.ca/project-stages/

Web components of the Bodylight library is a suite of custom elements enhancing HTML web documents with 
* FMU component able to be execute in browser. `Modelica` model is exported to `FMU` using FMI standard and [Bodylight FMU Compiler](https://github.com/creative-connections/Bodylight.js-FMU-Compiler) can convert FMU with source codes and solver into WebAssembly script.
* Adobe-Animate and Gif-Animate component able to control animation exported from Adobe-Animate or animated GIF and bind them to variables of model simulation.
* ChartJS and DygraphJS components to visualise model variables in different chart types.
* Following Web components standard at [1].

All bodylight web components are registered with a bdl- prefix. Components are defined in source code without the prefix, which may be used to build application internally in an Aurelia framework [2]. However, web components way is framework agnostic standard way.

This plugin is part of broader tools to enable in-browser simulation using modern web technologies: Web Assembly, HTML, Javascript (ECMAScript6).

# Usage

This plugin is distributed in 2 different way: 1) as standard web components or 2) as aurelia components.
* **1. Standard web components** - follow [Bodylight.js-Components](https://github.com/creative-connections/Bodylight.js-Components) to create web simulator using HTML or Markdown or mor complex application using different framework. 
* **2. Aurelia web components** - follow this section to build more complex interactive application using bodylight plugin   

## 1. Standard web components

follow [Bodylight.js-Components](https://github.com/creative-connections/Bodylight.js-Components) to create web simulator using HTML or Markdown.

## 2. Aurelia web components

We recommend to use [aurelia](https://aurelia.io) framework to build web application with Bodylight Web components.
Follow Aurelia doc's how to prepare your project and  install `aurelia-bodylight-plugin` by `npm` command-line:
```bash
npm i aurelia-bodylight-plugin
```

In your `main.js` file enable the plugin by `aurelia.use.plugin(PLATFORM.moduleName('aurelia-bodylight-plugin'))`, so it may look like:
```javascript
//main.js
import {PLATFORM} from 'aurelia-pal';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-bodylight-plugin'))

  aurelia.start().then(() => {
    aurelia.setRoot(PLATFORM.moduleName('app'));
  });
}
```
Bodylight web components are available in any template, use them without `bdl-` prefix:
```html
<template>
  <range id="id1" min="40" max="180" default="60" title="Heart rate"></range>
  <fmi ...></fmi>
  <chartjs ...></chartjs>
...
</template>
```
## Reference manual
For further doc refer `docs/` 

## Developer's guide

To Build and test
* `au build-plugin` - builds plugin - outpu to `dist`
* `au build` - builds dev-app with documentation - output to `/script`
* `au test` - execute unit tests

To publish NPM package version [NPM aurelia-bodylight-plugin](https://www.npmjs.com/package/aurelia-bodylight-plugin)
* `npm login` - logs into NPM - need to be contributor for  
* `np` - UI for release the new version (will ask for patch,minor or major version)

### Add new component
To add a new web component:
* create a component definition in src/components, either only HTML or HTML and JS
* register the component as a web component in src/webcomponents.js adding a row
```javascript
export function configure(aurelia) {
  aurelia.use
  ...
  //use this routine to register HTML only component as web component
  .globalResources(PLATFORM.moduleName('components/mycomponent.html'))
  //use this routine to register component (JS and HTML) as web component
  .globalResources(PLATFORM.moduleName('components/mycomponent'))
  ...
```

* create documentation in `docs`
* create unit test in `test` 
* build plugin `au build-plugin` and build dev-app with docs using `au build` and see `docs/index.html` 

## Release history
### release notes 1.0.2
* consolidated docs and tests
### release notes 0.3
* removed unused packages
* created npm package aurelia-bodylight-plugin - can be installed using 
```
npm -i aurelia-bodylight-plugin
```
### release notes 0.2
* aurelia templating left as is
* all elements renamed, do not have bdl- prefix or Bdl* in name,
* aurelia-web-components patched with 'forcePrefix' option to have consistent prefix for all web components
### release notes 0.1
* aurelia-templating throws 'behaviorInstruction' is undefined - need to patch from `\patch` directory
* bdl-markdown-book index and summary attributes are not reflected

