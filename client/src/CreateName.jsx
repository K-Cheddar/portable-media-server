import React from 'react';
import {HotKeys} from 'react-hotkeys';
import * as Helper from './Helper'

export default class CreateName extends React.Component{

  constructor() {
    super();

    this.state = {
      name: "",
      message: "",
    }

    this.handlers = {
      'close': this.close
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
      image = this.props.userSettings.defaultSongBackground.name;
      brightness = this.props.userSettings.defaultSongBackground.brightness;
    }

    let item = {
        "_id": name,
        "name": name,
        "slides": [Helper.newSlide({type: "Title", fontSize: 4.5, words: firstSlide,
         background: image, brightness: brightness})],
        "formattedLyrics": [],
        "songOrder": [],
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
      if(doc.type === 'song' || doc.type === 'bible')
        doc.slides[0].boxes[0].words = name;
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
      backgroundColor: '#EEE',
      boxShadow: '0 5px 10px rgb(0, 0, 0)',
      border: '1px solid #CCC',
      borderRadius: 3,
      padding: 10
    }

      return (
        <HotKeys handlers={this.handlers}>
        <div style={{position:'fixed', top:0, left:0, height:'100vh',
          zIndex: 5, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
          <div style={style}>
          {(message.length > 0) && <div>{message}</div>}
          <form onSubmit={this.submitName}>
            <label>Item Name:</label>
              <input id="nameChange" type="text" value={this.state.name} onChange={this.nameChange}/>
              <button type="submit">
                Submit Name
              </button>
              <button onClick={this.props.close}>
                Cancel
              </button>
          </form>
          </div>
        </div>
      </HotKeys>
      )
  }
}
