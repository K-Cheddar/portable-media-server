import React from 'react';

export default class MobileItemInList extends React.Component{


  render(){
  let {name, backgrounds, background, nameColor, type} = this.props;
  let img = "";
  if(type === 'image')
    name = ""
  let style = {
    textAlign: 'center',
    background: 'transparent',
    border: 0,
    resize:'none',
    height: '100%',
    width: '100%',
    fontFamily: "Verdana",
    paddingTop: "2%",
    fontSize: "4vmax",
  }

  if (nameColor)
    style.color = nameColor

  if(backgrounds.some(e => e.name === background))
    img = backgrounds.find(e => e.name === background).image.src;

    return (
        <div style={{overflow: 'hide', backgroundImage: 'url('+img+')',
          width: "100%", height: "100%", backgroundSize: '100% 100%'}}>
          <div style={style}>
            {name}
          </div>
        </div>
    )
  }

}
