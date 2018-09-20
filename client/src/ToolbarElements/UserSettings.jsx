import React from 'react';
import blank from '../assets/blank.png';
import brightness_img from '../assets/brightness.png';
import Slider from 'rc-slider';

export default class UserSettings extends React.Component{

  constructor () {
    super();

    this.state = {
      selectedSetting: 'defaultBibleBackground',
      brightness: 100
    }
  }

  componentDidMount(){
    let {userSettings} = this.props.state;
    let brightness = userSettings.defaultBibleBackground ? userSettings.defaultBibleBackground.brightness : 100;
    this.setState({brightness: brightness})
  }

  changeBrightness = (brightness) => {
    this.setState({brightness: brightness})
  }

  changeSetting = (background) => {
    let {selectedSetting, brightness} = this.state;
    let obj = {type: selectedSetting, settings: {brightness: brightness, name: background}}
    this.props.updateUserSetting(obj)
  }
  updateBrightness = (brightness) => {
    let {userSettings} = this.props.state;
    let {selectedSetting} = this.state;
    let background = userSettings[selectedSetting].name;
    let obj = {type: selectedSetting, settings: {brightness: brightness, name: background}}
    this.props.updateUserSetting(obj)
  }

  getBackgroundStyle(setting){
    let {backgrounds} = this.props.state;
    let img = blank, asset;
    if(backgrounds.some(e => e.name === setting.name)){
      asset = backgrounds.find(e => e.name === setting.name);
      img = asset.image.src;
    }

    let level = "100%";
    if(setting.brightness)
      level = setting.brightness+"%"

    let backgroundStyle= {backgroundImage: 'url('+img+')', backgroundSize: '100% 100%',
      filter: `brightness(${level})`, width: '6vw', height: '3.38vw', marginRight: '0.25vw'}

    return backgroundStyle;
  }

