import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import FormatEditor from './FormatEditor';
import on from './assets/on.png';
import off from './assets/off.png';
// import new_button from './assets/new-button.png';
import open from './assets/open.png';
import Bible from './Bible'
import CreateName from './CreateName';
import ItemListEditor from './ItemListEditor';

export default class NavBar extends Component {

  constructor(){
    super();
    this.state = {
      bibleOpen: false,
      nameOpen: false,
      type: "",
      mousedOver: false,
      itemListsOpen: false
    }

    this.openBible = this.openBible.bind(this);
    this.openSong = this.openSong.bind(this);
    this.openImage = this.openImage.bind(this);
    this.closeBible = this.closeBible.bind(this);
    this.closeName = this.closeName.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.openItemLists = this.openItemLists.bind(this);
    this.closeItemLists = this.closeItemLists.bind(this);
  }

  openMenu(){
    this.setState({mousedOver: true})
  }

  closeMenu(){
    this.setState({mousedOver: false})
  }

  openItemLists(){
    this.setState({itemListsOpen: true})
  }

  closeItemLists(){
    this.setState({itemListsOpen: false})
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

  openPresentation(){
    let url = window.location.origin;
    window.open(url+'#presentation', "Presentation", "height=350,width=350,alwaysRaised");
  }

  render(){

    let {selectedItemList, selectItemList, itemLists, toggleFreeze, updateFormat,
       wordIndex, freeze, item, addItem, user, retrieved} = this.props;

    let {bibleOpen, nameOpen, type, mousedOver, itemListsOpen} = this.state;

    let buttonLoggedIn = {
       fontSize: "calc(5px + 0.35vw)", margin:'0.25%', width:'6vw'
    }

    let menuItem = {
      display:'inline-block', width:'90%', padding: '2.5%', backgroundColor:'#fff', margin: '5%',
      cursor: 'pointer'
    }

    return(
      <div style={window.location.hash==="#/fullview" ? {display: 'flex', width:'100vw', height: '3vw'} : {display:'none'}} >
        <ul style={{display:'flex', zIndex: 2}}>
          {/*<li><button onClick={this.props.test}>UPDATE ALL</button></li>*/}
          <li onMouseEnter={this.openMenu} onMouseLeave={this.closeMenu}>
            <button style={{fontFamily: 'Arial', backgroundColor:'#fff',fontSize: "calc(10px + 0.35vmax)"}}>Menu</button>
              <div style={mousedOver ? {backgroundColor:'#fff', position:'absolute', width:'7vw'} : {display:'none'}}>
                <button style={menuItem} onClick={this.openPresentation}>Open Display</button>
                <button style={menuItem}><Link to="/">Home</Link></button>
                {!this.props.isLoggedIn && <button style={menuItem}><Link to="/login">Login</Link></button>}
                {this.props.isLoggedIn && <button style={menuItem} onClick={this.props.logout}>Logout</button>}
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
            <img style={{width:'1.5vw', height:'1.5vw'}}
               alt="open" src={open}
              onClick={this.openItemLists}
              />
          </li>
          <li style={{display:'flex', margin:'auto', marginLeft:'3vw'}}>
            <div style={{width: '30%', margin:'auto'}}>
              <button style={buttonLoggedIn} onClick={this.openBible}>Add Bible</button>
            </div>
            <div style={{width: '30%', margin:'auto'}}>
              <button style={buttonLoggedIn} onClick={this.openImage}>Add Media</button>
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
          {!retrieved.finished && <div className='loader'></div>}
        </ul>
        {bibleOpen && <Bible addItem={addItem} close={this.closeBible} formatBible={this.props.formatBible}/>}
        {nameOpen && <CreateName option="create" name={"New " + type} type={type} db={this.props.db}
        close={this.closeName} addItem={this.props.addItem} backgrounds={this.props.backgrounds}
        />}
        {itemListsOpen && <ItemListEditor updateState={this.props.updateState} close={this.closeItemLists}
          itemLists={this.props.itemLists} allItemLists={this.props.allItemLists}
          newItemList={this.props.newItemList} selectItemList={this.props.selectItemList}
        />}
      </div>
    )
  }


}
