import React, {Component} from 'react';
import DisplayWindow from '../DisplayWindow';

export default class DisplayEditor extends Component{

  render() {

    let {wordIndex, item, backgrounds} = this.props;
    let slides = item.slides || null;
    let slide = slides ? slides[wordIndex] : null;
    let width = "100vw";
    let height = "56.25vw";

    let blankStyle = {width: width, height: height, background: 'black'}
    let blankTextStyle = {color: 'white', textAlign: 'center',
    fontSize: '5vw', paddingTop: '15%'}

    if(!slide)
      return (<div style={blankStyle}><div style={blankTextStyle}>No Item Selected</div></div>)

    let words = slide.boxes[0].words
    let style = {
      color: slide.boxes[0].fontColor,
      fontSize: slide.boxes[0].fontSize
    }
    // style.fontSize = slide ? item.slides[wordIndex].boxes[0].fontSize*2.25 + "vw" : '1vw';
    let background = slide.boxes[0].background

    return (
      <DisplayWindow words={words} style={style} background={background} backgrounds={backgrounds}
        width={width} height={height} title={''} titleSize={''}/>

    )
  }


}
