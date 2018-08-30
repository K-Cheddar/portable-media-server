import React, {Component} from 'react';
import DisplayEditor from '../DisplayEditor';

export default class MobileDisplay extends Component{

  render() {

    let {wordIndex, item, backgrounds, updateItem} = this.props;
    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;
    let width = "100vw";
    let height = "56.25vw";

    let blankStyle = {width: width, height: height, background: 'black'}
    let blankTextStyle = {color: 'white', textAlign: 'center',
    fontSize: '5vw', paddingTop: '15%'}

    if(!slide)
      return (<div style={blankStyle}><div style={blankTextStyle}>No Item Selected</div></div>)

    return (
      <DisplayEditor wordIndex={wordIndex} backgrounds={backgrounds}
        item={item} updateItem={updateItem} width={width} height={height}/>
    )
  }


}
