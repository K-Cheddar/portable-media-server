import React from 'react';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class SlideInList extends React.Component{


  render(){
  let {backgrounds, slide, moving, x, y, width, height, name, titleSize} = this.props;

    let divStyle={width: width, height: height}

    if(moving){
      divStyle.left = (x+3)  + 'px';
      divStyle.top = (y+3)  + 'px';
    }

    // let slide = {boxes: [{words: words, background: style.background, ...style}]}

    return (
      <div style={divStyle}>
        <DisplayWindow slide={slide} backgrounds={backgrounds}
          width={width} height={height} title={slide.type} titleSize={titleSize}/>
      </div>
    )
  }

}
