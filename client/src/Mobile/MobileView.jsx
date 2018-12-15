import React, { Component } from "react";
import { Link } from "react-router-dom";
import MobileSlides from "./MobileSlides";
import MobileItemList from "./MobileItemList";
import MobileDisplay from "./MobileDisplay";
import MobileListChanger from "./MobileListChanger";
// import MobileArrangeLyrics from './MobileArrangeLyrics';

import on from "../assets/on.png";
import off from "../assets/off.png";
import connected from "../assets/connected.png";

export default class MobileView extends Component {
  constructor() {
    super();
    this.state = {
      itemSelectOpen: false,
      menuOpen: false,
      arrangeLyricsOpen: false
    };
  }

  openArrangeLyrics = () => {
    this.setState({ arrangeLyricsOpen: true });
  };
  closeArrangeLyrics = () => {
    this.setState({ arrangeLyricsOpen: false });
  };

  openItemSelect = () => {
    this.setState({ itemSelectOpen: true });
  };
  closeItemSelect = () => {
    this.setState({ itemSelectOpen: false });
  };
  openMenu = () => {
    this.setState({ menuOpen: true });
  };
  closeMenu = () => {
    if (this.state.menuOpen === true) this.setState({ menuOpen: false });
  };

  render() {
    let {
      setItemIndex,
      setWordIndex,
      updateItem,
      toggleFreeze,
      selectItemList,
      logout
    } = this.props.parent; //connectToReceiver,
    let {
      wordIndex,
      itemList,
      item,
      backgrounds,
      itemIndex,
      freeze,
      itemLists,
      selectedItemList,
      isLoggedIn,
      isSender,
      boxIndex
    } = this.props.parent.state;

    let buttonLoggedIn = {
      margin: "auto",
      width: "25vw",
      minWidth: "18vw",
      backgroundColor: "#383838",
      color: "white",
      height: "4.5vh"
    };
    let menuItem = {
      display: "inline-block",
      height: "5vh",
      width: "95%",
      backgroundColor: "#06d1d1",
      margin: "10% 2.5%",
      fontSize: "calc(8px + 0.75vw)",
      color: "black"
    };
    let connectedIcon = {
      marginLeft: "0.5vw",
      width: "5vw",
      height: "3.85vw",
      margin: "auto",
      display: "block"
    };
    let menuStyle = {
      backgroundColor: "#383838",
      position: "absolute",
      width: "22vw",
      top: "5.5vh",
      left: "4.25vw",
      zIndex: 5
    };
    return (
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          height: "100vh",
          backgroundColor: "#383838",
          position: "fixed"
        }}
        onClick={this.closeMenu}
      >
        <div
          style={{
            width: "100%",
            height: "5vh",
            paddingTop: "0.5vh",
            paddingBottom: "0.5vh",
            backgroundColor: "#06d1d1",
            display: "flex"
          }}
        >
          <button style={buttonLoggedIn} onClick={this.openMenu}>
            Menu
          </button>
          <div style={this.state.menuOpen ? menuStyle : { display: "none" }}>
            <button
              style={menuItem}
              onClick={() => this.props.history.push("/")}
            >
              Home
            </button>
            {/*{(item.type === 'song') && <button style={menuItem}
                onClick={this.openArrangeLyrics}>Arrange Lyrics</button>}
                <button style={menuItem} onClick={connectToReceiver}> Connect To Receiver </button>*/}
            {isSender && (
              <img style={connectedIcon} alt="connected" src={connected} />
            )}
            {!isLoggedIn && (
              <Link to="/login">
                <button style={menuItem}>Login</button>
              </Link>
            )}
            {isLoggedIn && (
              <button style={menuItem} onClick={logout}>
                Logout
              </button>
            )}
          </div>
          <button style={buttonLoggedIn} onClick={this.openItemSelect}>
            Change Item
          </button>
          {freeze && (
            <div style={{ display: "flex", margin: "auto" }}>
              <button style={buttonLoggedIn} onClick={toggleFreeze}>
                Unfreeze
              </button>
              <img
                style={{ width: "12vw", height: "5.52vw", margin: "1vh 1vw" }}
                alt="off"
                src={off}
              />
            </div>
          )}
          {!freeze && (
            <div style={{ display: "flex", margin: "auto" }}>
              <button style={buttonLoggedIn} onClick={toggleFreeze}>
                Freeze
              </button>
              <img
                style={{ width: "12vw", height: "5.52vw", margin: "1vh 1vw" }}
                alt="on"
                src={on}
              />
            </div>
          )}
        </div>
        <div style={{ display: "block", fontSize: "calc(10px + 1vmax)" }}>
          <div style={{ width: "100vw", height: "56.25vw" }}>
            <MobileDisplay
              wordIndex={wordIndex}
              backgrounds={backgrounds}
              item={item}
              updateItem={updateItem}
            />
          </div>
          <div style={{ paddingTop: "1.5%", maxWidth: "100%" }}>
            <MobileSlides
              setWordIndex={setWordIndex}
              wordIndex={wordIndex}
              item={item}
              updateItem={updateItem}
              boxIndex={boxIndex}
              backgrounds={backgrounds}
            />
          </div>
        </div>
        {this.state.itemSelectOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              zIndex: 4,
              backgroundColor: "rgba(62, 64, 66, 0.5)",
              width: "100vw"
            }}
          >
            <div
              style={{
                position: "fixed",
                display: "flex",
                top: "2vmax",
                left: "13vw",
                zIndex: 5,
                backgroundColor: "#383838",
                width: "70vw",
                maxWidth: "100%",
                color: "white"
              }}
            >
              <MobileListChanger
                selectedItemList={selectedItemList}
                selectItemList={selectItemList}
                itemLists={itemLists}
              />
              <MobileItemList
                setItemIndex={setItemIndex}
                setWordIndex={setWordIndex}
                itemList={itemList}
                backgrounds={backgrounds}
                updateItem={updateItem}
                itemIndex={itemIndex}
                close={this.closeItemSelect}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

// {this.state.arrangeLyricsOpen &&
//   <div style={{position:'fixed', top:0, left:0, height:'100vh',
//      zIndex: 2, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
//     <div style={{position:'fixed', display:'flex', top:'1vh', left:'13vw',
//        zIndex: 3, backgroundColor:'#383838', width:'80vw', color: 'white', height: '90vh'}}>
//      <MobileArrangeLyrics item={item} close={this.closeArrangeLyrics}
//        formatSong={this.props.formatSong} updateItem={updateItem}/>
//     </div>
// </div>}
//
