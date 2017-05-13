import React, { Component } from 'react';
import Cell from './Cell';
import elements from './elements';
import './App.css';

const defaultFieldState = [
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
      fieldState : defaultFieldState,
      currentElement : 'O',
      activeColumnIndex: 5,
      activeRowIndex: 5
    }
  }
  moveDown = () => {

  }
  addElement = () => {
    const { currentElement, fieldState, activeColumnIndex, activeRowIndex} = this.state;
    const randomElement = this.getRandomElement();
    const newArr = changeArray(fieldState, activeRowIndex, activeColumnIndex, randomElement);

    function changeArray(prevArr, mainRow, mainColumn, element) {
      const newArr = [...prevArr];
      const elemLength = element.length
      const elemCenterRow = elemLength === 1 ? 0 : 1;

      element.forEach((row,i)=>{
        const currRow = mainRow + (i - elemCenterRow);
        row.forEach(cell=>{
          const currColumn = mainColumn + cell
          newArr[currRow][currColumn] = 1;
        })
      })

      return newArr;
    }

    this.setState({
      fieldState: newArr
    })

  }
  getRandomElement = () => {
    const elKeys = Object.keys(elements);
    const randomId = Math.floor(Math.random()*elKeys.length);
    const randomElement = elKeys[randomId];
    const randomState = Math.floor(Math.random()*randomElement.length);
    console.log('randomElement',randomElement)
    console.log('randomId',randomId)
    return elements[randomElement][randomState];
  }
  render() {
    const {fieldState} = this.state;
    return (
      <div className="App" onClick={this.addElement}>
          {fieldState.map((row,rowI)=>row.map((el,i)=><Cell id={''+rowI+i} type={el} />))}
      </div>
    );
  }
}

export default App;
