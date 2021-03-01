# PDB components

Supports PDB components 
Requires external initialization - https://github.com/PDBeurope/pdbe-molstar/wiki

## pdbe-molstar
To visualize molecule in PDB database
* pid - required - the pdb component will be created with id="${pid}"
* molecule-id - required - pdb id of molecule e.g. 2h35
* hide-controls - default true - hides controls within the window
 

`<bdl-pdb-pdbe-molstar pid="pdb2h35" molecule-id="2h35" hide-controls="true" hide-polymer="true" bg-color-r="255" bg-color-g="255" bg-color-b="255"></bdl-pdb-pdbe-molstar>`

<bdl-pdb-pdbe-molstar pid="pdb2h35" molecule-id="2h35" moleculeid="2h35" hidecontrols="true" hidepolymer="true"></bdl-pdb-pdbe-molstar>
