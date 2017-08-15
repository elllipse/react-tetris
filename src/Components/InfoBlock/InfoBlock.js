import React, { Component } from 'react';
require('./InfoBlock.css')

const getBlankState = () => [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

const Cell = ({ active }) => (
  <div className={active ? 'info_block_cell info_block_cell-active' : 'info_block_cell'}/>
)

export default class InfoBlock extends Component {

  constructor() {
    super()
    this.state = {
      currFieldState: getBlankState()
    }
  }

  shouldComponentUpdate(nextProps) {
    return true;
  }

  componentWillReceiveProps(nextProps) {
    const { shape } = nextProps;
    this.drawElem(shape)
  }

  drawElem = (shape) => {

    const newCurrFieldState = getBlankState();
    const elemLength = shape.length;
    const elemCenterRow = elemLength === 1 ? 0 : 1;

    shape.forEach((row, i) => {
      const currRow = 2 + (i - elemCenterRow);
      if (currRow > -1 && currRow < newCurrFieldState.length) {
        row.forEach(cell => {
          const currColumn = 3 + cell;
          const point = [currRow, currColumn];
          newCurrFieldState[currRow][currColumn] = 1;
        })
      }
    })

    this.setState({ currFieldState: newCurrFieldState })

  }


  render() {
    const { currFieldState } = this.state;

    return <div className='info_block' onClick={this.drawElem}>
      <div className='info_block_section info_block_section-left'>
        <div>score</div>
        <div className='info_block_score'>100</div>
      </div>
      <div className='info_block_section info_block_section-right'>
        <div>next</div>
        <div className='info_block_next'>
          {currFieldState.map((row,rowI)=>
            row.map((el,i)=>
              <Cell id={''+rowI+i} active={el} />
          ))}
        </div>
      </div>
    </div>
  }

}