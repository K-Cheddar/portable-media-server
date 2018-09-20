import React from 'react';
import deleteX from '../assets/deleteX.png';
import add from '../assets/addItem.png';
import DeleteConfirmation from '../DeleteConfirmation';
import DisplayWindow from '../DisplayElements/DisplayWindow';

export default class ExistingItems extends React.Component{

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
    this.props.functions.deleteItem(this.state.name)
  }

  render(){
  let {allItems, backgrounds} = this.props.state;
  let {text, deleteOverlay, name} = this.state;

  let tabNames = ['Song', 'Bible', 'Image', 'Video', 'Announcements'];

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
      <div style={{display:'flex', padding:'0.25vh'}} key={index}>
        <div style={{width:'25vw', fontSize:'0.75vw'}}>{element.name}</div>
        <div style={{width:'5vw', fontSize:'0.75vw'}}>{element.type}</div>
        <DisplayWindow words={''} style={imageStyle} background={element.background}
          backgrounds={backgrounds} width={width} title={''} titleSize={''}/>
        <div style={{width:'10vw', marginLeft: '1.5vw'}}>
          <img className='imgButton' style={{width:'1.5vw', height:'1.5vw'}}
             onClick={() => this.props.functions.addItemToList(element)}
             alt="add" src={add}
            />
          <img className='imgButton' style={{marginLeft:'1vw', width:'1.5vw', height:'1.5vw'}}
             onClick={ () => this.openConfirmation(element.name)}
             alt="delete" src={deleteX}
            />
        </div>
      </div>
    )
  })
    return (
      <div style={{color: 'white', marginTop: '2vh'}}>
        <input type='text' value={this.state.text} onChange={this.updateText}
          style={{width:'20vw', padding: '0.25vh 0.25vw'}}/>
        <div style={{overflowX: 'hidden', height:'70vh'}}>
          <div style={{display: 'flex'}}>
            <div style={{fontSize: '1.15vw', width: '25vw'}}>Name</div>
            <div style={{fontSize: '1.15vw', width: '5vw'}}>Type</div>
            <div style={{fontSize: '1.15vw', width: '5vw'}}>Background</div>
          </div>
          {SL}
        </div>
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
