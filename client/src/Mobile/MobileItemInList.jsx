import React from 'react';
import DisplayWindow from '../DisplayWindow';

export default class MobileItemInList extends React.Component{


  render(){
  let {name, backgrounds, background, nameColor, type, width, height} = this.props;

    let words = name
    if(type === 'image')
      words = ""

    let style ={
      fontColor: nameColor,
      fontSize: 4.5
    }



    return (
      <DisplayWindow words={words} style={style} background={background} backgrounds={backgrounds}
        width={width} height={height} title={name} titleSize={'3vw'}/>
    )
  }

}
