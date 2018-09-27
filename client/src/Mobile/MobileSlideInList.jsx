import React from 'react';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class MobileSlideInList extends React.Component{


  render(){
  let {words, backgrounds, width, height, titleSize, name, style} = this.props;

  let slide = {boxes: [{words: words, background: style.background, ...style}]}

    return (
      <DisplayWindow slide={slide} backgrounds={backgrounds}
        width={width} height={height} title={name} titleSize={titleSize}/>
    )
  }

}
