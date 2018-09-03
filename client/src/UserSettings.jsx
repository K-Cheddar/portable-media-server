import React from 'react';
import blank from './assets/blank.png';
import brightness_img from './assets/brightness.png';
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
    let brightness = userSettings.defaultBibleBackground.brightness;
    this.setState({brightness: brightness})
  }

  changeBrightness = (brightness) => {
    this.setState({brightness: brightness})
  }

  changeSetting = (background) => {
    let {selectedSetting, brightness} = this.state;
    let obj = {type: selectedSetting, settings: {brightness: brightness, name: background}}
    this.props.updateUserSettings(obj)
  }
  updateBrightness = (brightness) => {
    let {userSettings} = this.props.state;
    let {selectedSetting} = this.state;
    let background = userSettings[selectedSetting].name;
    let obj = {type: selectedSetting, settings: {brightness: brightness, name: background}}
    this.props.updateUserSettings(obj)
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
      filter: `brightness(${level})`, width: '10vw', height: '5.63vw', marginRight: '1vw'}

    return backgroundStyle;
  }

  render(){
    let {selectedSetting, brightness} = this.state;
    let {backgrounds, userSettings} = this.props.state;
    let defaultBibleBackground = userSettings.defaultBibleBackground || {};
    let defaultSongBackground = userSettings.defaultSongBackground || {};

    let BCKS = [], fullArray= [], row = [];
    let numCols = 7;
    let style={
      position:'absolute',    zIndex:6,                   left:'15%',
      top:'10%',              backgroundColor: '#EEE',    border: '1px solid #CCC',
      boxShadow: '0 5px 10px rgb(0, 0, 0)',               borderRadius: 3,
      padding: 10,            width: '70vw',              height: '60vh',
    }

    let backgroundTableStyle = {
        overflowY: 'scroll',    height: '38vh',
        background: '#d9e3f4',  marginTop: '1vh',   border: '0.25vw solid #CCC',
        position:'relative'
    }

    let itemStyle = {
        border:'0.25vw',   borderColor: '#d9e3f4',    borderStyle:'solid',
        height: '3vmax',   width: '5.33vmax',         padding: '.1vmax'
      }
    let itemSelectedStyle = {
        border:'0.25vw',    borderColor: '#4286f4',     borderStyle:'solid',
        height: '3vmax',    width: '5.33vmax',          padding: '.1vmax'
      }

    let sliderStyle = {width: '5vw', margin: '.5vw 1vw'}

    let bibleBackgroundStyle = this.getBackgroundStyle(defaultBibleBackground);

    let songBackgroundStyle = this.getBackgroundStyle(defaultSongBackground);

    let sectionStyle = {display: 'flex', border: '.25vw solid lightgrey', height: '12vh', marginTop: '1vh'}
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
        let itemSelected = false //(index*numCols + i === selected);
        return(
          <div key={index*numCols+i}>
            <img className='imgButton' onClick={ () => (that.changeSetting(pic.name))}
              style={itemSelected ? itemSelectedStyle: itemStyle} alt={pic.name} src={pic.image.src}/>
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
                    brightness: userSettings.defaultBibleBackground.brightness
                  }))}
                  style={selectedSetting === 'defaultBibleBackground' ? selectedSectionStyle : sectionStyle}>
                  <div style={{marginRight: '1vw', fontSize: "calc(10px + 0.5vw)"}}>Default Bible Background</div>
                  <div style={bibleBackgroundStyle}></div>
                </div>
                <div onClick={ () => (this.setState({
                    selectedSetting: 'defaultSongBackground',
                    brightness: userSettings.defaultSongBackground.brightness
                  }))}
                  style={selectedSetting === 'defaultSongBackground' ? selectedSectionStyle : sectionStyle}>
                  <div style={{marginRight: '1vw', fontSize: "calc(10px + 0.5vw)"}}>Default Song Background</div>
                  <div style={songBackgroundStyle}></div>
                </div>
              </div>
              <div>
                <div style={backgroundTableStyle}>{BCKS}</div>
                <button style={{right: '1vw', position: 'absolute', marginTop: '1vh'}} onClick={this.props.close}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )
  }
}
