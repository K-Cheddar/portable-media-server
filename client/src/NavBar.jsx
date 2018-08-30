import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import FormatEditor from './FormatEditor';
import on from './assets/on.png';
import off from './assets/off.png';
import open from './assets/open.png';
import Bible from './Bible'
import CreateName from './CreateName';
import ItemListEditor from './ItemListEditor';

import textbox_full from './assets/textbox_full.png';
import textbox_leftHalf from './assets/textbox_leftHalf.png';
import textbox_lowerThird from './assets/textbox_lowerThird.png';
import textbox_match from './assets/textbox_match.png';
import textbox_midThird from './assets/textbox_midThird.png';
import textbox_rightHalf from './assets/textbox_rightHalf.png';
import textbox_upperThird from './assets/textbox_upperThird.png';

export default class NavBar extends Component {

  constructor(){
    super();
    this.state = {
      bibleOpen: false,
      nameOpen: false,
      type: "",
      menuMousedOver: false,
      itemListsOpen: false,
      applyAll: false,
    }
  }

  openMenu = () => {
    this.setState({menuMousedOver: true})
  }

  closeMenu = () => {
    this.setState({menuMousedOver: false})
  }

  openItemLists = () => {
    this.setState({itemListsOpen: true})
  }

  closeItemLists = () => {
    this.setState({itemListsOpen: false})
  }

  openBible = () => {
    this.setState({
      bibleOpen: true,
      type: 'bible'
    })
  }
  openSong = () => {
    this.setState({
      nameOpen: true,
      type: 'song'
    })
  }
  openImage = () => {
    this.setState({
      nameOpen: true,
      type: 'image'
    })
  }

  textboxFull = () => {
    let {applyAll} = this.state;
    this.props.parent.updateBoxPosition({x: 0, y: 0, width: 100, height: 100, applyAll: applyAll})
  }

  textboxLeftHalf = () => {
    let {applyAll} = this.state;
    this.props.parent.updateBoxPosition({x: 0, y: 0, width: 54.5, height: 100, applyAll: applyAll})
  }

  textboxRightHalf = () => {
    let {applyAll} = this.state;
    this.props.parent.updateBoxPosition({x: 45.5, y: 0, width: 54.5, height: 100, applyAll: applyAll})
  }

  textboxMatch = () => {
    let {applyAll} = this.state;
    this.props.parent.updateBoxPosition({applyAll: applyAll, match:true})
  }

  textboxLowerThird = () => {
    let {applyAll} = this.state;
    this.props.parent.updateBoxPosition({x: 0, y: 62, width: 100, height: 37.5, applyAll: applyAll})
  }

  textboxMidThird = () => {
    let {applyAll} = this.state;
    this.props.parent.updateBoxPosition({x: 0, y: 31.5, width: 100, height: 37.5, applyAll: applyAll})
  }

  textboxUpperThird = () => {
    let {applyAll} = this.state;
    this.props.parent.updateBoxPosition({x: 0, y: 0, width: 100, height: 37.5, applyAll: applyAll})
  }

  applyAll = () => {
    this.setState({applyAll: true})
  }

  applySelected = () => {
    this.setState({applyAll: false})
  }

  logout = () => {
    this.setState({menuMousedOver: false})
    this.props.parent.logout();
  }

  closeBible = () => {
    this.setState({bibleOpen: false})
  }
  closeName = () => {
    this.setState({nameOpen: false})
  }

  openPresentation = () => {
    let url = window.location.origin;
    window.open(url+'#presentation', "Presentation", "height=350,width=350,alwaysRaised");
  }

