import React from 'react';
import deleteX from '../assets/deleteX.png';
import add from '../assets/addItem.png';
import DeleteConfirmation from '../DeleteConfirmation';
import DisplayWindow from '../DisplayElements/DisplayWindow';
import MakeUnique from '../HelperFunctions/MakeUnique';
import * as SlideCreation from '../HelperFunctions/SlideCreation'

export default class Songs extends React.Component{

  constructor(){
    super();
    this.state={
      deleteOverlay: false,
      name: "",
      nameToDelete: "",
    }

  }

  updateName = (event) => {
    this.setState({name: event.target.value})
  }

  openConfirmation = (name) => {
    this.setState({
      deleteOverlay: true,
      nameToDelete: name
    })
  }

  cancel = () => {
    this.setState({deleteOverlay: false})
  }

  confirm = () => {
    this.setState({deleteOverlay: false})
    this.props.functions.deleteItem(this.state.nameToDelete)
  }

  newSong = () => {
    let {name} = this.state;
    let {userSettings, allItems} = this.props.state;
    if(name === '')
      return

    name = MakeUnique({name: name, property: '_id', list: allItems});

    let firstSlide = name;
    let defaultSongBackground = userSettings.defaultSongBackground;
    let brightness = defaultSongBackground ? defaultSongBackground.brightness : 100;
    let image = defaultSongBackground ? defaultSongBackground.name : '';

    let item = {
        "_id": name,
        "name": name,
        "arrangements": [{
          name: 'Master',
          formattedLyrics: [],
          songOrder: [],
          slides: [SlideCreation.newSlide({type: "Title", fontSize: 4.5, words: firstSlide,
           background: image, brightness: brightness})]}],
        "selectedArrangement": 0,
        "type": 'song',
        "background": image
      }
      this.props.functions.addItem(item);
  }

  render(){
    let {allItems, backgrounds} = this.props.state;
    let {deleteOverlay, name, nameToDelete} = this.state;

    let filteredList = [];
    let allSongs = allItems.filter(e => e.type === 'song');
    if(name.length > 0){
      filteredList = allSongs.filter(ele => ele.name.toLowerCase().includes(name.toLowerCase()))
    }
    else{
      filteredList = allSongs.slice(0);
    }

    let width = '3.5vw';

    let buttonStyle = {
       fontSize: "0.7vw", margin:'0 1vw', width:'8vw', backgroundColor:'#383838',
          border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white',
    }

    let SL = filteredList.map((element, index) => {
      let imageStyle = {fontSize: 4.5, fontColor: element.nameColor}
      let slide = {boxes: [{words: '',  background: element.background, ...imageStyle}]}
      return(
        <div className='tableRow' style={{display:'flex'}}
          key={index}>
          <div style={{width:'15vw',display: 'flex', alignItems: 'center', fontSize:'0.75vw',
            borderRight:'0.1vw solid black', paddingTop: '0.5vh'}}>
            {element.name}</div>
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
          <div style={{fontSize: '1vw', marginRight: '1vw', display: 'flex', alignItems: 'center'}}>Song Name</div>
          <input type='text' value={this.state.name} onChange={this.updateName}
            style={{width:'15vw', padding: '0.25vh 0.25vw'}}/>
          <button style={buttonStyle} onClick={this.newSong}>New Song</button>
        </div>
        <div style={{overflowX: 'hidden', height:'70vh', width: '60%'}}>
          <div style={{display: 'flex', paddingBottom: '1vh', borderBottom: '0.1vw solid #c4c4c4'}}>
            <div style={{fontSize: '1.15vw', width: '15vw', display: 'flex', justifyContent:'center'}}>
              Name</div>
            <div style={{fontSize: '1.15vw', width: '8vw', display: 'flex',  justifyContent:'center'}}>
              Background</div>
          </div>
          {SL}
        </div>
        {deleteOverlay &&
          <div style={{position:'fixed', top:0, left:0, height:'100vh', width:'100vw',
             zIndex: 9, backgroundColor:'rgba(62, 64, 66, 0.5)'}}>
             <DeleteConfirmation confirm={this.confirm}
               cancel={this.cancel} name={nameToDelete}  />
        </div>}
      </div>
    )
  }

}
