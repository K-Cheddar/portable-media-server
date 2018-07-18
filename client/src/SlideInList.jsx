import React from 'react';
import blank from './assets/blank.png';

export default class SlideInList extends React.Component{


  render(){
  let {words, backgrounds, sBackground, background, color, fontSize, moving, x, y} = this.props;
  let img = blank;
  let style = {
    textAlign: 'center',
    background: 'transparent',
    border: 0,
    resize:'none',
    height: '85%',
    width: '85%',
    fontFamily: "Verdana",
    padding: '7.5%',
    fontSize: fontSize*0.2735+"vw",
    whiteSpace:'pre-wrap',
    overflow: 'hidden'
  }

  if (color)
    style.color = color

    if(backgrounds){
      if(sBackground)
        background = sBackground
      if(backgrounds.some(e => e.name === background))
        img = backgrounds.find(e => e.name === background).image.src;
    }

    let backgroundStyle = {backgroundImage: 'url('+img+')',
      width: "100%", height: "100%", backgroundSize: '100% 100%'}

    if(moving){
      backgroundStyle.position = 'absolute';
      backgroundStyle.left = (x+3)  + 'px';
      backgroundStyle.top = (y+3)  + 'px';
      backgroundStyle.width = "12.24vmax";
      backgroundStyle.height = "7.5vmax";
    }

    return (
        <div style={backgroundStyle}>
          <div style={style}>
            {words}
          </div>
        </div>
    )
  }

}
