import isSideCollision from '../collisionChecker';
import { elements, getBlankState } from '../elements';

// returned object {
//   left,
//   right,
//   beforeLeft,
//   twoBeforeLeft,
//   afterRight,
//   beforeRight,
//   afterLeft
// }

describe('collisions check on empty field', () => {

  it('check I[1] 1 cell left outside', () => {
    const shapeArr = elements['I'][1];
    const options = { shapeArr, activeColumnIndex: 0, activeRowIndex: 0, currFieldState: getBlankState(), prevElemPos: [] };
    expect(isSideCollision(options)).toEqual({
      left: true,
      right: false,
      beforeLeft: true,
      twoBeforeLeft: true,
      afterRight: false,
      beforeRight: false,
      afterLeft: false
    })
  });

  it('check I[1] 1 cell right outside', () => {
    const shapeArr = elements['I'][1];
    const options = { shapeArr, activeColumnIndex: 8, activeRowIndex: 0, currFieldState: getBlankState(), prevElemPos: [] };
    expect(isSideCollision(options)).toEqual({
      left: false,
      right: true,
      beforeLeft: false,
      twoBeforeLeft: false,
      afterRight: true,
      beforeRight: false,
      afterLeft: false
    })
  });

  it('check I[1] 2 cell right outside', () => {
    const shapeArr = elements['I'][1];
    const options = { shapeArr, activeColumnIndex: 9, activeRowIndex: 0, currFieldState: getBlankState(), prevElemPos: [] };
    expect(isSideCollision(options)).toEqual({
      left: false,
      right: true,
      beforeLeft: false,
      twoBeforeLeft: false,
      afterRight: true,
      beforeRight: true,
      afterLeft: false
    })
  });


});