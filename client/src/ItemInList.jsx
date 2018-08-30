import React from 'react';
import DisplayWindow from './DisplayWindow';

export default class ItemInList extends React.Component{


  render(){
  let {name, backgrounds, background, nameColor, type, moving, x, y, width, height} = this.props;

  let words = ""

  if(type !== 'image')
    words = name

  let divStyle={width: width, height: height}

  if(moving){
    divStyle.left = `calc(${x}px - 5vw)`;
    divStyle.top = `calc(${y}px - 10vh)`;
    divStyle.position = 'absolute';
  }

  let style = {fontSize: 4.5, fontColor: nameColor}

    return (
        <div style={divStyle}>
          <DisplayWindow words={words} style={style} background={background} backgrounds={backgrounds}
            width={width} title={name} titleSize={".75vw"}/>
        </div>
    )
  }

}
