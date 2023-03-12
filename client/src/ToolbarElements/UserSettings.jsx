import React from 'react';
import blank from '../assets/blank.png';
import brightness_img from '../assets/brightness.png';
import closeIcon from '../assets/closeIcon.png'
import deleteX from '../assets/deleteX.png';
import Slider from 'rc-slider';

export default class UserSettings extends React.Component{

  constructor () {
    super();

    this.state = {
      selectedSetting: 'defaultBibleBackground',
      brightness: 100,
      showDelete: false
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
      filter: `brightness(${level})`, width: '4vw', height: '2.25vw', marginRight: '0.25vw'}

    return backgroundStyle;
  }


  render(){
    let { selectedSetting, brightness, showDelete } = this.state;
    let {backgrounds, userSettings} = this.props.state;

    let settingObjs = [
      {name: 'defaultBibleBackground', type: 'Bible'},
      {name: 'defaultSongBackground', type: 'Song'},
      {name: 'defaultScreenBackground', type: 'Default'},
      {name: 'defaultWelcomeBackground', type: 'Welcome'},
      {name: 'defaultFarewellBackground', type: 'Farewell'},
      {name: 'defaultAnnouncementsBackground', type: 'Announcements'},
      {name: 'defaultTimerBackground', type: 'Timer'}
    ]

    let fullArray= [], row = []
    let numCols = 8;
    let style={
      position:'absolute',    zIndex:6,                   left:'8%',
      top:'10%',              backgroundColor: '#383838', border: '0.1vw solid white',
      boxShadow: '0 5px 10px rgb(0, 0, 0)',               borderRadius: '1vw',
      padding: 10,            width: '82vw',              height: '75vh',
      color: 'white'
    }

    let backgroundTableStyle = {
        overflowY: 'scroll',    height: '65vh',
        background: '#383838',  marginTop: '1vh',   border: '0.25vw solid #c4c4c4',
        position:'relative',    marginLeft: '2vw'
    }

    let buttonStyle = {
      fontSize: "calc(8px + 0.6vw)", margin:'0.25%', width:'11vw', backgroundColor:'#383838',
          borderRadius:'0.5vw', color: 'white', overflow: 'hidden',
          borderWidth: '0.2vw', borderStyle: 'solid', borderColor: '#06d1d1'
    }

    let itemStyle = {
        border:'0.25vw',   borderColor: '#383838',    borderStyle:'solid',
        height: '3vmax',   width: '5.33vmax',         padding: '.1vmax'
      }

    let sectionWords = {
      marginRight: '0.25vw', fontSize: "0.75vw", width: '6vw'
    }

    let windowBackground = {position: 'fixed',top: 0, left:0, height: '100vh', width: '100vw',
      zIndex: 5, backgroundColor: 'rgba(62, 64, 66, 0.5)'}

    let sliderStyle = {width: '5vw', margin: '.5vw 1vw'}

    let sectionStyle = {display: 'flex', border: '2px solid #606060', height: '5vh',
       marginTop: '8px', padding:'3px'}
    let selectedSectionStyle = Object.assign({}, sectionStyle);
    selectedSectionStyle.border = '2px solid #4286f4'

    for(var i = 0; i < backgrounds.length; i+=numCols){
      for(var j = i; j < i+numCols; ++j){
        if(backgrounds[j])
          row.push(backgrounds[j]);
      }
      fullArray.push(row);
      row = [];
    }

    let that = this;
    let BCKS = fullArray.map((element, index) => {
      let row = element.map(function (pic, i){
        return(
          <div key={index*numCols+i + pic.name} style={{ display: 'flex', border: '1px solid gray', padding: '2px', margin: '2px'}}>
            <img className='imgButton' onClick={ () => that.changeSetting(pic.name)}
              style={itemStyle} alt={pic.name} src={pic.image.src}/>
            {showDelete && <img className='imgButton' style={{marginTop:'12px', width:'1.5vw', height:'1.5vw'}}
              onClick={ () => that.props.updateImageList(index*numCols+i)}
              alt="delete" src={deleteX}/> }
          </div>
        )
      })
      return (
        <div style={{display:'flex', paddingBottom:'0.5vh', paddingRight: '0.5vw'}} key={index}> {row}</div>
      );
    })

    let settings = settingObjs.map((element, index) => {
      let loadedSetting = userSettings[element.name] || ''
      let style = this.getBackgroundStyle(loadedSetting)
      return(
        <div onClick={ () => this.setState({
            selectedSetting: element.name,
            brightness: userSettings[element.name] ? userSettings[element.name].brightness : 100
            })}
            style={selectedSetting === element.name ? selectedSectionStyle : sectionStyle}
            key={element.name}
          >
          <div style={sectionWords}>{element.type}</div>
          <div style={style}></div>
        </div>
      )
    })

      return (
        <div style={windowBackground}>
          <div style={style}>
            <div style={{display: 'flex'}}>
              <img style={{marginLeft:'1vw', marginTop:'.25vw', width:'1.5vw', height:'1.5vw'}}
                  alt="brightness" src={brightness_img}
                  />
                <Slider style={sliderStyle} min={1} value={brightness} onChange={this.changeBrightness}
                onAfterChange={() => this.updateBrightness(brightness)}/>
                <button onClick={() => this.setState({ showDelete: !this.state.showDelete })} style={buttonStyle}>Show Delete</button>
                <img className='imgButton' style={{display:'block', width:'1.25vw', height:'1.25vw',
                  padding: '0.25vh 0.25vw', position: 'absolute', right: '1vw'}}
                   alt="closeIcon" src={closeIcon}
                  onClick={this.props.close}
                  />
            </div>
            <div style={{display: 'flex'}}>
              <div>
                {settings}
              </div>
              <div style={backgroundTableStyle}>{BCKS}</div>
            </div>
          </div>
        </div>
      )
  }
}
