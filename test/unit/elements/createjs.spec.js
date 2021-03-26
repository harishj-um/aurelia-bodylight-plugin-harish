import 'createjs/builds/1.0.0/createjs';

describe('CreateJS', async() => {
  await waitForTimeout(1000);
  //console.log('latestcreatejs',latestcreatejs);
  let canvas = document.createElement('canvas'); let stage;
  canvas.width = 1280;
  canvas.height = 720;

  test('create Stage', () => {
    stage = new createjs.Stage(canvas);
    expect(stage).toBeTruthy();
  });

  test('draw something on Stage', () => {
    const before = canvas.toDataURL();
    const shape = new createjs.Shape();
    shape.graphics
      .setStrokeStyle(1)
      .beginStroke('#000')
      .moveTo(0, 0)
      .lineTo(canvas.width, canvas.height);
    stage.addChild(shape);
    stage.update();
    const after = canvas.toDataURL();
    expect(before).not.toEqual(after);
  });
});
