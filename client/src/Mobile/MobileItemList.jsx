import React from 'react';
import MobileItemInList from './MobileItemInList';

export default class MobileItemList extends React.Component{

  render(){
  let {itemList, backgrounds, itemIndex} = this.props;

  let list = [];
  for(var i = 0; i < itemList.length; ++i){
    list.push(itemList[i]);
  }

  let width = "36vw";
  let height = "20.25vw";
  //.75vw -> fontSize, .1vw -> titleBorder, .25vw -> border
  let fullHeight = `calc(${height} + 3vw + .1vw + .75vw)`

  let SL = list.map((element, index) => {
  return(
    <div style={{display:'flex'}} key={index} id={"MItem"+index}>
      <div style={(index === itemIndex) ? {border:'0.75vmax', borderColor: '#06d1d1', borderStyle:'solid',
         width:width, height: fullHeight, marginTop:"3%"}
       : {border:'0.75vmax', borderColor: '#383838', borderStyle:'solid',
          width:width, height: fullHeight, marginTop:"3%"}}
        onClick={() => this.props.setItemIndex(index)}
        >
        <MobileItemInList name={element.name} background={element.background} type={element.type}
          nameColor = {element.nameColor} backgrounds={backgrounds} width={width} height={height}
          />
      </div>
    </div>
  )
})
    return (
      <div>
        <div style={{ height:'75vh', width:'45vw', overflowY: 'scroll',
          overflowX: 'hidden', marginLeft:'2vw'}}>{SL}</div>
        <button style={{marginTop:'2vh', marginBottom:'1vh', marginLeft:'33vw', width:'30%', height:'4.5vh',
          fontSize:'calc(8px + 0.75vmax)'}} onClick={this.props.close}>Close</button>
      </div>
    )
  }

}
