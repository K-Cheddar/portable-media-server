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
    let slide = {boxes: [{words: '',  background: element.background, ...imageStyle}]}
    return(
      <div className='tableRow' style={{display:'flex'}}
        key={index}>
        <div style={{width:'18.5vw',display: 'flex', alignItems: 'center', fontSize:'0.75vw',
          borderRight:'0.1vw solid black', paddingTop: '0.5vh'}}>
          {element.name}</div>
        <div style={{width:'7vw', display: 'flex', justifyContent:'center', alignItems: 'center',
          fontSize:'0.75vw', borderRight:'0.1vw solid black', paddingTop: '0.5vh'}}>
          {element.type}</div>
        <div style={{width:'8vw', display: 'flex', justifyContent:'center', alignItems: 'center',
          borderRight:'0.1vw solid black', paddingTop: '0.5vh'}}>
          <DisplayWindow slide={slide} backgrounds={backgrounds} width={width} title={''} titleSize={''}/>
        </div>
        <div style={{width:'10vw', marginLeft: '1.5vw', paddingTop: '0.5vh'}}>
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
      <div style={{color: 'white', margin: '2vh auto', width: '80%'}}>
        <div style={{display: 'flex', marginBottom: '1.5vh'}}>
          <div style={{fontSize: '1vw', marginRight: '1vw'}}>Search</div>
          <input type='text' value={this.state.text} onChange={this.updateText}
            style={{width:'20vw', padding: '0.25vh 0.25vw'}}/>
        </div>
        <div style={{overflowX: 'hidden', height:'70vh', width: '80%'}}>
          <div style={{display: 'flex', paddingBottom: '1vh', borderBottom: '0.1vw solid #c4c4c4'}}>
            <div style={{fontSize: '1.15vw', width: '20vw', display: 'flex', justifyContent:'center'}}>
              Name</div>
            <div style={{fontSize: '1.15vw', width: '5vw', display: 'flex', justifyContent:'center'}}>
              Type</div>
            <div style={{fontSize: '1.15vw', width: '8vw', display: 'flex',  justifyContent:'center'}}>
              Background</div>
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
