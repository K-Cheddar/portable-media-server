import React, { Component } from 'react';
import blank from '../assets/blank.png';

import on from '../assets/on.png';
import off from '../assets/off.png';

export default class ProjectorControl extends Component {

  getBackgroundStyle(setting){
    let {backgrounds} = this.props;
    let img = blank, asset;
    if(backgrounds.some(e => e.name === setting.name)){
      asset = backgrounds.find(e => e.name === setting.name);
      img = asset.image.src;
    }

    let level = "100%";
    if(setting.brightness)
      level = setting.brightness+"%"

    let backgroundStyle= {backgroundImage: 'url('+img+')', backgroundSize: '100% 100%',
      filter: `brightness(${level})`, width: '3vw', height: '1.69vw'}

    return backgroundStyle;
  }

  render(){

    let {toggleFreeze, freeze, userSettings, updateCurrent} = this.props;
    let defaultScreenBackground = userSettings.defaultScreenBackground || {};
    let defaultWelcomeBackground = userSettings.defaultWelcomeBackground || {};
    let defaultFarewellBackground = userSettings.defaultFarewellBackground || {};

    let buttonStyle = {
       fontSize: "calc(5px + 0.35vw)", margin:'.25vw', width:'6vw', height: '2.5vh',
       border: '0.15vw solid #474747'
    }

    let blankBackgroundStyle = this.getBackgroundStyle('');
    let screenBackgroundStyle = this.getBackgroundStyle(defaultScreenBackground);
    let welcomeBackgroundStyle = this.getBackgroundStyle(defaultWelcomeBackground);
    let farewellBackgroundStyle = this.getBackgroundStyle(defaultFarewellBackground);

    return(
      <div>
        {freeze && <div style={{display:'flex', margin: 'auto', width: '70%'}}>
         <div>
           <button style={buttonStyle} onClick={toggleFreeze}>Unfreeze</button>
         </div>
          <img style={{paddingTop:'0.35vh', width:'2.75vw', height:'1.25vw'}}
             alt="off" src={off}
            />
          </div>
        }
        {!freeze && <div style={{display:'flex', margin: 'auto', width: '70%'}}>
        <div>
          <button style={buttonStyle} onClick={toggleFreeze}>Freeze</button>
        </div>
          <img style={{paddingTop:'0.35vh', width:'2.75vw', height:'1.25vw'}}
             alt="on" src={on}
            />
          </div>
        }
        <div style={{display: 'flex', marginTop: '1vh'}}>
          <div className='imgButton' style={{marginRight: '0.5vw'}}>
            <div onClick={ () => {updateCurrent({image: ''})}}
              style={blankBackgroundStyle}></div>
            <div style={{fontSize: 'calc(5px + 0.25vw)', textAlign: 'center'}}>Black</div>
          </div>
          <div className='imgButton' style={{marginRight: '0.5vw'}}>
            <div onClick={ () => {updateCurrent({image: defaultScreenBackground.name})}}
              style={screenBackgroundStyle}></div>
            <div style={{fontSize: 'calc(5px + 0.25vw)', textAlign: 'center'}}>Default</div>
          </div>
          <div className='imgButton' style={{marginRight: '0.5vw'}}>
            <div onClick={ () => {updateCurrent({image: defaultWelcomeBackground.name})}}
              style={welcomeBackgroundStyle}></div>
            <div style={{fontSize: 'calc(5px + 0.25vw)', textAlign: 'center'}}>Welcome</div>
          </div>
          <div className='imgButton' style={{marginRight: '0.5vw'}}>
            <div onClick={ () => {updateCurrent({image: defaultFarewellBackground.name})}}
              style={farewellBackgroundStyle}></div>
            <div style={{fontSize: 'calc(5px + 0.25vw)', textAlign: 'center'}}>Farewell</div>
          </div>
        </div>
      </div>
    )
  }
}
