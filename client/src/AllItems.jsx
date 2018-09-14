import React from 'react';
import deleteX from './assets/deleteX.png';
import add from './assets/addItem.png';
import DeleteConfirmation from './DeleteConfirmation';
import DisplayWindow from './DisplayWindow';

export default class AllItems extends React.Component{

  constructor(){
    super();
    this.state={
      text: "",
      deleteOverlay: false,
      name: ""
    }

  }

  updateText = (event) => {
    this.setState({text: event.target.value})
  }

  openConfirmation = (name) => {
    this.setState({
      deleteOverlay: true,
      name: name
    })
  }

  cancel = () => {
    this.setState({deleteOverlay: false})
  }

  confirm = () => {
    this.setState({deleteOverlay: false})
    this.props.deleteItem(this.state.name)
  }

  render(){
  let {allItems, backgrounds} = this.props;
  let {text, deleteOverlay, name} = this.state;

  let filteredList = [];
  if(text.length > 0){
    filteredList = allItems.filter(ele => ele.name.toLowerCase().includes(text.toLowerCase()))
  }
  else{
    filteredList = allItems.slice(0);
  }

  let width = '3.5vw';

  let SL = filteredList.map((element, index) => {
    let imageStyle = {fontSize: 4.5, fontColor: element.nameColor}
    return(
      <div style={{display:'flex', padding:'1%'}} key={index}>
        <div style={{width:'75%', fontSize:'1.15vw'}}>{element.name}</div>
        <DisplayWindow words={''} style={imageStyle} background={element.background} backgrounds={backgrounds}
          width={width} title={''} titleSize={''}/>
        <div style={{width:'15%', marginLeft: '1.5vw'}}>
          <img className='imgButton' style={{width:'1.5vw', height:'1.5vw'}}
             onClick={() => (this.props.addItemToList(element))}
             alt="add" src={add}
            />
          <img className='imgButton' style={{marginLeft:'1vw', width:'1.5vw', height:'1.5vw'}}
             onClick={ () => (this.openConfirmation(element.name))}
             alt="delete" src={deleteX}
            />
        </div>
      </div>
    )
  })
    return (
      <div style={{color: 'white', marginTop: '2vh'}}>
        <div>All Items</div>
        <input type='text' value={this.state.text} onChange={this.updateText}
          style={{width:'70%', padding:'1%'}}/>
        <div style={{overflowX: 'hidden', height:'32vh'}}>{SL}</div>
        {deleteOverlay &&
          <div style={{position:'fixed', top:0, left:0, height:'100vh', width:'100vw',
             zIndex: 9, backgroundColor:'rgba(62, 64, 66, 0.5)'}}>
             <DeleteConfirmation confirm={this.confirm}
               cancel={this.cancel} name={name}  />
        </div>}
      </div>
    )
  }

}
