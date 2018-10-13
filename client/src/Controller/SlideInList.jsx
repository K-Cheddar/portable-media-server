import React from 'react';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class SlideInList extends React.Component{


  render(){
  let {backgrounds, slide, moving, x, y, width, height, titleSize} = this.props;

    let divStyle={width: width, height: height}

    if(moving){
      divStyle.left = `calc(${x}px - 5vw)`;
      divStyle.top = `calc(${y}px - 10vh)`;
      divStyle.position = 'absolute';
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
