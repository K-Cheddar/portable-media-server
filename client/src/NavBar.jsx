import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import FormatEditor from './FormatEditor';
import on from './assets/on.png';
import off from './assets/off.png';
import Bible from './Bible'
import CreateName from './CreateName';

export default class NavBar extends Component {

  constructor(){
    super();
    this.state = {
      bibleOpen: false,
      nameOpen: false,
      type: ""
    }

    this.openBible = this.openBible.bind(this);
    this.openSong = this.openSong.bind(this);
    this.openImage = this.openImage.bind(this);
    this.closeBible = this.closeBible.bind(this);
    this.closeName = this.closeName.bind(this);
  }

  openBible(){
    this.setState({
      bibleOpen: true,
      type: 'bible'
    })
  }
  openSong(){
    this.setState({
      nameOpen: true,
      type: 'song'
    })
  }
  openImage(){
    this.setState({
      nameOpen: true,
      type: 'image'
    })
  }

  closeBible(){
    this.setState({bibleOpen: false})
  }
  closeName(){
    this.setState({nameOpen: false})
  }

  render(){

    let {selectedItemList, selectItemList, itemLists, toggleFreeze, updateFormat,
       wordIndex, freeze, item, addItem, user} = this.props;

    let {bibleOpen, nameOpen, type} = this.state;

    let buttonLoggedIn = {
       fontSize: "calc(5px + 0.35vw)", margin:'0.25%', width:'6vw'
    }

    return(
      <div style={window.location.hash==="#/fullview" ? {display: 'flex', width:'99vw', height: '3vw'} : {display:'none'}} >
        <ul style={{display:'flex'}}>
          {/*<li><button onClick={this.props.test}>TEST</button></li>*/}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <div style={{paddingTop:'1%', margin:'auto'}}>
              <select style={{fontSize: "calc(10px + 0.35vw)"}} value={selectedItemList}
                onChange={(e) => (selectItemList(e.target.value))}>
                {itemLists.map((element, index) =>
                  <option key={index}> {element} </option>
                )}
              </select>
            </div>
          </li>
          <li style={{display:'flex', margin:'auto', marginLeft:'3vw'}}>
            <div style={{width: '30%', margin:'auto'}}>
              <button style={buttonLoggedIn} onClick={this.openBible}>Add Bible</button>
            </div>
            <div style={{width: '30%', margin:'auto'}}>
              <button style={buttonLoggedIn} onClick={this.openImage}>Add Image</button>
            </div>
            <div style={{width: '30%', margin:'auto'}}>
              <button style={buttonLoggedIn} onClick={this.openSong}>Add Song</button>
            </div>
          </li>
          <li>
            <div style={{paddingTop:'1%', margin:'auto'}}>
               <FormatEditor item={item} updateFormat={updateFormat} wordIndex={wordIndex}/>
            </div>
          </li>
          <li>
            {freeze && <div style={{display:'flex', height:'1.5vw', paddingTop:'1%', margin:'auto'}}>
             <div>
               <button style={buttonLoggedIn} onClick={toggleFreeze}>Unfreeze</button>
             </div>
              <img style={{paddingLeft:'5%', width:'2.75vw', height:'1.25vw'}}
                 alt="off" src={off}
                />
              </div>
            }
            {!freeze && <div style={{display:'flex', height:'1.5vw', paddingTop:'1%', margin:'auto'}}>
            <div>
              <button style={buttonLoggedIn} onClick={toggleFreeze}>Freeze</button>
            </div>
              <img style={{paddingLeft:'5%', width:'2.75vw', height:'1.25vw'}}
                 alt="on" src={on}
                />
              </div>
            }
          </li>
          <li style={{fontSize: "calc(12px + 0.5vw)"}}>Logged In As: {user}</li>
        </ul>
        {bibleOpen && <Bible addItem={addItem} close={this.closeBible} formatBible={this.props.formatBible}/>}
        {nameOpen && <CreateName option="create" name={"New " + type} type={type} db={this.props.db}
        close={this.closeName} addItem={this.props.addItem} backgrounds={this.props.backgrounds}
        />}
      </div>
    )
  }


}
