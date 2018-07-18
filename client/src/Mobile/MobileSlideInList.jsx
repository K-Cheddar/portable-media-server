import React from 'react';

export default class MobileSlideInList extends React.Component{


  render(){
  let {words, backgrounds, background, color, fontSize} = this.props;
  let img = "";
  let style = {
    textAlign: 'center',
    background: 'transparent',
    border: 0,
    resize:'none',
    height: '85%',
    width: '85%',
    fontFamily: "Verdana",
    padding: "10% 7.5%",
    fontSize: fontSize*0.75+"vw",
    whiteSpace:'pre-wrap',
  }

  if (color)
    style.color = color

  if(backgrounds.some(e => e.name === background))
    img = backgrounds.find(e => e.name === background).image.src;

    return (
        <div style={{backgroundImage: 'url('+img+')',
          width: "33vw", height: "99%", backgroundSize: '100% 100%'}}>
          <div style={style}>
            {words}
          </div>
        </div>
    )
  }

}
