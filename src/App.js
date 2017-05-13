import React, { Component } from 'react';
import Cell from './Cell';
import {elements} from './elements';
import './App.css';

const blankState = () => {
  return [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
      ];
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      fieldState : blankState(),
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
  moveDown = () => {
    const {currEl, activeRowIndex} = this.state;
    let newActiveRowIndex = currEl.step === 0 ? 
          -elements[currEl.name][currEl.state].length+1 : activeRowIndex+1;
    
    this.setState({
      activeRowIndex: newActiveRowIndex,
      currEl: {...currEl, step: currEl.step+1}
    },this.drawElem)

  }
  drawElem = () => {
    const { currEl, fieldState, activeColumnIndex, activeRowIndex} = this.state;
    const newStateObj = drawElement(fieldState, activeRowIndex, activeColumnIndex, currEl);

    function drawElement(prevArr, mainRow, mainColumn, el) {
      const currElArr = elements[el.name][el.state];
      const newArr = blankState();
      const elemLength = currElArr.length
      const elemCenterRow = elemLength === 1 ? 0 : 1;
      let collision = false;

      currElArr.forEach((row,i)=>{
        const currRow = mainRow + (i - elemCenterRow);
        if (currRow > -1 && currRow < prevArr.length) {
          row.forEach(cell=>{
            const currColumn = mainColumn + cell;
            if (currColumn > -1)
              newArr[currRow][currColumn] = el.colorId;
              if (!newArr[currRow+1] || newArr[currRow+1][currColumn] !== 0) {
                collision = true;
              }
          })
        }
          
      })
      
      return {
        fieldState: newArr,
        collision
      };
    }
    
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
  moveHorizontaly = (index) => {
    const {shapeArr} = this.state.currEl;
    const isHaveLedge = (ledge) => shapeArr.some(row=>row.includes(ledge));

    if (index === -1 || index === 10) return;
    if (index === 0 && isHaveLedge(-1)) return;
    if (index === 9 && isHaveLedge(1)) return;

    this.setState({
      activeColumnIndex: index
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
    let { activeColumnIndex } = this.state;
    switch (e.nativeEvent.code) {
      case 'ArrowLeft':
        this.moveHorizontaly(activeColumnIndex-1);
        break;
      case 'ArrowRight':
        this.moveHorizontaly(activeColumnIndex+1);
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowUp':
        this.rotateElem();
        break;
      default:
        return
    }
  }

  render() {
    const {fieldState} = this.state;
    return (
      <div className="App" onKeyDown={this.onKeyDown} tabIndex={0}>
          {fieldState.map((row,rowI)=>row.map((el,i)=><Cell id={''+rowI+i} type={el} />))}
      </div>
    );
  }
}

export default App;
