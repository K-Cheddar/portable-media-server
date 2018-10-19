import React from 'react';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class MobileSlideInList extends React.Component{


  render(){
  let {slide, backgrounds, width, height, titleSize} = this.props;

    return (
      <DisplayWindow slide={slide} backgrounds={backgrounds}
        width={width} height={height} title={slide.type} titleSize={titleSize}/>
    )
  }

}
