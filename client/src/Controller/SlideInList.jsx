import React from 'react';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class SlideInList extends React.Component{


  render(){
  let {words, backgrounds, style, moving, x, y, width, height, name, titleSize} = this.props;

    let divStyle={width: width, height: height}

    if(moving){
      divStyle.left = (x+3)  + 'px';
      divStyle.top = (y+3)  + 'px';
    }

    return (
      <div style={divStyle}>
        <DisplayWindow words={words} style={style} background={style.background} backgrounds={backgrounds}
          width={width} height={height} title={name} titleSize={titleSize}/>
      </div>
    )
  }

}
