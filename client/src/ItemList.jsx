import React from 'react';
import deleteX from './assets/deleteX.png';
import duplicate from './assets/duplicate.png';
import edit from './assets/edit.png';
import CreateName from './CreateName';
import ItemInList from './ItemInList';
import {HotKeys} from 'react-hotkeys';

export default class ItemList extends React.Component{

  constructor(){
      super();

      this.state = {
        nameOpen: false,
        name: "",
        id:"",
        index: 0,
        mouseX: 0,
        mouseY: 0,
        indexBeingDragged:-1,
        mouseDown: false
      }

      this.handlers = {
        'nextItem': this.nextItem,
        'prevItem': this.prevItem
      }
      this.checkHeld = null;
    }

    // shouldComponentUpdate(nextProps, nextState){
    //   let {itemList, db, backgrounds, itemIndex} = this.props;
    //   let {nameOpen, name, id, index, mouseX, mouseY, indexBeingDragged, mouseDown} = this.state;
    //
    //   if(JSON.stringify(itemList) !== JSON.stringify(nextProps.itemList))
    //     return true;
    //   if(db !== nextProps.db)
    //     return true;
    //   if(backgrounds !== nextProps.backgrounds)
    //     return true;
    //   if(itemIndex !== nextProps.itemIndex)
    //     return true;
    //   if(nameOpen !== nextState.nameOpen)
    //     return true;
    //   if(name !== nextState.name)
    //     return true;
    //   if(id !== nextState.id)
    //     return true;
    //   if(index !== nextState.index)
    //     return true;
    //   if(mouseX !== nextState.mouseX)
    //     return true;
    //   if(mouseY !== nextState.mouseY)
    //     return true;
    //   if(indexBeingDragged !== nextState.indexBeingDragged)
    //     return true;
    //   if(mouseDown !== nextState.mouseDown)
    //     return true;
    //   return false;
    // }

  updateMouse = (e) => {

    if(!this.state.mouseDown)
      return;
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  }



  setElement = (index) => {

    this.props.setItemIndex(index);

    this.setState({
      mouseDown: true
    })

    this.checkHeld = setTimeout(function() {
      let {mouseDown, indexBeingDragged} = this.state;
      if(mouseDown && indexBeingDragged===-1){
        this.setState({indexBeingDragged: index})
      }

    }.bind(this), 250);

  }

  setTarget = (index) => {
    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.props.insertItemIntoList(index);
      this.setState({indexBeingDragged: index})
    }
  }

  releaseElement = () => {
    if(!this.state.mouseDown)
      return;
    clearTimeout(this.checkHeld)
    this.setState({
      indexBeingDragged: -1,
      mouseDown: false
    })

  }

  editItem = (name, id) =>{
      this.setState({
        nameOpen: true,
        name: name,
        id: id
      })
    }

  close = () => {
      this.setState({nameOpen: false})
    }

  nextItem = () => {
    let {itemList, itemIndex} = this.props;
    if(!itemList.length || itemList.length === 0)
      return;
    let lastItem = itemList.length-1;
    if(itemIndex < lastItem)
      this.props.setItemIndex(itemIndex+1)
  }

  prevItem = () => {
    let {itemList, itemIndex} = this.props;
    if(!itemList.length || itemList.length === 0)
      return;
    if(itemIndex > 0)
      this.props.setItemIndex(itemIndex-1)
  }


  render(){
  let {itemList, backgrounds, itemIndex, db} = this.props;
  let {nameOpen, name, id, mouseX, mouseY, indexBeingDragged} = this.state;

  let list = [];
  for(var i = 0; i < itemList.length; ++i){
    list.push(itemList[i]);
  }

  let width="10.4vw";
  let height="5.85vw"

  //.75vw -> fontSize, .5vw -> padding Top/Bot, .1vw -> titleBorder, .25vw -> border
  let fullHeight = `calc(${height} + .75vw + .5vw + .1vw + .25vw)`

  let style;
  let itemStyle = {border:'0.25vw', borderColor: '#d9e3f4', borderStyle:'solid',
      width:width, height:fullHeight, marginTop:"3%"}
  let itemSelectedStyle = {border:'0.25vw', borderColor: '#4286f4', borderStyle:'solid',
          width:width, height:fullHeight, marginTop:"3%"}
  let itemDraggedStyle = {border:'0.25vw', borderColor: '#ffdb3a', borderStyle:'solid',
          width:width, height:fullHeight, marginTop:"3%", opacity:'0.5'}
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
            nameColor= {element.nameColor} backgrounds={backgrounds} x={mouseX} y={mouseY}
            moving={true} width={width} height={height}
            />
        }
        {(!selected || !beingDragged) &&
          <ItemInList name={element.name} background={element.background} type={element.type}
            nameColor= {element.nameColor} backgrounds={backgrounds} moving={false}
            width={width} height={height}
            />
        }

      </div>
        <div style={{padding:"3%"}}>
          <img style={{display:'block', width:'1.25vw', height:'1.25vw'}}
             onClick={() => (this.props.deleteItemFromList(index))}
             alt="delete" src={deleteX}
             />
           <img style={{display:'block', paddingTop:"10%", width:'1.25vw', height:'1.25vw'}}
            onClick={() => (this.editItem(element.name, element._id))}
            alt="edit" src={edit}
            />
          <img style={{display:'block', paddingTop:"10%", width:'1.25vw', height:'1.25vw'}}
             onClick={() => (this.props.duplicateItem(element._id))}
             alt="duplicate" src={duplicate}
             />
        </div>
    </div>
  )
})


  let noItemStyle = { height:'20vh', overflowY: 'hidden', overflowX: 'hidden', fontSize: 'calc(5px + 1.5vw)',
    color: 'white', textAlign: 'center', marginTop: '5vh'}

    return (
      <div>
        {nameOpen && <CreateName option="edit" name={name} id={id} db={db}
        close={this.close} updateItem={this.props.updateItem}
        />}
        <HotKeys handlers={this.handlers}>
        {itemList.length > 0 && <div style={{ height:'92.5vh', overflowY: 'scroll', overflowX: 'hidden'}} onMouseMove={this.updateMouse}
           onMouseUp={this.releaseElement} onMouseLeave={this.releaseElement}>{SL}</div>}
        {itemList.length === 0 && <div style={noItemStyle}> Nothing Added Yet</div>}
        </HotKeys>
      </div>
    )
  }

}
