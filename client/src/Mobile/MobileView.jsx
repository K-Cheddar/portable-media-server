import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import MobileSlides from './MobileSlides';
import MobileItemList from './MobileItemList';
import MobileDisplay from './MobileDisplay';
import MobileListChanger from './MobileListChanger';
import on from '../assets/on.png';
import off from '../assets/off.png';
import connected from '../assets/connected.png';
import disconnected from '../assets/disconnected.png';

export default class MobileView extends Component{

  constructor(){
    super();
    this.state = {
      itemSelectOpen: false,
      menuOpen: false
    }
  }

  openItemSelect = () => {
    this.setState({itemSelectOpen: true})
  }
  closeItemSelect = () => {
    this.setState({itemSelectOpen: false})
  }
  openMenu = () => {
    this.setState({menuOpen: true})
  }
  closeMenu = () => {
    if(this.state.menuOpen === true)
      this.setState({menuOpen: false})
  }

  render() {

    let {setItemIndex, setWordIndex, updateItem, toggleFreeze, selectItemList,
        connectToReceiver, logout} = this.props.parent;
    let {wordIndex, itemList, item, backgrounds, itemIndex, freeze, itemLists,
       selectedItemList, isLoggedIn, isSender} = this.props.parent.state;

    let buttonLoggedIn = {margin:'0.5%', width:'60%', minWidth:'18vw'}
    let menuItem = {
      display:'inline-block', height: '5vh', width:'95%', backgroundColor:'#fff', margin: '10% 2.5%',
      fontSize: "calc(8px + 0.75vw)"
    }
    let connectedIcon = {marginLeft:'0.5vw', width:'5vw', height:'3.85vw', margin: 'auto', display:'block'}

    return (
      <div style={{width:'100%', overflow:'hidden', height:'100vh', backgroundColor:'#d9e3f4',
        position: 'fixed'}} onClick={this.closeMenu}>
        <div style={{width:'100%', height:'5vh', paddingTop:'0.5vh', paddingBottom:'0.5vh',
          backgroundColor:'#1d517f', display:'flex'}}>
          <button style={{margin:'auto', width:'22.5%', height:'4.5vh', fontSize:'calc(8px + 0.75vmax)'}}
            onClick={this.openMenu}>Menu</button>
          <div style={this.state.menuOpen ?
              {backgroundColor:'#1d517f', position:'absolute', width:'22vw', top:'5.5vh', left:'4.25vw',
              zIndex: 3}
              : {display:'none'}}>
              <button style={menuItem} onClick={() => (this.props.history.push("/"))}>Home</button>
                <button style={menuItem} onClick={connectToReceiver}> Connect To Receiver </button>
                {isSender && <img style={connectedIcon}
                   alt="connected" src={connected}
                  />}
                {!isSender && <img style={connectedIcon}
                   alt="disconnected" src={disconnected}
                  />}
              {!isLoggedIn &&<Link to="/login"><button style={menuItem}>Login</button></Link>}
              {isLoggedIn && <button style={menuItem} onClick={logout}>Logout</button>}
            </div>
          <button style={{margin:'auto', width:'22.5%', height:'4.5vh', fontSize:'calc(8px + 0.75vmax)'}}
            onClick={this.openItemSelect}
            >Change Item</button>
          {freeze && <div style={{display:'flex', margin:'auto', width:'30%', height:'4.5vh',
             fontSize:'calc(8px + 0.75vmax)'}}>
              <button style={buttonLoggedIn} onClick={toggleFreeze}>Unfreeze</button>
              <img style={{paddingLeft:'5%', paddingTop:'1%', width:'40%', height:'5.5vw',
                maxHeight:'4.5vh', maxWidth:'8vh'}}
                 alt="off" src={off}
                />
              </div>
            }
            {!freeze && <div style={{display:'flex', margin:'auto', width:'30%', height:'4.5vh',
               fontSize:'calc(8px + 0.75vmax)'}}>
            <button style={buttonLoggedIn} onClick={toggleFreeze}>Freeze</button>
              <img style={{paddingLeft:'5%', paddingTop:'1%', width:'40%', height:'5.5vw',
              maxHeight:'4.5vh', maxWidth:'8vh'}}
                 alt="on" src={on}
                />
              </div>
            }
        </div>
        <div style={{display:'block', fontSize:'calc(10px + 1vmax)'}}>
          <div style={{width:'100vw', height: '56.25vw'}}>
            <MobileDisplay wordIndex={wordIndex} backgrounds={backgrounds}
              item={item} updateItem={updateItem}/>
          </div>
          <div style={{paddingTop:'1.5%', maxWidth:'100%'}}>
            <MobileSlides setWordIndex={setWordIndex} wordIndex={wordIndex}
              item={item} updateItem={updateItem}
              backgrounds={backgrounds}
              />
          </div>
        </div>
        {this.state.itemSelectOpen &&
          <div style={{position:'fixed', top:0, left:0, height:'100vh',
             zIndex: 2, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
            <div style={{position:'fixed', display:'flex', top:'2vmax', left:'13vw',
               zIndex: 3, backgroundColor:'#d9e3f4', width:'70vw', maxWidth:'100%'}}>
             <MobileListChanger selectedItemList={selectedItemList}
               selectItemList={selectItemList} itemLists={itemLists}/>

              <MobileItemList setItemIndex={setItemIndex} setWordIndex={setWordIndex}
                itemList={itemList} backgrounds={backgrounds} updateItem={updateItem}
                 itemIndex={itemIndex} close={this.closeItemSelect}
                />
            </div>
        </div>}
      </div>
    )
  }

}
