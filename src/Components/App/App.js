import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import GameOverMenu from '../GameOverMenu/GameOverMenu';
import InfoBlock from '../InfoBlock/InfoBlock';
import { getBlankState, elements } from '../../data/elements';
import isSideCollision from '../../utils/collisionChecker';
require('./App.css')

class App extends Component {
  constructor() {
    super()
    this.state = {
      currFieldState: getBlankState(),
      currEl: {
        name: 'I',
        state: 1,
        colorId: 1,
        step: 0
      },
      activeColumnIndex: 5,
      activeRowIndex: -2,
      bottomCollision: false,
      gameOver: false
    }

    this.prevElemPos = [];
    this.bottomcollisionTimeout = null;
    this.loopInterval = null;
  }

  componentDidMount() {
    this.initNewElem()
  }

  componentWillUnmount() {
    if (this.bottomcollisionTimeout) clearTimeout(this.bottomcollisionTimeout);
    if (this.loopInterval) clearInterval(this.loopInterval);
  }

  restartGame = () => {
    this.setState({ gameOver: false }, () => this.initNewElem())
  }

  initNewElem = () => {
    this.prevElemPos = [];
    this.checkFieldForFullRow();
    console.log('init new elem!')

    const testElem = (name, state) => {
      return {
        name: name,
        state: state,
        shapeArr: elements[name][state],
        colorId: 1, // colors ['#fff','#2ecc71','#3498db','#9b59b6','#e74c3c','#f1c40f'];
        step: 0
      };
    }

    if (this.loopInterval) clearInterval(this.loopInterval);
    this.setState({
      currEl: this.getRandomElement(),
      activeColumnIndex: 5,
      activeRowIndex: -2,
      bottomCollision: false,
    }, () => this.loopInterval = setInterval(this.gameLoop, 1000))
  }

  gameLoop = () => {
    console.log('game loop!')
    this.moveDown();
  }

  clearField = () => {
    const self = this;
    const { currFieldState } = this.state;
    const blocksCoords = [];
    currFieldState.forEach((row, rowI) =>
      row.forEach((block, blockI) =>
        block > 0 ? blocksCoords.push([rowI, blockI]) : false));

    function recursivelyClearBlocks() {
      const blockPos = blocksCoords.shift();
      if (!blockPos) return;
      currFieldState[blockPos[0]][blockPos[1]] = 0;
      self.setState({ currFieldState }, () => setTimeout(recursivelyClearBlocks, 50))
    }

    recursivelyClearBlocks()
  }

  gameOver = () => {
    console.log('gameOver!!!!')
    clearInterval(this.loopInterval)
    this.setState({ gameOver: true })
    this.clearField()
  }

  checkFieldForFullRow = () => {
    const currField = this.state.currFieldState;
    let fullRowIndexArr = [];
    currField.forEach((row, i) => {
      if (row.every(block => block > 0)) fullRowIndexArr.push(i);
    })

    if (fullRowIndexArr.length) {
      fullRowIndexArr.forEach(i => {
        currField.splice(i, 1);
        currField.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      });
      this.setState({
        currFieldState: currField
      })
    }

  }
  moveDown = (force) => {
    if (this.state.bottomCollision) return;
    if (force) clearInterval(this.loopInterval);

    const { currEl, activeRowIndex } = this.state;
    let newActiveRowIndex = currEl.step === 0 ?
      -elements[currEl.name][currEl.state].length + 1 : activeRowIndex + 1;

    this.setState({
      activeRowIndex: newActiveRowIndex,
      currEl: {...currEl, step: currEl.step + 1 }
    }, this.drawElem)

    if (force) this.loopInterval = setInterval(this.gameLoop, 1000);

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
      let bottomCollision = false;

      if (this.prevElemPos.length > 0) clearPrevElemPos(this.prevElemPos);

      currElArr.forEach((row, i) => {
        const currRow = currElemRow + (i - elemCenterRow);
        if (currRow > -1 && currRow < newCurrFieldState.length) {
          row.forEach(cell => {
            const currColumn = currElemColumn + cell;
            const point = [currRow, currColumn];
            if (currColumn > -1) newCurrFieldState[currRow][currColumn] = el.colorId;
            this.prevElemPos.push(point);
            if (!newCurrFieldState[currRow + 1] || newCurrFieldState[currRow + 1][currColumn] !== 0) {
              bottomCollision = currRow === 0 ? 'atFirstRow' : true;
            }
          })
        }

      })

      if (bottomCollision === 'atFirstRow') return false;

      return {
        currFieldState: newCurrFieldState,
        bottomCollision
      };
    }

