import React from 'react';
import blank from './assets/blank.png';

export default class ItemInList extends React.Component{


  render(){
  let {name, backgrounds, background, nameColor, type, moving, x, y} = this.props;
  let img = blank;
  if(type === 'image')
    name = ""
  let style = {
    textAlign: 'center',
    background: 'transparent',
    border: 0,
    resize:'none',
    height: '96%',
    width: '96%',
    fontFamily: "Verdana",
    padding: "2%",
    fontSize: "1.25vw",
  }

  if(backgrounds){
      if(backgrounds.some(e => e.name === background))
        img = backgrounds.find(e => e.name === background).image.src;
  }

  let backgroundStyle = {overflow: 'hide', backgroundImage: 'url('+img+')',
    width: "100%", height: "100%", backgroundSize: '100% 100%'}

  if(moving){
    backgroundStyle.position = 'absolute';
    backgroundStyle.left = (x+2)  + 'px';
    backgroundStyle.top = (y+2) + 'px';
    backgroundStyle.width = "13.5vw";
    backgroundStyle.height = "7.65vw";
  }

  if (nameColor)
    style.color = nameColor

    return (
        <div style={backgroundStyle}>
          <div style={style}>
            {name}
          </div>
        </div>
    )
  }

}
