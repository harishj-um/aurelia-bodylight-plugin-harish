import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

describe('animate-adobe element', () => {
    let component;
    afterEach(() => {
        if (component) {
            component.dispose();
            component = null;
        }
    });

    it('creates animate-adobe2 ', done => {

        component = StageComponent
            .withResources('elements/animate-adobe2')
            .inView('<animate-adobe2></animate-adobe2>');
/*            .withResources('elements/chartjs')
            .inView('<chartjs \n' +
                '  id="id9" \n' +
                '  width="300" \n' +
                '  height="500" \n' +
                '  fromid="id4" \n' +
                '  type="doughnut" \n' +
                '  labels="Intrathoracic Arteries,ExtraThoracic Arteries, Pulmonary Arteries, Intrathoracic Veins, Extrathoracic veins, Pulmonary Veins"\n' +
                '  initialdata="0,4,2,3" \n' +
                '  refindex="2" \n' +
                '  refvalues="6"></chartjs>');
*/
        /*.withResources('elements/animate-adobe')
        .inView('<animate-adobe \n' +
            '    src="doc/ZelezoCelek.js" \n' +
            '    width="800"\n' +
            '    height="600"\n' +
            '    name="ZelezoCelek"\n' +
            '    fromid="id4" ></animate-adobe>');*/


        component.create(bootstrap).then(() => {
            //await waitForTimeout(50);
            const view = component.element;
            const canvas = view.getElementsByTagName('canvas');
            expect(canvas.length).toBe(1); //1 canvas
            const divs = view.getElementsByTagName('div');
            expect(divs.length).toBe(2); //2 chartjs monitor1
            done();
        }).catch(e => {
            fail(e);
            done();
        });
    });
    
    it('creates animate-adobe with createjs', done => {

        component = StageComponent
            .withResources('elements/animate-adobe')
            .inView('<animate-adobe></animate-adobe>');
        /*            .withResources('elements/chartjs')
                    .inView('<chartjs \n' +
                        '  id="id9" \n' +
                        '  width="300" \n' +
                        '  height="500" \n' +
                        '  fromid="id4" \n' +
                        '  type="doughnut" \n' +
                        '  labels="Intrathoracic Arteries,ExtraThoracic Arteries, Pulmonary Arteries, Intrathoracic Veins, Extrathoracic veins, Pulmonary Veins"\n' +
                        '  initialdata="0,4,2,3" \n' +
                        '  refindex="2" \n' +
                        '  refvalues="6"></chartjs>');
        */
        /*.withResources('elements/animate-adobe')
        .inView('<animate-adobe \n' +
            '    src="doc/ZelezoCelek.js" \n' +
            '    width="800"\n' +
            '    height="600"\n' +
            '    name="ZelezoCelek"\n' +
            '    fromid="id4" ></animate-adobe>');*/


        component.create(bootstrap).then(() => {
            //await waitForTimeout(50);
            const view = component.element;
            const canvas = view.getElementsByTagName('canvas');
            expect(canvas.length).toBe(1); //1 canvas
            const divs = view.getElementsByTagName('div');
            expect(divs.length).toBe(2); //2 chartjs monitor1
            done();
        }).catch(e => {
            fail(e);
            done();
        });
    });
});
