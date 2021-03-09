# PDB components

Supports PDB components 
Requires additional initialization from external resources (load JS and CSS)
```html
<!-- CSS -->
<link rel="stylesheet" type="text/css" href="https://www.ebi.ac.uk/pdbe/pdb-component-library/css/pdbe-molstar-1.1.0.css">
<!-- JS -->
<script type="text/javascript" src="https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdbe-molstar-component-1.1.0.js"></script>
```
further info at https://github.com/PDBeurope/pdbe-molstar/wiki

## pdbe-molstar
To visualize molecule in PDB database
* molecule-id - required - pdb id of molecule e.g. 2h35
* hide-controls - default true - hides controls within the window
* hide-polymer - default false - hides controls within the window
* rotate - will rotate for 30 sec. and after 1 minutes for 30 sec.
* alwaysrotate - will rotate always
* width, height - in pixesl width and height of canvas to render pdbe component 

The component renders window 300x400 and set's automatic spin of the molecule.
 
`<bdl-pdb-pdbe-molstar molecule-id="2h35" hide-controls="true" hide-polymer="true"></bdl-pdb-pdbe-molstar>`

`<bdl-pdb-pdbe-molstar molecule-id="5n27" assembly-id="2"></bdl-pdb-pdbe-molstar>`


`<bdl-pdb-pdbe-molstar molecule-id="5jkk" rotate="false"></bdl-pdb-pdbe-molstar>`

<bdl-pdb-pdbe-molstar molecule-id="6m54"></bdl-pdb-pdbe-molstar>
