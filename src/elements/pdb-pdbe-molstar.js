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
    @bindable pid;
    @bindable moleculeid='2hhd';
    @bindable moleculeId='1cbs';
    @bindable hidecontrols='true';
    @bindable hidepolymer='true';
    @bindable width=400;
    @bindable height=300;

    bind() {
      console.log('bind() moleculeid', this.moleculeid);
      console.log('bind() moleculeId', this.moleculeId);
      console.log('bind() hidecontrols', this.hidecontrols);
      console.log('bind() hidepolymer', this.hidepolymer);
    }

    attached() {
      setTimeout( () => {
        let pdbeMolstarComponent = document.getElementById(this.pid);
        let viewerInstance = pdbeMolstarComponent.viewerInstance;
        viewerInstance.visual.toggleSpin(true);
      }, 3000);
    }
}
