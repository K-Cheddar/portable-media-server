import React from 'react';

export default class MobileListChanger extends React.Component{

  render(){
  let {itemLists, selectItemList, selectedItemList} = this.props;

  let list = itemLists.map((ele, index) => {
  let element = ele.name
  return(
    <div style={{display:'flex'}} key={index} id={"MItem"+index}>
      <div style={(selectedItemList === element) ? {border:'0.75vmax', borderColor: '#4286f4', borderStyle:'solid',
         width:"20vmax", height:"5vmax", marginTop:"3%"}
       : {border:'0.75vmax', borderColor: '#93bbf9', borderStyle:'solid',
          width:"20vmax", height:"5vmax", marginTop:"3%"}}
        onClick={() => (selectItemList(element))}
        >
        {element}
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
