import React from 'react';
import {HotKeys} from 'react-hotkeys';
import * as SlideCreation from './HelperFunctions/SlideCreation'

export default class CreateName extends React.Component{

  constructor() {
    super();

    this.state = {
      name: "",
      message: "",
    }

    this.handlers = {
      'close': this.close,
      'submit': this.submitName
    }
  }

  componentDidMount(){
    this.setState({name: this.props.name})
    let textbox = document.getElementById("nameChange");
    textbox.focus();
    setTimeout(function(){textbox.select()},10)

  }

  close = () => {
    this.props.close()
  }

  nameAvailable = () => {
      let {name} = this.state;
      var that = this;
      this.props.db.get(name).then(function(){
        that.setState({message: "Name Not Available"})
      }).catch(function(){
        that.setState({message: ""})
        that.props.close();
        if(that.props.addMedia)
          that.props.addMedia(name, that.props.background)
        else
          that.addItem(name)
      })
    }

  nameChange = (event) => {
    this.setState({name: event.target.value})
  }

  submitName = (event) => {
    event.preventDefault();
    let {option} = this.props;
    if(option === 'edit'){
      this.editName()
    }
    if(option === 'create'){
      this.nameAvailable();
    }
  }

  addItem = (name) =>{

    let {type, background} = this.props;
    let image = background ? background : '';
    let firstSlide = ' ';
    let brightness: 100;

    if(type === 'song'){
      firstSlide = name;
      let defaultSongBackground = this.props.userSettings.defaultSongBackground;
      image = defaultSongBackground ? defaultSongBackground.name : '';
      brightness = defaultSongBackground ? defaultSongBackground.brightness : 100;
    }

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
        "type": type,
        "background": image
      }
      this.props.addItem(item);
    }

  editName = () => {

    let {name} = this.state;
    let {id, updateItem, db} = this.props;

    db.get(id).then(function(doc){
      doc.name = name;
      if(doc.type === 'bible')
        doc.slides[0].boxes[0].words = name;
      if(doc.type === 'song')
        doc.arrangements[doc.selectedArrangement].slides[0].boxes[0].words = name;
      updateItem(doc);
    })
    this.props.close();
  }

  render(){
    let {message} = this.state;

    let style={
      position:'absolute',
      zIndex:6,
      left:'35%',
      top:'45%',
      backgroundColor: '#383838',
      boxShadow: '0 5px 10px rgb(0, 0, 0)',
      border: '0.1vw solid white',
      borderRadius: '1vw',
      padding: 10,
      width: '20vw',
      color: 'white'
    }

    let messageStyle = {fontSize: "calc(5px + 0.3vw)", fontStyle: 'italic', color: 'yellow'}

    let buttonStyle = {fontSize: "calc(7px + 0.4vw)", margin:"1vh 0.25vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.25vw',
       width: '9vw'}
     let windowBackground = {position: 'fixed',top: 0, left:0, height: '100vh', width: '100vw',
       zIndex: 4, backgroundColor: 'rgba(62, 64, 66, 0.5)'}

      return (
        <HotKeys handlers={this.handlers} style={windowBackground}>
          <div style={style}>
          {(message.length > 0) && <div style={messageStyle}>{message}</div>}
          <div >
            <div style={{display: 'flex'}}>
              <div style={{width: '30%', margin:'auto'}}>Item Name: </div>
              <input style={{width: '50%', margin:'auto'}} id="nameChange" type="text" value={this.state.name} onChange={this.nameChange}/>
            </div>
            <button style={buttonStyle} onClick={this.props.close}>
              Cancel
            </button>
            <button onClick={this.submitName} style={buttonStyle}>
              Submit Name
            </button>
          </div>
          </div>
      </HotKeys>
      )
  }
}
