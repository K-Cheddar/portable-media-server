import React from 'react';
import DisplayWindow from '../DisplayWindow';

export default class MobileSlideInList extends React.Component{


  render(){
  let {words, backgrounds, width, height, titleSize, name, background, color, fontSize} = this.props;

  let style = {
    color: color,
    fontSize: fontSize
  }

    return (
      <DisplayWindow words={words} style={style} background={background} backgrounds={backgrounds}
        width={width} height={height} title={name} titleSize={titleSize}/>
    )
  }

}
