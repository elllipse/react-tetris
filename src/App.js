import React, { Component } from 'react';
import Cell from './Cell';
import { getBlankState, elements } from './elements';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      currFieldState: getBlankState(),
      currEl: {
        name: 'O',
        state: 0,
        colorId: 1,
        step: 0
      },
      activeColumnIndex: 5,
      activeRowIndex: -2,
      collision: false
    }
    this.prevElemPos = [];
  }
  componentDidMount() {
    this.initNewElem()
  }
  initNewElem = () => {
    this.checkFieldForFullRow;
    console.log('init new elem!')
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.setRandomElement();
    this.loopInterval = setInterval(this.gameLoop, 1000);
  }
  gameLoop = () => {
    this.moveDown();
  }
  checkFieldForFullRow = () => {

  }
  moveDown = (force) => {
    if (force) clearInterval(this.loopInterval);

    const { currEl, activeRowIndex } = this.state;
    let newActiveRowIndex = currEl.step === 0 ?
      -elements[currEl.name][currEl.state].length + 1 : activeRowIndex + 1;

    this.setState({
      activeRowIndex: newActiveRowIndex,
      currEl: {...currEl, step: currEl.step + 1 }
    }, this.drawElem)

    //if (force) this.loopInterval = setInterval(this.gameLoop,1000);

  }
  drawElem = () => {
    const { currEl, currFieldState, activeColumnIndex, activeRowIndex } = this.state;

    const clearPrevElemPos = (posArr) => {
      this.prevElemPos.forEach(pos => currFieldState[pos[0]][pos[1]] = 0);
      this.prevElemPos = [];
    };

    const drawElement = (currFieldState, currElemRow, currElemColumn, el) => {
      const currElArr = elements[el.name][el.state];
      const newCurrFieldState = currFieldState;
      const elemLength = currElArr.length;
      const elemCenterRow = elemLength === 1 ? 0 : 1;
      let collision = false;

      if (this.prevElemPos.length > 0) clearPrevElemPos(this.prevElemPos);

      currElArr.forEach((row, i) => {
        const currRow = currElemRow + (i - elemCenterRow);
        if (currRow > -1 && currRow < newCurrFieldState.length) {
          row.forEach(cell => {
            const currColumn = currElemColumn + cell;
            if (currColumn > -1)
              newCurrFieldState[currRow][currColumn] = el.colorId;
            const point = [currRow, currColumn];
            this.prevElemPos.push(point);
            if (!newCurrFieldState[currRow + 1] || newCurrFieldState[currRow + 1][currColumn] !== 0) {
              collision = true;
            }
          })
        }

      })

      if (collision) this.prevElemPos = [];
      return {
        currFieldState: newCurrFieldState,
        collision
      };
    }

    const newStateObj = drawElement(currFieldState, activeRowIndex, activeColumnIndex, currEl);

    this.setState({
      ...newStateObj
    }, () => { if (newStateObj.collision) this.initNewElem() })

  }
  setRandomElement = () => {
      const elKeys = Object.keys(elements);
      const randomId = Math.floor(Math.random() * elKeys.length);
      const randomElName = elKeys[randomId];
      const randomState = Math.floor(Math.random() * elements[randomElName].length);
      console.log('randomElName',randomElName);
      console.log('randomState',randomState);
      this.setState({
        currEl: {
          name: randomElName,
          state: randomState,
          shapeArr: elements[randomElName][randomState],
          colorId: randomId + 1, // colors ['#fff','#2ecc71','#3498db','#9b59b6','#e74c3c','#f1c40f'];
          step: 0
        },
        activeColumnIndex: 5,
        activeRowIndex: -2
      })
    }
   
  isSideCollision = (shape) => {
    //console.log('shape',shape);
    const { activeColumnIndex, activeRowIndex, currFieldState } = this.state;
    const shapeArr = shape;

    const getCorrColumnIndex = (side,row) => { 
        switch (side) {
            case 'left':
              return row[0];

            case 'right':
              return row[row.length - 1];

            case 'beforeLeft':
              return row[0] - 1;

            case 'twoBeforeLeft':
              return row[0] - 2;

            case 'afterLeft':
              return row[0] + 1;

            case 'beforeRight':
              return row[row.length - 1] - 1;

            case 'afterRight':
              return row[row.length - 1] + 1;

            default:
              return false;
          }
      }

    const testElementCollision = (side) => {
      let rowCorrIndex,
        currRow,
        exactRow,
        exactColumn,
        blockToCheck,
        collision = false,
        rowCorrIndexArr = [-1,0,1,2];
      
      if (shapeArr.length > 1) { // activeRowIndex will be in index === 1 of the shape
        for (var row = 0; row < shapeArr.length; row++) {
          currRow = shapeArr[row];

          if (currRow.length === 1 && row !== shapeArr.length - 1) { // if not last row -> go to next because in this row left === right;
            row++
            currRow = shapeArr[row];
          } else if (currRow.length === 1 && row === shapeArr.length - 1) {
            return collision;
          }
          
          rowCorrIndex = rowCorrIndexArr[row];

          exactRow = activeRowIndex + rowCorrIndex;
          exactColumn = activeColumnIndex + getCorrColumnIndex(side,currRow);

          blockToCheck = currFieldState[exactRow][exactColumn];
          const isBlockFromPrev = this.prevElemPos.some(el => el[0] === exactRow && el[1] === exactColumn);
          // console.log(`blockToCheck = currFieldState[${exactRow}][${exactColumn}] ${currFieldState[exactRow][exactColumn]};`)
          if (blockToCheck === undefined || (blockToCheck > 0 && !isBlockFromPrev)) collision = true;
        }
      } else {
        currRow = shapeArr[0];
        exactRow = activeRowIndex;
        exactColumn = activeColumnIndex + getCorrColumnIndex(side,currRow);

        blockToCheck = currFieldState[exactRow][exactColumn];
        const isBlockFromPrev = this.prevElemPos.some(el => el[0] === exactRow && el[1] === exactColumn);
        // console.log(`blockToCheck = currFieldState[${exactRow}][${exactColumn}] ${currFieldState[exactRow][exactColumn]};`)
        if (blockToCheck === undefined || (blockToCheck > 0 && !isBlockFromPrev)) collision = true;
      }

      return collision;
    }

      const left = testElementCollision('left');
      const right = testElementCollision('right');
      const beforeRight = shapeArr[0].length === 4 && testElementCollision('beforeRight');
      const afterLeft = shapeArr[0].length === 4 && testElementCollision('afterLeft');
      const beforeLeft = testElementCollision('beforeLeft');
      const twoBeforeLeft = (right && beforeRight) && testElementCollision('twoBeforeLeft');
      const afterRight = testElementCollision('afterRight');

    return {
      left,
      right,
      beforeLeft,
      twoBeforeLeft,
      afterRight,
      beforeRight,
      afterLeft
    }

  }

  moveHorizontally = (direction) => {
    const { activeColumnIndex, currEl: { shapeArr } } = this.state;
    const area = direction === 'right' ? 'afterRight' : 'beforeLeft';
    const collision = this.isSideCollision(shapeArr);

    if (collision[area]) return;
    let index = direction === 'right' ? 1 : -1;

    this.setState({
      activeColumnIndex: activeColumnIndex + index
    }, this.drawElem)
  }
  rotateElem = () => {
    const { currEl, activeColumnIndex } = this.state;
    if (elements[currEl.name].length === 1) return;

    const nextElemenState = currEl.state === (elements[currEl.name].length - 1) ? 0 : currEl.state + 1;
    const nextElShapeArr = elements[currEl.name][nextElemenState];
    let nextActiveColumnIndex = activeColumnIndex;

    const nextShapeCollision = this.isSideCollision(nextElShapeArr);

    const leftCollision = nextShapeCollision['left'];
    const rightCollision = nextShapeCollision['right'];
    const afterRightCollision = nextShapeCollision['afterRight'];
    const beforeRightCollision = nextShapeCollision['beforeRight'];
    const beforeLeftCollision = nextShapeCollision['beforeLeft'];
    const twoBeforeLeftCollision = nextShapeCollision['twoBeforeLeft'];

    if (leftCollision && rightCollision) return;
    if (leftCollision && afterRightCollision) return;
    if (rightCollision && beforeLeftCollision) return;
    if ( (beforeRightCollision || rightCollision) && (beforeLeftCollision || twoBeforeLeftCollision) ) return;

    if (beforeRightCollision && (!beforeLeftCollision && !twoBeforeLeftCollision) ) nextActiveColumnIndex -= 2;
    else if (leftCollision && !afterRightCollision) nextActiveColumnIndex++;
    else if (rightCollision && !beforeLeftCollision) nextActiveColumnIndex--;

    this.setState({
      currEl: {...currEl, state: nextElemenState, shapeArr: nextElShapeArr },
      activeColumnIndex: nextActiveColumnIndex
    }, this.drawElem)
  }
  onKeyDown = (e) => {
    if (this.state.collision) return;
    switch (e.nativeEvent.code) {
      case 'ArrowLeft':
        this.moveHorizontally('left');
        break;
      case 'ArrowRight':
        this.moveHorizontally('right');
        break;
      case 'ArrowDown':
        this.moveDown(true);
        break;
      case 'ArrowUp':
        this.rotateElem();
        break;
      default:
        return
    }
  }

  render() {
    const { currFieldState } = this.state;
    return (
      <div className="App" onKeyDown={this.onKeyDown} tabIndex={0}>
          {currFieldState.map((row,rowI)=>row.map((el,i)=><Cell id={''+rowI+i} type={el} />))}
      </div>
    );
  }
}

export default App;