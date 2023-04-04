import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import FormatEditor from './FormatEditor';
import ItemListEditor from './ItemListEditor';
import UserSettings from './UserSettings';
import TextBoxEditor from './TextBoxEditor';
import ProjectorControl from './ProjectorControl'
import AllItems from './AllItems';
import LiveStreamingHelper from './LiveStreamingHelper';

import open from '../assets/open.png';
import bibleIcon from '../assets/bibleIcon.png'
import songIcon from '../assets/songIcon.png'
import allItemsIcon from '../assets/allItemsIcon.png';
import timerIcon from '../assets/timerIcon.png'
import liveStreamingIcon from '../assets/live_streaming_icon.png'
import announcementsIcon from '../assets/announcementsIcon.png'
import undoButton from '../assets/undo.png'
import redoButton from '../assets/redo.png'

export default class Toolbar extends Component {

  constructor(){
    super();
    this.state = {
      tab: "Existing",
      menuMousedOver: false,
      itemListsOpen: false,
      settingsOpen: false, 
      allItemsOpen: false,
      liveStreamHelper: false
    }
  }

  openLiveStreamHelper = () => {
    this.setState({liveStreamHelper: true})
  }

  closeLiveStreamHelper = () => {
    this.setState({liveStreamHelper: false})
  }

  openAllItems = (tab) => {
    this.setState({allItemsOpen: true, tab: tab})
  }

