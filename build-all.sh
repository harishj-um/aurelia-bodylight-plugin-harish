# build plugin
au build-plugin
cp -TRv dist/ ../Bodylight.js-Components/node_modules/aurelia-bodylight-plugin/dist/
# build components
cd ../Bodylight.js-Components/
#npm run build
npm run build:dev
#au build
cd ../aurelia-bodylight-plugin/
cp -TRv ../Bodylight.js-Components/dist/ ../Bodylight-Editor/node_modules/bodylight-components/dist/
cp -TRv ../Bodylight.js-Components/dist/ ../aurelia-bodylight-plugin/docs/scripts/
cp -TRv dist/ ../Bodylight-Editor/node_modules/aurelia-bodylight-plugin/dist/
cp -TRv dist/ ../bodylight-notebook/node_modules/aurelia-bodylight-plugin/dist/
# build editor
cd ../Bodylight-Editor
au build
cd ../aurelia-bodylight-plugin/