  render(){

    let {formatBible} = this.props;
    let {selectItemList, toggleFreeze, updateFontSize, updateFontColor, addItem,
       updateBrightness, updateState, deleteItemList, newItemList, duplicateList} = this.props.parent;
    let {selectedItemList, itemLists, wordIndex, freeze, item, user, isLoggedIn, db, allItemLists} = this.props.parent.state;
    let {bibleOpen, nameOpen, type, menuMousedOver, itemListsOpen} = this.state;

    let buttonStyle = {
       fontSize: "calc(5px + 0.35vw)", margin:'.25vw', width:'6vw'
    }

    let menuItem = {
      display:'inline-block', width:'90%', padding: '2.5%', backgroundColor:'#fff', margin: '5%',
      cursor: 'pointer'
    }

    return(
      <div style={window.location.hash==="#/fullview" ? {display: 'flex', width:'100vw', height: '8vh'} : {display:'none'}} >
        <ul style={{display:'flex', zIndex: 3}}>
          {/*<li><button onClick={this.props.test}>UPDATE ALL</button></li>*/}
          <li onMouseEnter={this.openMenu} onMouseLeave={this.closeMenu}>
            <button style={{fontFamily: 'Arial', backgroundColor:'#fff',fontSize: "calc(10px + 0.35vmax)"}}>Menu</button>
              <div style={menuMousedOver ? {backgroundColor:'#fff', position:'absolute', width:'7vw'} : {display:'none'}}>
                <button style={menuItem} onClick={this.openPresentation}>Open Display</button>
                <button style={menuItem}><Link to="/">Home</Link></button>
                {!isLoggedIn && <button style={menuItem}><Link to="/login">Login</Link></button>}
                {isLoggedIn && <button style={menuItem} onClick={this.logout}>Logout</button>}
              </div>
          </li>
          <li>
            <div style={{paddingTop:'1%', margin:'auto'}}>
              <select style={{fontSize: "calc(10px + 0.35vw)", width: '10vw'}} value={selectedItemList.name}
                onChange={(e) => (selectItemList(e.target.value))}>
                {itemLists.map((element, index) =>
                  <option key={index}> {element.name} </option>
                )}
              </select>
            </div>
          </li>
          <li style={{paddingLeft: '0'}}>
            <img className='imgButton' style={{width:'1.5vw', height:'1.5vw'}}
               alt="open" src={open}
              onClick={this.openItemLists}
              />
          </li>
          <li style={{display:'flex', margin:'auto'}}>
            <button style={buttonStyle} onClick={this.openSong}>Add Song</button>
            <button style={buttonStyle} onClick={this.openBible}>Add Bible</button>
          </li>
          <li style={{borderLeft: '0.25vw solid black'}}>
            <div style={{paddingTop:'1%', margin:'auto'}}>
               <FormatEditor item={item} updateFontSize={updateFontSize} updateFontColor={updateFontColor}
                 wordIndex={wordIndex} updateBrightness={updateBrightness}/>
            </div>
          </li>
          <li style={{display:'flex', borderLeft: '0.25vw solid black', borderRight: '0.25vw solid black'}}>
              <div style={{width:'11vw'}}>
                <div style={{display:'flex'}}>
                  <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
                     alt="textbox_full" src={textbox_full} onClick={this.textboxFull}
                    />
                  <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
                     alt="textbox_leftHalf" src={textbox_leftHalf} onClick={this.textboxLeftHalf}
                    />
                  <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
                     alt="textbox_rightHalf" src={textbox_rightHalf} onClick={this.textboxRightHalf}
                    />
                  <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
                     alt="textbox_match" src={textbox_match} onClick={this.textboxMatch}
                    />
                </div>
                <div style={{display:'flex'}}>
                  <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
                     alt="textbox_lowerThird" src={textbox_lowerThird} onClick={this.textboxLowerThird}
                    />
                  <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
                     alt="textbox_midThird" src={textbox_midThird} onClick={this.textboxMidThird}
                    />
                  <img className='imgButton' style={{ margin:'1%', width:'2.5vw', height:'1.41vw'}}
                     alt="textbox_upperThird" src={textbox_upperThird} onClick={this.textboxUpperThird}
                    />
                </div>
              </div>
              <div style={{width:'8vw'}}>
                <div style={{fontSize: "calc(5px + 0.35vw)", marginBottom: '3%'}} onClick={this.applyAll}>
                  <input type="checkbox" readOnly checked={this.state.applyAll}/>
                  Apply To All
                </div>
                <div style={{fontSize: "calc(5px + 0.35vw)"}} onClick={this.applySelected}>
                  <input type="checkbox" readOnly checked={!this.state.applyAll}/>
                  Apply Selected
                </div>
              </div>
          </li>
          <li>
            {freeze && <div style={{display:'flex', height:'1.5vw', paddingTop:'1%', margin:'auto'}}>
             <div>
               <button style={buttonStyle} onClick={toggleFreeze}>Unfreeze</button>
             </div>
              <img style={{paddingLeft:'5%', width:'2.75vw', height:'1.25vw'}}
                 alt="off" src={off}
                />
              </div>
            }
            {!freeze && <div style={{display:'flex', height:'1.5vw', paddingTop:'1%', margin:'auto'}}>
            <div>
              <button style={buttonStyle} onClick={toggleFreeze}>Freeze</button>
            </div>
              <img style={{paddingLeft:'5%', width:'2.75vw', height:'1.25vw'}}
                 alt="on" src={on}
                />
              </div>
            }
          </li>
          <li style={{fontSize: "calc(12px + 0.5vw)"}}>Logged In As: {user}</li>
        </ul>
        {bibleOpen && <Bible addItem={addItem} close={this.closeBible} formatBible={formatBible}/>}
        {nameOpen && <CreateName option="create" name={"New " + type} type={type} db={db}
        close={this.closeName} addItem={addItem}
        />}
        {itemListsOpen && <ItemListEditor updateState={updateState} close={this.closeItemLists}
          itemLists={itemLists} allItemLists={allItemLists} deleteItemList={deleteItemList}
          newItemList={newItemList} selectItemList={selectItemList} duplicateList={duplicateList}
        />}
      </div>
    )
  }


}