  closeAllItems = () => {
    this.setState({allItemsOpen: false})
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

  logout = () => {
    this.setState({menuMousedOver: false})
    this.props.parent.logout();
  }

  openPresentation = () => {
    let url = window.location.origin;
    window.open(url+'#localpresentation', "Presentation", "height=200,width=250,alwaysRaised");
  }

  render(){

    let {formatBible} = this.props;
    let {selectItemList, toggleFreeze, updateFontSize, updateFontColor,
       updateBrightness, updateState, deleteItemList, newItemList, duplicateList, updateUserSetting, updateBoxPosition,
        updateCurrent, undo, redo, updateSkipTitle, updateNextOnFinish, firebaseUpdateOverlay,
        firebaseUpdateOverlayPresets, updateImageList, updateKeepRatio } = this.props.parent; //updateItemStructure
    let {selectedItemList, itemLists, wordIndex, freeze, item, user, isLoggedIn,
      allItemLists, needsUpdate, userSettings, backgrounds, mode,
      undoReady, redoReady, boxIndex, overlayInfo, overlayQueue, overlayPresets} = this.props.parent.state;
    let {tab, menuMousedOver, itemListsOpen, settingsOpen, allItemsOpen, liveStreamHelper} = this.state;

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
    modeButtonSelected.border = '0.15vw solid #06d1d1';

    let undoRedo = {width:'1.25vw', height:'1.25vw', paddingLeft: '0.1vw'};
    let undoRedoDisabled = Object.assign({}, undoRedo);
    undoRedoDisabled.opacity = 0.25;

    return(
      <div style={window.location.hash==="#/fullview" ?
        {display: 'flex', width:'100vw', height: '10.5vh', backgroundColor: '#c4c4c4',
          borderBottom: '0.15vw solid #06d1d1', borderTop: '0.15vw solid #06d1d1',
           marginBottom: '0.25vh'}
        : {display:'none'}} >
        <ul style={{display:'flex', zIndex: 3}}>
          <li style={{width:'4vw'}}>
            <div className='toolbarSection' onMouseLeave={this.closeMenu}>
              <button onClick={this.openMenu} style={menuButton}>Menu</button>
                <div style={menuMousedOver ? {backgroundColor:'#c4c4c4', position:'absolute', width:'9vw', zIndex: 4} : {display:'none'}}>
                  <button style={menuItem} onClick={this.openPresentation}>Open Stage Display</button>
                  <Link to="/"><button style={menuItem}>Home</button></Link>
                  <button style={menuItem} onClick={this.openSettings}> Open Settings </button>
                  {!isLoggedIn && <Link to="/login"><button style={menuItem}>Login</button></Link>}
                  {isLoggedIn && <button style={menuItem} onClick={this.logout}>Logout</button>}
                  {/*<button style={menuItem} onClick={updateItemStructure}>UPDATE ALL</button>*/}
                  {/*<button onClick={test}>Test</button>*/}
                </div>
                <div style={{display: 'flex', marginTop: '2vh'}}>
                  <img className='imgButton' style={undoReady? undoRedo: undoRedoDisabled}
                     alt="undo" src={undoButton}
                    onClick={undo}
                    />
                  <img className='imgButton' style={redoReady? undoRedo: undoRedoDisabled}
                     alt="redo" src={redoButton}
                    onClick={redo}
                    />
                </div>
            </div>
          </li>
          <li style={{width: '12vw'}}>
            <div className='toolbarSection'>
              <div style={{display: 'flex'}}>
                <select style={{fontSize: "0.85vw", width: '9vw', height: '2.5vh'}} value={selectedItemList.name}
                  onChange={(e) => (selectItemList(e.target.value))}>
                  {itemLists.map((element, index) =>
                    <option key={index}> {element.name} </option>
                  )}
                </select>
                <img className='imgButton' style={{width:'1.25vw', height:'1.25vw', marginLeft: '0.25vw'}}
                   alt="open" src={open}
                  onClick={this.openItemLists}
                  />
              </div>
              <div style={{display: 'flex', marginTop: '1vh'}}>
                <button style={(mode === 'edit') ? modeButtonSelected : modeButton}
                  onClick={() => this.props.parent.setState({mode: 'edit'})}>Edit</button>
                <button style={(mode === 'display') ? modeButtonSelected : modeButton}
                  onClick={() => this.props.parent.setState({mode: 'display'})}>Display</button>
              </div>

            </div>
          </li>
          <li style={{width: '13vw'}}>
            {mode === 'edit' && <div className='toolbarSection'>
            <div style={{display:'flex'}}>
              <div onClick={ () => this.openAllItems('Bible')} className='imgButton'
                 style={{fontSize: '0.65vw', height: '4.5vh', marginRight:'0.5vw', textAlign: 'center'}}>
                <img style={{display:'block', width:'1.25vw', height:'1.25vw', margin: 'auto',
                  padding: '0.25vh 0.25vw'}}
                   alt="bibleIcon" src={bibleIcon}
                   />
                 <div>Bible</div>
              </div>
              <div onClick={ () => this.openAllItems('Songs')} className='imgButton'
                style={{fontSize: '0.65vw', marginRight:'0.5vw', height: '4.5vh', textAlign: 'center'}}>
                <img style={{display:'block', width:'1.25vw', height:'1.25vw', margin: 'auto',
                  padding: '0.25vh 0.25vw'}}
                   alt="songIcon" src={songIcon}
                   />
                 <div>Song</div>
              </div>
              <div onClick={ () => this.openAllItems('Existing')} className='imgButton'
                style={{fontSize: '0.65vw', height: '4.5vh', marginRight:'0.5vw', textAlign: 'center'}}>
                <img style={{display:'block', width:'1.25vw', height:'1.25vw', margin: 'auto',
                  padding: '0.25vh 0.25vw'}}
                   alt="allItemsIcon" src={allItemsIcon}
                   />
                 <div>All</div>
              </div>
              <div onClick={ () => this.openAllItems('Announcements')} className='imgButton'
                style={{fontSize: '0.65vw', height: '5vh', textAlign: 'center'}}>
                <img style={{display:'block', width:'1.25vw', height:'1.25vw', margin: 'auto',
                  padding: '0.25vh 0.25vw'}}
                   alt="announcementsIcon" src={announcementsIcon}
                   />
                 <div>Announcements</div>
              </div>
            </div>
            <div style={{display:'flex'}}>
              <div onClick={ () => this.openAllItems('Timer')} className='imgButton'
                style={{fontSize: '0.65vw', height: '4.5vh', marginRight:'0.5vw', textAlign: 'center'}}>
                <img style={{display:'block', width:'1.25vw', height:'1.25vw', margin: 'auto',
                  padding: '0.25vh 0.25vw'}}
                   alt="timerIcon" src={timerIcon}
                   />
                 <div>Timer</div>
              </div>
              <div onClick={ () => this.openLiveStreamHelper()} className='imgButton'
                style={{fontSize: '0.65vw', height: '4.5vh', marginRight:'0.5vw', textAlign: 'center'}}>
                <img style={{display:'block', width:'1.25vw', height:'1.25vw', margin: 'auto',
                  padding: '0.25vh 0.25vw'}}
                   alt="liveStreamingIcon" src={liveStreamingIcon}
                   />
                 <div>LS Helper</div>
              </div>
            </div>
            </div>}
          </li>
          <li style={{width: '20vw'}}>
            {mode === 'edit' && <div className='toolbarSection'>
               <FormatEditor item={item} updateFontSize={updateFontSize} updateFontColor={updateFontColor}
                 wordIndex={wordIndex} updateBrightness={updateBrightness} updateSkipTitle={updateSkipTitle}
                 boxIndex={boxIndex} updateNextOnFinish={updateNextOnFinish} updateKeepRatio={updateKeepRatio} />
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
              <div style={{display:'flex', backgroundColor: '#383838', color:'white', padding: '0.5vw', height: '2vh'}}>
                <div style={{fontSize: "calc(8px + 0.35vw)", fontWeight: 'bold'}}>User:</div>
                <div style={{fontSize: "calc(8px + 0.25vw)", color:'#06d1d1', marginLeft: '0.25vw'}}>{user}</div>
              </div>
            </div>
          </li>
        </ul>
        {itemListsOpen && <ItemListEditor updateState={updateState} close={this.closeItemLists}
          itemLists={itemLists} allItemLists={allItemLists} deleteItemList={deleteItemList}
          newItemList={newItemList} selectItemList={selectItemList} duplicateList={duplicateList}
          needsUpdate={needsUpdate}
        />}
        {settingsOpen && <UserSettings state={this.props.parent.state} close={this.closeSettings}
        updateUserSetting={updateUserSetting} updateImageList={updateImageList} />}
        {liveStreamHelper && <LiveStreamingHelper close={this.closeLiveStreamHelper} 
        firebaseUpdateOverlay={firebaseUpdateOverlay} overlayInfo={overlayInfo}
        overlayQueue={overlayQueue} firebaseUpdateOverlayPresets={firebaseUpdateOverlayPresets}
         overlayPresets={overlayPresets} />}
        {allItemsOpen && <AllItems close={this.closeAllItems} state={this.props.parent.state}
        functions={this.props.parent} tab={tab} formatBible={formatBible}/>}
      </div>
    )
  }


}
