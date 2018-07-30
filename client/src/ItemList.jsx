import React from 'react';
import deleteX from './assets/deleteX.png';
import edit from './assets/edit.png';
import CreateName from './CreateName';
import ItemInList from './ItemInList';

export default class ItemList extends React.Component{

  constructor(){
      super();

      this.state = {
        nameOpen: false,
        name: "",
        id:"",
        index: 0,
        isSong: false,
        isImage: false,
        mouseX: 0,
        mouseY: 0,
        indexBeingDragged:-1,
        mouseDown: false
      }

      this.checkHeld = null;

      this.editItem = this.editItem.bind(this);
      this.close = this.close.bind(this);
      this.updateMouse = this.updateMouse.bind(this);
      this.setElement = this.setElement.bind(this);
      this.releaseElement = this.releaseElement.bind(this);

    }

  updateMouse(e){

    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  }

  setElement(index){

    this.props.setItemIndex(index);

    this.setState({
      mouseDown: true
    })

    this.checkHeld = setTimeout(function() {
      let {mouseDown, indexBeingDragged} = this.state;
      if(mouseDown && indexBeingDragged===-1){
        this.setState({indexBeingDragged: index})
      }

    }.bind(this), 350);

  }

  setTarget(index){
    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.props.insertItemIntoList(index);
      this.setState({indexBeingDragged: index})
    }
  }

  releaseElement(){
    clearTimeout(this.checkHeld)
    this.setState({
      indexBeingDragged: -1,
      mouseDown: false
    })

  }

  editItem(name, id){
      this.setState({
        nameOpen: true,
        name: name,
        id: id
      })
    }

  close(){
      this.setState({nameOpen: false})
    }


  render(){
  let {itemList, backgrounds, itemIndex, db} = this.props;
  let {nameOpen, name, id, mouseX, mouseY, indexBeingDragged} = this.state;

  let list = [];
  for(var i = 0; i < itemList.length; ++i){
    list.push(itemList[i]);
  }
  let style;
  let itemStyle = {border:'0.25vw', borderColor: '#d9e3f4', borderStyle:'solid',
      width:"13.5vw", height:"7.65vw", marginTop:"3%"}
  let itemSelectedStyle = {border:'0.25vw', borderColor: '#4286f4', borderStyle:'solid',
          width:"13.5vw", height:"7.65vw", marginTop:"3%"}
  let itemDraggedStyle = {border:'0.25vw', borderColor: '#4286f4', borderStyle:'solid',
          width:"13.5vw", height:"7.65vw", marginTop:"3%", opacity:'0.5'}
  let SL = list.map((element, index) => {

    let selected = (index === itemIndex);
    let beingDragged = (indexBeingDragged === index)
    if(selected){
      style = itemSelectedStyle;
    }
    if(!selected){
      style = itemStyle;
    }
    if(beingDragged){
      style = itemDraggedStyle;
    }

  return(
    <div style={{display:'flex', userSelect:'none'}} key={index} id={"Item"+index}>
      <div style={style}
        onMouseDown={() => (this.setElement(index))}
        onMouseOver={() => (this.setTarget(index))}
        >
        {(selected && beingDragged) &&
          <ItemInList name={element.name} background={element.background} type={element.type}
            nameColor= {element.nameColor} backgrounds={backgrounds} x={mouseX} y={mouseY} moving={true}
            />
        }
        {(!selected || !beingDragged) &&
          <ItemInList name={element.name} background={element.background} type={element.type}
            nameColor= {element.nameColor} backgrounds={backgrounds} moving={false}
            />
        }

      </div>
        <div style={{padding:"3%"}}>
          <img style={{display:'block', width:'1.5vw', height:'1.5vw'}}
             onClick={() => (this.props.deleteItemFromList(index))}
             alt="delete" src={deleteX}
             />
           <img style={{display:'block', paddingTop:"10%", width:'1.5vw', height:'1.5vw'}}
            onClick={() => (this.editItem(element.name, element._id))}
            alt="edit" src={edit}
            />
        </div>
    </div>
  )
})



    return (
      <div>
        <div style={{display: 'flex', fontSize: "calc(8px + 0.4vw)"}}>


        </div>

        {nameOpen && <CreateName option="edit" name={name} id={id} db={db}
        close={this.close} updateItem={this.props.updateItem}
        />}
        <div style={{ height:'92.5vh', overflowY: 'scroll'}} onMouseMove={this.updateMouse}
           onMouseUp={this.releaseElement} onMouseLeave={this.releaseElement}>{SL}</div>

      </div>
    )
  }

}
