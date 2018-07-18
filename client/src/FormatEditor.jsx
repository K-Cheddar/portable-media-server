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
    }
    this.colorChange = this.colorChange.bind(this);
    this.openColors = this.openColors.bind(this);
    this.closeColors = this.closeColors.bind(this);
    this.fontSizeUP = this.fontSizeUP.bind(this);
    this.fontSizeDOWN = this.fontSizeDOWN.bind(this);
    this.fontSizeChange = this.fontSizeChange.bind(this);
    this.updateFont = this.updateFont.bind(this);
  }
  componentDidMount(){
    let {item, wordIndex} = this.props;
    if(wordIndex === 0)
    this.setState({fontSize: item.nameSize})
    else
    this.setState({fontSize: item.style.fontSize})
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
    let {item} = this.props;
    this.setState({color: event.rgb})
    if(item.style)
      this.props.updateFormat({c: event.rgb})
  }

  updateFont(fontSize){
    let {wordIndex, item} = this.props;
    if(item.style){
      if(wordIndex === 0)
        this.props.updateFormat({nameSize: fontSize})
      else
        this.props.updateFormat({fontSize: fontSize})
    }
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
    if(event.target.value.length === 0)
      val = 0;
    else{
      val = parseInt(event.target.value, 10);
      val/=4;
    }

    this.setState({fontSize: val})
    this.updateFont(val)
  }

  componentDidUpdate(prevProps, prevState){

    let{item, wordIndex} = this.props;
    let {fontSize} = this.state;

    if(item.style){
      if(wordIndex === 0){
        if(item.nameSize !== fontSize)
          this.setState({fontSize: item.nameSize})
      }
      else{
        if(item.style.fontSize !== fontSize)
          this.setState({fontSize: item.style.fontSize})
      }
      if(prevProps.item._id !== item._id){
        let stringToRGB = item.style.color.replace(/[^\d,]/g, '').split(',');
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

    let {item} = this.props;
    let {cPickerOpen, fontSize} = this.state;

    if(!item.style)
      fontSize = 5;


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
