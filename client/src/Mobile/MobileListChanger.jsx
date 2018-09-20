import React from 'react';

export default class MobileListChanger extends React.Component{

  render(){
  let {itemLists, selectItemList, selectedItemList} = this.props;

  let listNameStyle = {border:'0.75vmax', borderColor: '#c4c4c4', borderStyle:'solid',
     width:"20vmax", height:"5vmax", marginTop:"3%", padding: '5%'};
  let selectedStyle = Object.assign({}, listNameStyle);
  selectedStyle.borderColor = '#06d1d1';

  let list = itemLists.map((element, index) => {
  return(
    <div style={{display:'flex'}} key={index} id={"MItem"+index}>
      <div style={(selectedItemList.name === element.name) ?  selectedStyle : listNameStyle}
        onClick={() => selectItemList(element.name)}>
        {element.name}
      </div>
    </div>
  )
})
    return (
      <div>
        <div style={{ height:'75vh', width:'20vw', marginLeft:'2vw', fontSize:'calc(8px + 0.75vmax)'}}>{list}</div>
      </div>
    )
  }

}
