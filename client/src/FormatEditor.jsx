import React from 'react';
import {ChromePicker} from 'react-color';
import fsUP from './assets/fontSizeUP.png';
import fsDOWN from './assets/fontSizeDOWN.png';
import cPicker from './assets/color-picker.png';
import cPickerClose from './assets/color-picker-close.png';
import brightness_img from './assets/brightness.png';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class FormatEditor extends React.Component{

  constructor(){
    super();
    this.state = {
      cPickerOpen: false,
      color: "#FFFFFF",
      fontSize: 5,
      updating: false,
      brightness: 100
    }

    this.throttle = null

  }
  openColors = () => {
    this.setState({cPickerOpen: true})
  }

  closeColors = () => {
    this.setState({
      cPickerOpen: false
    })
  }

  changeBrightness = (level) => {
    this.setState({brightness: level})
  }

  colorChange = (event) => {
    this.setState({color: event.rgb})
    this.props.updateFontColor(event.rgb)
  }

  updateFont = (fontSize) => {
    if(fontSize > 7.5){
      fontSize = 7.5
    }
    else if(fontSize < 0.25){
      fontSize = 0.25
    }
    this.setState({fontSize: fontSize})
    this.props.updateFontSize(fontSize)
  }

  fontSizeUP = () => {
    let {fontSize} = this.state;
    this.updateFont(fontSize+0.25)
  }

  fontSizeDOWN = () => {
    let {fontSize} = this.state;
    this.updateFont(fontSize-0.25)
  }

  fontSizeChange = (event) => {
    let val;
    let {updating} = this.state;
    let that = this;
    if(event.target.value.length === 0)
      val = 1;
    else{
      val = parseInt(event.target.value, 10);
      val/=4;
    }

    if(val > 7.5)
      val = 7.5

    clearTimeout(this.throttle)
    if(updating){
      this.throttle = setTimeout(function(){
        let fontSize = that.state.fontSize;
        that.updateFont(fontSize)
        that.setState({updating: false})
      }, 100)
    }
    else{
      this.updateFont(val)
    }

    this.setState({updating: true})
    // Helper.debounce(() => (that.updateFont(val)),1000);
    // Helper.throttle(function(){alert("hi")}, 1000)
  }



  componentDidUpdate(prevProps, prevState){

    let{item, wordIndex} = this.props;

    if((wordIndex !== prevProps.wordIndex) || (item._id !== prevProps.item._id)){
      let slides = item.slides || null;
      let slide = slides ? slides[wordIndex] : null;
      if(!slide)
        return;
      if(slide.boxes[0].brightness !== undefined)
        this.setState({brightness: slide.boxes[0].brightness})
      else{
        this.setState({brightness: 100})
      }
      this.setState({fontSize: slide.boxes[0].fontSize})
      let stringToRGB = slide.boxes[0].fontColor.replace(/[^\d,]/g, '').split(',');
      this.setState({
        color: {
          r: stringToRGB[0],
          g: stringToRGB[1],
          b: stringToRGB[2],
          a: stringToRGB[3]
        }
      })


    }
  }

  render() {

    let {cPickerOpen, fontSize, brightness} = this.state;
    let sliderStyle = {width: '5vw', margin: '.5vw 1vw'}

    return (
        <div >
        <div style={{display:'flex'}}>
            <img className='imgButton' style={!cPickerOpen ? {marginRight:'1vw', fontSize: "calc(8px + 0.4vw)", width:'1.5vw', height: '1.5vw',} : {display:'none'}}
              alt="cPicker" src={cPicker}
              onClick={this.openColors}/>
            <img className='imgButton' style={!cPickerOpen ? {display:'none'} : {marginRight:'1vw', fontSize: "calc(8px + 0.4vw)", width:'1.5vw', height: '1.5vw'} }
              alt="cPickerClose" src={cPickerClose}
              onClick={this.closeColors}/>
            <div style={cPickerOpen ? {position:'fixed', zIndex:2, top: '5vh', backgroundColor:'#EEE', padding:'5px'} : {display: 'none'}}>
                <ChromePicker color={this.state.color} onChange={this.colorChange}/>
            </div>
           <input style={{width: '1.25vw', height: '1.25vw',marginRight:'1vw', fontSize:"calc(7px + 0.25vw)"}}
             value={String(fontSize*4)} onChange={this.fontSizeChange}/>
           <img className='imgButton' style={{width:'1.25vw', height: '1.25vw', marginRight:'1vw'}}
              onClick={this.fontSizeUP}
              alt="fsUP" src={fsUP}
            />
          <img className='imgButton' style={{width:'1.25vw', height: '1.25vw', marginRight:'1vw'}}
                onClick={this.fontSizeDOWN}
                alt="fsDOWN" src={fsDOWN}
            />
          <img style={{marginLeft:'1vw', marginTop:'.25vw', width:'1.5vw', height:'1.5vw'}}
                 alt="brightness" src={brightness_img}
                />
              <Slider style={sliderStyle} min={1} value={brightness} onChange={this.changeBrightness}
                onAfterChange={() => this.props.updateBrightness(brightness)}/>
          </div>
        </div>
    )
  }

}
export default FormatEditor;
