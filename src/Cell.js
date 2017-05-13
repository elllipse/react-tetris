import React, {Component} from 'react';

const colors = ['#fff','#2ecc71','#3498db','#9b59b6','#e74c3c','#f1c40f'];

export default class Cell extends Component{

    shouldComponentUpdate(nextProps) {
        return this.props.type !== nextProps.type;
    }

    render() {
        const {type,id} = this.props;
        return <div className='cell' key={id} style={{backgroundColor:colors[type]}}></div> 
    }
    
}