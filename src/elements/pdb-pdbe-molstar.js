import {bindable} from 'aurelia-framework';

/**
 * requires extra initialization of pdb components
 * <!-- Web component polyfill (only loads what it needs) -->
 * <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-lite.js" charset="utf-8"></script>
 *
 * <!-- CSS -->
 * <link rel="stylesheet" type="text/css" href="https://www.ebi.ac.uk/pdbe/pdb-component-library/css/pdbe-molstar-1.1.0.css">
 *
 * <!-- JS -->
 * <script type="text/javascript" src="https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdbe-molstar-component-1.1.0.js"></script>
 */
export class PdbPdbeMolstar {
    @bindable moleculeId='2hhd';
    @bindable hideControls='true';
    @bindable hidePolymer='false';
    @bindable rotate='true';
    @bindable alwaysrotate='false';
    @bindable width='100%';
    @bindable height='300px';
    @bindable assemblyId;
    @bindable visualStyle;

    /* Adding to template do not have effect as pdbe-molstar is third party web component, thus appendchild notifies api to interpret it
    Aurelia do not bind to unknown attributes - molecule-id etc. it creates
              <pdbe-molstar molecule-id='2hhd'
                      bg-color-r="255"
                      bg-color-g="255"
                      bg-color-b="255"></pdbe-molstar>
*/
    bind() {
      this.divstyle = `width:${this.width};height:${this.height}; position:relative`;
      console.log('bind() moleculeId,hidecontrols,hidepolymer,moleculeidref', this.moleculeId, this.hideControls, this.hidePolymer, this.parentref);
      this.pdbref = document.createElement('pdbe-molstar');
      this.pdbref.setAttribute('molecule-id', this.moleculeId);
      this.pdbref.setAttribute('hide-controls', this.hideControls);
      if (this.hidePolymer && this.hidePolymer === 'true') this.pdbref.setAttribute('hide-polymer', this.hidePolymer);
      if (this.assemblyId) this.pdbref.setAttribute('assembly-id', this.assemblyId);
      //console.log('pdbpdbemolstart bind() this:', this);
      if (this.visualStyle) this.pdbref.setAttribute('visual-style', this.visualStyle);
      this.pdbref.setAttribute('bg-color-r', 255);
      this.pdbref.setAttribute('bg-color-g', 255);
      this.pdbref.setAttribute('bg-color-b', 255);
      this.parentref.appendChild(this.pdbref);
    }

    attached() {
      if (this.rotate && this.rotate === 'true') {
        setTimeout(() => {
          //let pdbeMolstarComponent = document.getElementById(this.pid);
          let viewerInstance = this.pdbref.viewerInstance;
          viewerInstance.visual.toggleSpin(true);
        }, 3000);
        setTimeout(() => {
          //let pdbeMolstarComponent = document.getElementById(this.pid);
          let viewerInstance = this.pdbref.viewerInstance;
          viewerInstance.visual.toggleSpin(false);
        }, 60000);
      } else if (this.alwaysrotate && this.alwaysrotate === 'true') {
        setTimeout(() => {
          //let pdbeMolstarComponent = document.getElementById(this.pid);
          let viewerInstance = this.pdbref.viewerInstance;
          viewerInstance.visual.toggleSpin(true);
        }, 3000);
      }
    }
}
