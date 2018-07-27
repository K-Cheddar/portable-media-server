import React from 'react';
import {ChromePicker} from 'react-color';
import fsUP from './assets/fontSizeUP.png';
import fsDOWN from './assets/fontSizeDOWN.png';
import cPicker from './assets/color-picker.png';
import cPickerClose from './assets/color-picker-close.png';

class FormatEditor extends React.Component{

  constructor(){
    super();
    this.state = {
      cPickerOpen: false,
      color: "#FFFFFF",
      fontSize: 5,
      updating: false
    }

    this.throttle = null

    this.colorChange = this.colorChange.bind(this);
    this.openColors = this.openColors.bind(this);
    this.closeColors = this.closeColors.bind(this);
    this.fontSizeUP = this.fontSizeUP.bind(this);
    this.fontSizeDOWN = this.fontSizeDOWN.bind(this);
    this.fontSizeChange = this.fontSizeChange.bind(this);
    this.updateFont = this.updateFont.bind(this);
  }
  openColors(){
    this.setState({cPickerOpen: true})
  }

  closeColors(){
    this.setState({
      cPickerOpen: false
    })
  }

  colorChange(event){
    this.setState({color: event.rgb})
    this.props.updateFormat({c: event.rgb, updateColor: true})
  }

  updateFont(fontSize){
    if(fontSize > 7.5){
      fontSize = 7.5
    }
    else if(fontSize < 0.25){
      fontSize = 0.25
    }
    this.props.updateFormat({fontSize: fontSize})
  }

  fontSizeUP(){
    let {fontSize} = this.state;
    this.setState({fontSize: fontSize+0.25})
    this.updateFont(fontSize+0.25)

  }

  fontSizeDOWN(){
    let {fontSize} = this.state;
    this.setState({fontSize: fontSize-0.25})
    this.updateFont(fontSize-0.25)
  }

  fontSizeChange(event){
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

    this.setState({fontSize: val, updating: true})
    // Helper.debounce(() => (that.updateFont(val)),1000);
    // Helper.throttle(function(){alert("hi")}, 1000)
  }



  componentDidUpdate(prevProps, prevState){

    let{item, wordIndex} = this.props;

    if((wordIndex !== prevProps.wordIndex) || (item.name !== prevProps.item.name)){
      this.setState({fontSize: item.slides ? item.slides[wordIndex].boxes[0].fontSize : 4})
      if(prevProps.item._id !== item._id){
        let stringToRGB = item.slides ? item.slides[wordIndex].boxes[0].fontColor.replace(/[^\d,]/g, '').split(',') : [1,2,3,4];
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
  }

  render() {

    let {cPickerOpen, fontSize} = this.state;

    return (
        <div >
        <div style={{display:'flex'}}>
            <img style={!cPickerOpen ? {marginRight:'1vw', fontSize: "calc(8px + 0.4vw)", width:'1.5vw', height: '1.5vw',} : {display:'none'}}
              alt="cPicker" src={cPicker}
              onClick={this.openColors}/>
            <img style={!cPickerOpen ? {display:'none'} : {marginRight:'1vw', fontSize: "calc(8px + 0.4vw)", width:'1.5vw', height: '1.5vw'} }
              alt="cPickerClose" src={cPickerClose}
              onClick={this.closeColors}/>
            <div style={cPickerOpen ? {position:'fixed', zIndex:2, top: '5vh', backgroundColor:'#EEE', padding:'5px'} : {display: 'none'}}>
                <ChromePicker color={this.state.color} onChange={this.colorChange}/>
            </div>
           <input style={{width: '1.25vw', height: '1.25vw',marginRight:'1vw', fontSize:"calc(7px + 0.25vw)"}}
             value={String(fontSize*4)} onChange={this.fontSizeChange}/>
           <img style={{width:'1.25vw', height: '1.25vw', marginRight:'1vw'}}
              onClick={this.fontSizeUP}
              alt="fsUP" src={fsUP}
            />
          <img style={{width:'1.25vw', height: '1.25vw', marginRight:'1vw'}}
                onClick={this.fontSizeDOWN}
                alt="fsDOWN" src={fsDOWN}
            />
          </div>
        </div>
    )
  }

}
export default FormatEditor;
