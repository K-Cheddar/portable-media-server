import React from 'react';
import {HotKeys} from 'react-hotkeys';
import MakeUnique from './HelperFunctions/MakeUnique';

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

  makeNameUnique = () => {
    let {name} = this.state;
    let { background} = this.props;
    //use allItems and item
    if(name === '')
      return;
    //name = MakeUnique({name: name, property: '_id', list: allItems, id: item._id});
    this.props.addMedia(name, background)
    this.props.close();
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
      this.makeNameUnique();
    }
  }

  editName = () => {

    let {name} = this.state;
    let {item, updateItem, allItems} = this.props;
    if(name === '')
      return;

    name = MakeUnique({name: name, property: 'name', list: allItems, id: item._id});
    item.name = name;
    console.log(item);
    if(item.type === 'song')
      item.arrangements[item.selectedArrangement].slides[0].boxes[1].words = name;
    else if(item.type === 'bible')
      item.slides[0].boxes[1].words = name;

    updateItem(item)
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
