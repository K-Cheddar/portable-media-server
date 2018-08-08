import React from 'react';
import DisplayWindow from './DisplayWindow';

export default class SlideInList extends React.Component{


  render(){
  let {words, backgrounds, background, color, fontSize, moving, x, y,
    width, height, name, titleSize, brightness} = this.props;

    let divStyle={width: width, height: height}

    if(moving){
      divStyle.left = (x+3)  + 'px';
      divStyle.top = (y+3)  + 'px';
    }

    let style = {fontSize: fontSize, color: color}

    return (
      <div style={divStyle}>
        <DisplayWindow words={words} style={style} background={background} backgrounds={backgrounds}
          width={width} height={height} title={name} titleSize={titleSize} brightness={brightness}/>
      </div>
    )
  }

}