  render(){
    let {selectedSetting, brightness} = this.state;
    let {backgrounds, userSettings} = this.props.state;
    let defaultBibleBackground = userSettings.defaultBibleBackground || {};
    let defaultSongBackground = userSettings.defaultSongBackground || {};
    let defaultScreenBackground = userSettings.defaultScreenBackground || {};
    let defaultWelcomeBackground = userSettings.defaultWelcomeBackground || {};
    let defaultFarewellBackground = userSettings.defaultFarewellBackground || {};

    let BCKS = [], fullArray= [], row = [];
    let numCols = 7;
    let style={
      position:'absolute',    zIndex:6,                   left:'15%',
      top:'10%',              backgroundColor: '#383838', border: '1px solid #383838',
      boxShadow: '0 5px 10px rgb(0, 0, 0)',               borderRadius: 3,
      padding: 10,            width: '60vw',              height: '60vh',
      color: 'white'
    }

    let buttonStyle = {fontSize: "calc(7px + 0.4vw)", margin:"1vh 0.25vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.25vw',
       width: '9vw', float: 'right'}

    let backgroundTableStyle = {
        overflowY: 'scroll',    height: '38vh',
        background: '#383838',  marginTop: '1vh',   border: '0.25vw solid #c4c4c4',
        position:'relative',    marginLeft: '2vw'
    }

    let itemStyle = {
        border:'0.25vw',   borderColor: '#383838',    borderStyle:'solid',
        height: '3vmax',   width: '5.33vmax',         padding: '.1vmax'
      }

    let sectionWords = {
      marginRight: '0.25vw', fontSize: "calc(8px + 0.35vw)", width: '4vw'
    }

    let sliderStyle = {width: '5vw', margin: '.5vw 1vw'}

    let bibleBackgroundStyle = this.getBackgroundStyle(defaultBibleBackground);
    let songBackgroundStyle = this.getBackgroundStyle(defaultSongBackground);
    let screenBackgroundStyle = this.getBackgroundStyle(defaultScreenBackground);
    let welcomeBackgroundStyle = this.getBackgroundStyle(defaultWelcomeBackground);
    let farewellBackgroundStyle = this.getBackgroundStyle(defaultFarewellBackground);

    let sectionStyle = {display: 'flex', border: '.25vw solid #383838', height: '7vh',
       marginTop: '1vh', padding:'1%'}
    let selectedSectionStyle = Object.assign({}, sectionStyle);
    selectedSectionStyle.border = '.25vw solid #4286f4'

    for(var i = 0; i < backgrounds.length; i+=numCols){
      for(var j = i; j < i+numCols; ++j){
        if(backgrounds[j])
          row.push(backgrounds[j]);
      }
      fullArray.push(row);
      row = [];
    }

    let that = this;
    BCKS = fullArray.map((element, index) => {
      let row = element.map(function (pic, i){
        return(
          <div key={index*numCols+i}>
            <img className='imgButton' onClick={ () => (that.changeSetting(pic.name))}
              style={itemStyle} alt={pic.name} src={pic.image.src}/>
          </div>
        )
      })
      return (
        <div style={{display:'flex', paddingBottom:'0.5vh', paddingRight: '0.5vw'}} key={index}> {row}</div>
      );
    })

      return (
        <div style={{position:'fixed', top:0, left:0, height:'100vh',
          zIndex: 5, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
          <div style={style}>
            <div style={{display: 'flex'}}>
              <img style={{marginLeft:'1vw', marginTop:'.25vw', width:'1.5vw', height:'1.5vw'}}
                  alt="brightness" src={brightness_img}
                  />
                <Slider style={sliderStyle} min={1} value={brightness} onChange={this.changeBrightness}
                onAfterChange={() => this.updateBrightness(brightness)}/>
            </div>
            <div style={{display: 'flex'}}>
              <div>
                <div onClick={ () => (this.setState({
                    selectedSetting: 'defaultBibleBackground',
                    brightness: userSettings.defaultBibleBackground ? userSettings.defaultBibleBackground.brightness : 100
                  }))}
                  style={selectedSetting === 'defaultBibleBackground' ? selectedSectionStyle : sectionStyle}>
                  <div style={sectionWords}>Bible</div>
                  <div style={bibleBackgroundStyle}></div>
                </div>
                <div onClick={ () => (this.setState({
                    selectedSetting: 'defaultSongBackground',
                    brightness: userSettings.defaultSongBackground ? userSettings.defaultSongBackground.brightness : 100
                  }))}
                  style={selectedSetting === 'defaultSongBackground' ? selectedSectionStyle : sectionStyle}>
                  <div style={sectionWords}>Song</div>
                  <div style={songBackgroundStyle}></div>
                </div>
                <div onClick={ () => (this.setState({
                    selectedSetting: 'defaultScreenBackground',
                    brightness: userSettings.defaultScreenBackground ? userSettings.defaultScreenBackground.brightness : 100
                  }))}
                  style={selectedSetting === 'defaultScreenBackground' ? selectedSectionStyle : sectionStyle}>
                  <div style={sectionWords}>Default</div>
                  <div style={screenBackgroundStyle}></div>
                </div>
                <div onClick={ () => (this.setState({
                    selectedSetting: 'defaultWelcomeBackground',
                    brightness: userSettings.defaultWelcomeBackground ? userSettings.defaultWelcomeBackground.brightness : 100
                  }))}
                  style={selectedSetting === 'defaultWelcomeBackground' ? selectedSectionStyle : sectionStyle}>
                  <div style={sectionWords}>Welcome</div>
                  <div style={welcomeBackgroundStyle}></div>
                </div>
                <div onClick={ () => (this.setState({
                    selectedSetting: 'defaultFarewellBackground',
                    brightness: userSettings.defaultFarewellBackground ? userSettings.defaultFarewellBackground.brightness : 100
                  }))}
                  style={selectedSetting === 'defaultFarewellBackground' ? selectedSectionStyle : sectionStyle}>
                  <div style={sectionWords}>Farewell</div>
                  <div style={farewellBackgroundStyle}></div>
                </div>
              </div>
              <div>
                <div style={backgroundTableStyle}>{BCKS}</div>
                <button style={buttonStyle} onClick={this.props.close}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )
  }
}
