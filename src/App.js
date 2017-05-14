import React, { Component } from 'react';
import Cell from './Cell';
import {blankState, elements} from './elements';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      currFieldState : blankState,
      currEl: {
        name : 'O',
        state : 0,
        colorId : 1,
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
    console.log('init new elem!')
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.setRandomElement();
    this.loopInterval = setInterval(this.gameLoop,1000);
  }
  gameLoop = () => {
    this.moveDown();
  }
  moveDown = (force) => {
    if (force) clearInterval(this.loopInterval);
    
    const {currEl, activeRowIndex} = this.state;
    let newActiveRowIndex = currEl.step === 0 ? 
          -elements[currEl.name][currEl.state].length+1 : activeRowIndex+1;
    
    this.setState({
      activeRowIndex: newActiveRowIndex,
      currEl: {...currEl, step: currEl.step+1}
    },this.drawElem)

    //if (force) this.loopInterval = setInterval(this.gameLoop,1000);

  }
  drawElem = () => {
    const { currEl, currFieldState, activeColumnIndex, activeRowIndex} = this.state;

    const clearPrevElemPos = (posArr) => {
      this.prevElemPos.forEach(pos=>currFieldState[pos[0]][pos[1]] = 0);
      this.prevElemPos = [];
    };

    const drawElement = (currFieldState, currElemRow, currElemColumn, el) => {
      const currElArr = elements[el.name][el.state];
      const newCurrFieldState = currFieldState;
      const elemLength = currElArr.length;
      const elemCenterRow = elemLength === 1 ? 0 : 1;
      let collision = false;

      if (this.prevElemPos.length > 0) clearPrevElemPos(this.prevElemPos);

      currElArr.forEach((row,i)=>{
        const currRow = currElemRow + (i - elemCenterRow);
        if (currRow > -1 && currRow < newCurrFieldState.length) {
          row.forEach(cell=>{
            const currColumn = currElemColumn + cell;
            if (currColumn > -1)
              newCurrFieldState[currRow][currColumn] = el.colorId;
              const point = [currRow,currColumn];
              this.prevElemPos.push(point);
              if (!newCurrFieldState[currRow+1] || newCurrFieldState[currRow+1][currColumn] !== 0) {
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
    },()=>{if (newStateObj.collision) this.initNewElem()})

  }
  setRandomElement = () => {
    const elKeys = Object.keys(elements);
    const randomId = Math.floor(Math.random()*elKeys.length);
    const randomElName = elKeys[randomId];
    const randomState = Math.floor(Math.random()*elements[randomElName].length);
    this.setState({
      currEl : {
        name : randomElName,
        state : randomState,
        shapeArr: elements[randomElName][randomState],
        colorId : randomId + 1, // colors ['#fff','#2ecc71','#3498db','#9b59b6','#e74c3c','#f1c40f'];
        step: 0
      },
      activeColumnIndex: 5,
      activeRowIndex: -2
    })
  }
  isSideCollision = (side) => {
    const {currEl : {shapeArr}, activeColumnIndex, activeRowIndex, currFieldState} = this.state;

    let rowCorrIndex,
        blockCorrValue,
        exactRow,
        exactColumn,
        blockToCheck,
        blockIndex,
        corrValue,
        collision = false;

    if (shapeArr.length > 1) { // activeRowIndex will be in index === 1 of the shape
        for (var row = 0; row < shapeArr.length; row++) {
          rowCorrIndex = row === 0 ? -1 : row === 1 ? 0 : 1;
          blockIndex = side === 'right' ? shapeArr[row].length-1 : 0;
          corrValue = side === 'right' ? 1 : -1
          blockCorrValue = shapeArr[row][blockIndex] + corrValue;
          exactRow = activeRowIndex + rowCorrIndex;
          exactColumn = activeColumnIndex + blockCorrValue;

          blockToCheck = currFieldState[exactRow][exactColumn];
          if (blockToCheck > 0 || blockToCheck === undefined) collision = true;
        }
    } else {
        blockIndex = side === 'right' ? shapeArr[0].length-1 : 0;
        corrValue = side === 'right' ? 1 : -1
        blockCorrValue = shapeArr[0][blockIndex] + corrValue;
        exactRow = activeRowIndex;
        exactColumn = activeColumnIndex + blockCorrValue;

        const blockToCheck = currFieldState[exactRow][exactColumn];
        if (blockToCheck > 0 || blockToCheck === undefined) collision = true;
    }

    return collision
    
  }
  moveHorizontaly = (direction) => {
    if (this.isSideCollision(direction)) return;
    const {activeColumnIndex} = this.state;
    let index = direction === 'right' ? 1 : -1;

    this.setState({
      activeColumnIndex: activeColumnIndex + index
    },this.drawElem)
  }
  rotateElem = () => {
    const {currEl, activeColumnIndex} = this.state;
    const nextElemenState = currEl.state === (elements[currEl.name].length - 1) ? 0 : currEl.state+1;
    const nextElShapeArr = elements[currEl.name][nextElemenState];
    const isHaveLedge = (ledge) => nextElShapeArr.some(row=>row.includes(ledge));
    let nextActiveColumnIndex = activeColumnIndex;

    if (activeColumnIndex === 0 && isHaveLedge(-1)) nextActiveColumnIndex = 1;
    if (activeColumnIndex === 9 && isHaveLedge(1)) nextActiveColumnIndex = 8;

    this.setState({
      currEl: {...currEl, state: nextElemenState, shapeArr: nextElShapeArr},
      activeColumnIndex: nextActiveColumnIndex
    },this.drawElem)
  }
  onKeyDown = (e) => {
    if (this.state.collision) return;
    switch (e.nativeEvent.code) {
      case 'ArrowLeft':
        this.moveHorizontaly('left');
        break;
      case 'ArrowRight':
        this.moveHorizontaly('right');
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
    const {currFieldState} = this.state;
    return (
      <div className="App" onKeyDown={this.onKeyDown} tabIndex={0}>
          {currFieldState.map((row,rowI)=>row.map((el,i)=><Cell id={''+rowI+i} type={el} />))}
      </div>
    );
  }
}

export default App;
