import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import FormatEditor from './FormatEditor';
import Bible from './Bible'
import CreateName from './CreateName';
import ItemListEditor from './ItemListEditor';
import UserSettings from './UserSettings';
import TextBoxEditor from './TextBoxEditor';
import ProjectorControl from './ProjectorControl'

import connected from './assets/connected.png';
import open from './assets/open.png';
import bibleIcon from './assets/bibleIcon.png'
import songIcon from './assets/songIcon.png'

export default class ToolBar extends Component {

  constructor(){
    super();
    this.state = {
      bibleOpen: false,
      nameOpen: false,
      type: "",
      menuMousedOver: false,
      itemListsOpen: false,
      settingsOpen: false,
      mode: 'edit'
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

  openSettings = () => {
    this.setState({settingsOpen: true})
  }

  closeSettings = () => {
    this.setState({settingsOpen: false})
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
       updateBrightness, updateState, deleteItemList, newItemList, duplicateList,
       setAsReceiver, connectToReceiver, updateUserSettings, updateBoxPosition,
        updateCurrent} = this.props.parent;
    let {selectedItemList, itemLists, wordIndex, freeze, item, user, isLoggedIn, db,
      allItemLists, isReciever, isSender, needsUpdate, userSettings, backgrounds} = this.props.parent.state;
    let {bibleOpen, nameOpen, type, menuMousedOver, itemListsOpen, settingsOpen, mode} = this.state;

    let menuItem = {
      display:'inline-block', width:'90%', padding: '2.5%', backgroundColor:'#fff', margin: '5%',
      cursor: 'pointer', fontSize: "calc(5px + 0.35vw)", border: '0.15vw solid #474747'
    }
    let menuButton = {
      width:'100%', padding: '5%', cursor: 'pointer',
      fontSize: "calc(5px + 0.35vw)", height: '3vh', border: '0.15vw solid #474747'
    }
    let modeButton = {
      width:'6vw', cursor: 'pointer', fontSize: "calc(5px + 0.35vw)",
      height: '3vh', margin: '0 0.5vw', border: '0.15vw solid #474747'
    }
    let modeButtonSelected = Object.assign({}, modeButton);
    modeButtonSelected.border = '0.15vw solid #06d1d1'

    return(
      <div style={window.location.hash==="#/fullview" ?
        {display: 'flex', width:'100vw', height: '10vh', backgroundColor: '#c4c4c4',
          borderBottom: '0.15vw solid #06d1d1', borderTop: '0.15vw solid #06d1d1',
           marginBottom: '0.25vh'}
        : {display:'none'}} >
        <ul style={{display:'flex', zIndex: 3}}>
          {/*<li><button onClick={this.props.test}>UPDATE ALL</button></li>*/}
          <li style={{width:'4vw'}}>
            <div className='toolbarSection' onMouseLeave={this.closeMenu}>
              <button onClick={this.openMenu} onMouseEnter={this.openMenu} style={menuButton}>Menu</button>
                <div style={menuMousedOver ? {backgroundColor:'#c4c4c4', position:'absolute', width:'9vw', zIndex: 4} : {display:'none'}}>
                  <button style={menuItem} onClick={this.openPresentation}>Open Display</button>
                  <Link to="/"><button style={menuItem}>Home</button></Link>
                  <button style={menuItem} onClick={setAsReceiver}> Become Receiver </button>
                  <button style={menuItem} onClick={connectToReceiver}> Connect To Receiver </button>
                  <button style={menuItem} onClick={this.openSettings}> Open Settings </button>
                  {!isLoggedIn && <Link to="/login"><button style={menuItem}>Login</button></Link>}
                  {isLoggedIn && <button style={menuItem} onClick={this.logout}>Logout</button>}
                </div>
            </div>
          </li>
          <li style={{width: '12vw'}}>
            <div className='toolbarSection'>
              <div style={{display: 'flex'}}>
                <select style={{fontSize: "calc(10px + 0.35vw)", width: '10vw', height: '3vh'}} value={selectedItemList.name}
                  onChange={(e) => (selectItemList(e.target.value))}>
                  {itemLists.map((element, index) =>
                    <option key={index}> {element.name} </option>
                  )}
                </select>
                <img className='imgButton' style={{width:'1.5vw', height:'1.5vw', marginLeft: '0.25vw'}}
                   alt="open" src={open}
                  onClick={this.openItemLists}
                  />
              </div>
              <div style={{display: 'flex', marginTop: '1vh'}}>
                <button style={(mode === 'edit') ? modeButtonSelected : modeButton} onClick={() => (this.setState({mode: 'edit'}))}>Edit</button>
                <button style={(mode === 'display') ? modeButtonSelected : modeButton} onClick={() => (this.setState({mode: 'display'}))}>Display</button>
              </div>

            </div>
          </li>
          <li style={{width: '13vw'}}>
            {mode === 'edit' && <div className='toolbarSection' style={{display:'flex'}}>
              <div onClick={this.openBible} className='imgButton'
                 style={{fontSize: "calc(5px + 0.35vw)", height: '5vh', marginRight:'0.5vw'}}>
                <img style={{display:'block', width:'1.25vw', height:'1.25vw', margin: 'auto',
                  padding: '0.25vh 0.25vw'}}
                   alt="bibleIcon" src={bibleIcon}
                   />
                 <div>Open Bible</div>
              </div>
              <div onClick={this.openSong} className='imgButton'
                style={{fontSize: "calc(5px + 0.35vw)", height: '5vh'}}>
                <img style={{display:'block', width:'1.25vw', height:'1.25vw', margin: 'auto',
                  padding: '0.25vh 0.25vw'}}
                   alt="songIcon" src={songIcon}
                   />
                 <div>Add Song</div>
              </div>
            </div>}
          </li>
          <li style={{width: '20vw'}}>
            {mode === 'edit' && <div className='toolbarSection'>
               <FormatEditor item={item} updateFontSize={updateFontSize} updateFontColor={updateFontColor}
                 wordIndex={wordIndex} updateBrightness={updateBrightness}/>
             </div>}
          </li>
          <li style={{width: '20vw'}}>
            {mode === 'edit' && <div className='toolbarSection'>
                <TextBoxEditor updateBoxPosition={updateBoxPosition}/>
            </div>}
          </li>
          <li style={{width: '15vw'}}>
            <div className='toolbarSection'>
              <ProjectorControl freeze={freeze} toggleFreeze={toggleFreeze} userSettings={userSettings}
                backgrounds={backgrounds} updateCurrent={updateCurrent}/>
            </div>
          </li>
          <li style={{width: '16.5vw'}}>
            <div className='toolbarSection' style={{display: 'flex'}}>
              <div style={{width: '9vw'}}>
                {isReciever && <div style={{display:'flex', marginTop: '0.65vh'}}>
                  <div style={{fontSize: "calc(7px + 0.35vw)", width: '6vw'}}>Direct Receiving:</div>
                  <img style={{ marginLeft:'0.35vw', width:'1.25vw', height:'.96vw'}}
                     alt="connected" src={connected}
                    />
                </div>}
                {isSender && <div style={{display:'flex', marginTop: '0.65vh'}}>
                  <div style={{fontSize: "calc(7px + 0.35vw)", width: '6vw'}} >Direct Sending:</div>
                  <img style={{ marginLeft:'0.35vw', width:'1.25vw', height:'.96vw'}}
                     alt="connected" src={connected}
                    />
                </div>}
              </div>
              <div style={{display:'flex', backgroundColor: '#383838', color:'white', padding: '0.5vw', height: '2vh'}}>
                <div style={{fontSize: "calc(8px + 0.35vw)", fontWeight: 'bold'}}>User:</div>
                <div style={{fontSize: "calc(8px + 0.25vw)", color:'#06d1d1', marginLeft: '0.25vw'}}>{user}</div>
              </div>
            </div>
          </li>
        </ul>
        {bibleOpen && <Bible addItem={addItem} close={this.closeBible} formatBible={formatBible}
        functions={this.props.parent} state={this.props.parent.state}/>}
        {nameOpen && <CreateName option="create" name={"New " + type} type={type} db={db}
        close={this.closeName} addItem={addItem} userSettings={userSettings}
        />}
        {itemListsOpen && <ItemListEditor updateState={updateState} close={this.closeItemLists}
          itemLists={itemLists} allItemLists={allItemLists} deleteItemList={deleteItemList}
          newItemList={newItemList} selectItemList={selectItemList} duplicateList={duplicateList}
          needsUpdate={needsUpdate}
        />}
        {settingsOpen && <UserSettings state={this.props.parent.state} close={this.closeSettings}
        updateUserSettings={updateUserSettings}/>}
      </div>
    )
  }


}
