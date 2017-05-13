import React, { Component } from 'react';
import Cell from './Cell';
import elements from './elements';
import './App.css';

const defaultFieldState = () => [
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

class App extends Component {
  constructor() {
    super()
    this.state = {
      fieldState : defaultFieldState(),
      currEl: {
        name : 'O',
        state : 0,
        colorId : 1,
        step: 0
      },
      activeColumnIndex: 5,
      activeRowIndex: -1
    }
  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    console.log('REINIT!')
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.setRandomElement();
    this.loopInterval = setInterval(this.gameLoop,100);
  }
  gameLoop = () => {
    this.drawElem();
    this.moveDown();
  }
  moveDown = () => {
    const {currEl, activeRowIndex} = this.state;
    let newActiveRowIndex = currEl.step === 0 ? 
          -elements[currEl.name][currEl.state].length : activeRowIndex+1;
    
    this.setState({
      activeRowIndex: newActiveRowIndex,
      currEl: {...currEl, step: currEl.step+1}
    })

  }
  drawElem = () => {
    const { currEl, fieldState, activeColumnIndex, activeRowIndex} = this.state;
    const newStateObj = drawElement(fieldState, activeRowIndex, activeColumnIndex, currEl);

    function drawElement(prevArr, mainRow, mainColumn, el) {
      const currElArr = elements[el.name][el.state];
      const newArr = defaultFieldState();
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
      fieldState: newStateObj.fieldState
    })

    if (newStateObj.collision) this.init()

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
        colorId : randomId + 1, // colors ['#fff','#2ecc71','#3498db','#9b59b6','#e74c3c','#f1c40f'];
        step: 0
      }
    })
  }

  render() {
    const {fieldState} = this.state;
    return (
      <div className="App" onClick={this.gameLoop}>
          {fieldState.map((row,rowI)=>row.map((el,i)=><Cell id={''+rowI+i} type={el} />))}
      </div>
    );
  }
}

export default App;
