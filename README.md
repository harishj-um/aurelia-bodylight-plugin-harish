# Aurelia plugin with Bodylight web components 
[![Build Status](https://travis-ci.com/creative-connections/aurelia-bodylight-plugin.svg?branch=master)](https://travis-ci.com/creative-connections/aurelia-bodylight-plugin)
 [![Project stage: Development][project-stage-badge: Development]][project-stage-page]

[project-stage-badge: Development]: https://img.shields.io/badge/Project%20Stage-Development-yellowgreen.svg
[project-stage-page]: https://blog.pother.ca/project-stages/

Bodylight web components are custom-elements enhancing HTML in order to build interactive web simulators. It contains an FMU component
able to execute `Modelica` (not only) model simulation exported to `FMU` using FMI standard. It contains Adobe-Animate and Gif-Animate component
able to control animation exported from Adobe-Animate or animated GIF and bind them to model simulation. It contains Chart-JS component in order 
to visualise model variables in different chart types.

This plugin is part of broader tools to enable in-browser simulation using modern web technologies: Web Assembly, HTML, Javascript (ECMAScript6).

# Usage

This plugin is distributed in 2 different way: 1) as standard web components or 2) as aurelia components.
* **1. Standard web components** - follow this section to create web simulator using HTML or Markdown. 
* **2. Aurelia web components** - follow this section to build more complex interactive application.   

## 1. Standard web components

1) Use `bodylight.bundle.js` from : 
    * download `bodylight.bundle.js` locally and refer it from your `<script>`:
    ```html
        <script type="module" src="bodylight.bundle.js"></script>
    ```  
    * OR refer bundle directly from CDN:
    ```html
      <script type="module" src="https://cdn.jsdelivr.net/gh/creative-connections/Bodylight.js-Components/dist/bodylight.bundle.js"></script>
    ```
   
2) Set `div` or `body` where web components by adding `aurelia-app="webcomponents"` attribute, all webcomponents are prefixed by `bdl-` prefix:
```html
index.html
...
<body aurelia-app="webcomponents">
  <bdl-range id="id1" min="40" max="180" default="60" title="Heart rate"></bdl-range>
  <bdl-fmi ...></bdl-fmi>
  <bdl-chartjs ...></bdl-chartjs>
</body>
```

3) (optional) you may use any of `bdl-markdown-*` components to refer MD documents where you may use Bodylight webcomponents as well.
E.g. `doc/index.md` contains main content and `summary.md` contains sidebar with links to other docs.
```html
index.html
...
<body aurelia-app="webcomponents">
    <bdl-markdown-book index="doc/index.md" summary="doc/summary.md">
      <img src="doc/loading.gif"/>
    </bdl-markdown-book>
</body>
```
```markdown
doc/index.md

# Introduction
Markdown syntax is interpretted. Syntax highlighting is enabled for source code. KATEX plugin is enabled to allow
basic equation e.g. $$e = m c^2$$

## bodylight web components
Use bodylight web components directly:
  <bdl-range id="id1" min="40" max="180" default="60" title="Heart rate"></bdl-range>
  <bdl-fmi ...></bdl-fmi>
  <bdl-chartjs ...></bdl-chartjs>
```

```markdown
summary.md
| EN | [CZ](#doc/index.cs.md&summary=doc/summary.cs.md) |   
  * [First Page](#doc/index.md)
  * [Second Page](#doc/index2.md)
    * [Sub page of second page](#doc/index22.md)
```

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
For further doc refer `doc/` 

## Release history
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

