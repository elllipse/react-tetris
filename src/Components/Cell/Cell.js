import React, { Component } from 'react';

const cellStyle = {
  display: 'inline-block',
  boxSizing: 'border-box',
  margin: '1px',
  border: '1px solid #e3e3e3',
  width: '25px',
  height: '25px'
}

const colors = ['#fff', '#34495e', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#1abc9c', '#e67e22'];

export default class Cell extends Component {

  shouldComponentUpdate(nextProps) {
    return this.props.type !== nextProps.type;
  }

  render() {
    const { type, id } = this.props;
    const newCellStyle = {...cellStyle, backgroundColor: colors[type] }

    return <div style={newCellStyle} className='cell' key={id} ></div>
  }

}