    const newStateObj = drawElement(currFieldState, activeRowIndex, activeColumnIndex, currEl);

    if (!newStateObj) return this.gameOver();

    this.setState({
      ...newStateObj
    }, () => {
      if (this.state.bottomCollision) {
        this.bottomcollisionTimeout = setTimeout(() => {
          if (this.state.bottomCollision) this.initNewElem()
        }, 1000)
      }
    })

  }

  getRandomElement = () => {
    const elKeys = Object.keys(elements);
    const randomId = Math.floor(Math.random() * elKeys.length);
    const randomElName = elKeys[randomId];
    const randomState = Math.floor(Math.random() * elements[randomElName].length);
    console.log('randomElName', randomElName);
    console.log('randomState', randomState);
    return {
      name: randomElName,
      state: randomState,
      shapeArr: elements[randomElName][randomState],
      colorId: randomId + 1, // colors ['#fff','#2ecc71','#3498db','#9b59b6','#e74c3c','#f1c40f'];
      step: 0
    }
  }

  moveHorizontally = (direction) => {
    const { activeColumnIndex, activeRowIndex, currFieldState, currEl: { shapeArr } } = this.state;
    const area = direction === 'right' ? 'afterRight' : 'beforeLeft';
    const collision = isSideCollision({ shapeArr, activeColumnIndex, activeRowIndex, currFieldState, prevElemPos: this.prevElemPos });

    if (collision[area]) return;
    let index = direction === 'right' ? 1 : -1;

    this.setState({
      activeColumnIndex: activeColumnIndex + index
    }, this.drawElem)
  }

  rotateElem = () => {
    if (this.state.collision) return;
    const { currEl, activeColumnIndex, activeRowIndex, currFieldState } = this.state;
    if (elements[currEl.name].length === 1) return;

    const nextElemenState = currEl.state === (elements[currEl.name].length - 1) ? 0 : currEl.state + 1;
    const nextElShapeArr = elements[currEl.name][nextElemenState];
    let nextActiveColumnIndex = activeColumnIndex;

    const nextShapeCollision = isSideCollision({ shapeArr: nextElShapeArr, activeColumnIndex, activeRowIndex, currFieldState, prevElemPos: this.prevElemPos });

    const leftCollision = nextShapeCollision['left'];
    const rightCollision = nextShapeCollision['right'];
    const afterRightCollision = nextShapeCollision['afterRight'];
    const beforeRightCollision = nextShapeCollision['beforeRight'];
    const beforeLeftCollision = nextShapeCollision['beforeLeft'];
    const twoBeforeLeftCollision = nextShapeCollision['twoBeforeLeft'];

    //*******************************TODO - L[1] COLLISION CHECK **************************************** 

    if (leftCollision && rightCollision) return;
    if (leftCollision && afterRightCollision) return;
    if (rightCollision && beforeLeftCollision) return;
    //if ((beforeRightCollision || rightCollision) && (beforeLeftCollision || twoBeforeLeftCollision)) return;

    if (beforeRightCollision && (!beforeLeftCollision && !twoBeforeLeftCollision)) nextActiveColumnIndex -= 2;
    else if (leftCollision && !afterRightCollision) nextActiveColumnIndex++;
    else if (rightCollision && !beforeLeftCollision) nextActiveColumnIndex--;

    this.setState({
      currEl: {...currEl, state: nextElemenState, shapeArr: nextElShapeArr },
      activeColumnIndex: nextActiveColumnIndex
    }, this.drawElem)
  }
  onKeyDown = (e) => {
    //if (this.state.collision) return;
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
    const { currFieldState, gameOver, currEl } = this.state;
    const { name: elName, state: elState } = currEl;

    return (
      <div className='app' onKeyDown={ gameOver ? null : this.onKeyDown} tabIndex={0}>

        <div className='field'> 

          <InfoBlock shape={elements[elName][elState]}/>

          {currFieldState.map((row,rowI)=>
            row.map((el,i)=>
              <Cell id={''+rowI+i} type={el} />
          ))}
          
        </div>

        {gameOver && <GameOverMenu restartGame={this.restartGame}/>}

      </div>
    );
  }
}

export default App;