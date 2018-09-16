import React from 'react';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class MobileSlideInList extends React.Component{


  render(){
  let {words, backgrounds, width, height, titleSize, name, style} = this.props;

    return (
      <DisplayWindow words={words} style={style} background={style.background} backgrounds={backgrounds}
        width={width} height={height} title={name} titleSize={titleSize}/>
    )
  }

}
