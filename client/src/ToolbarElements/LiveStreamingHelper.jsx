import React from 'react';
import {HotKeys} from 'react-hotkeys';
import closeIcon from '../assets/closeIcon.png'
import checkOn from '../assets/checkOn.png';

const presets = {
  pastorRose: {
    heading: 'Pastor Noel Rose',
    subHeading: 'Pastor of Eliathah Seventh-day Adventist Church',
    duration: 7,
    type: 'floating'
  },
  elderHamilton: {
    heading: 'Elder Vivolin Hamilton',
    subHeading: 'Sabbath School Co-Host',
    duration: 7,
    type: 'floating'
  },
  pastorBinns: {
    heading: 'Pastor Ian Binns',
    subHeading: 'Sabbath School Host',
    duration: 7,
    type: 'floating'
  },
  callIn: {
    heading: 'Call: 408 418 9388',
    subHeading: 'Access Code: 295041786',
    duration: 20,
    type: 'stick-to-bottom'
  }
}

export default class LiveStreamingHelper extends React.Component{

	constructor (props) {
		super(props);
    const { overlayInfo: {info} } = props;
    this.initialState = {
			heading: '',
			subHeading: '',
			type: 'stick-to-bottom',
      duration: 7,
      sent: false
    }
    const infoNotEmpty = info && Object.keys(info).length !== 0;
    this.state = infoNotEmpty ? {...info} : this.initialState;
  }
  
  sendPreset = (val) => {
    const presetVal = presets[val];
    this.setState({...presetVal})
  }

  sendOverlay = () => {
    const { firebaseUpdateOverlay } = this.props;
    firebaseUpdateOverlay({ action: 'set', info: this.state, time: Date.now()});
    this.setState({sent: true});
    setTimeout(() => {
      this.setState({sent: false});
    },1000)
  }

  clearOverlay = () => {
    const { firebaseUpdateOverlay } = this.props;
    firebaseUpdateOverlay({ action: 'clear' })
    this.setState(this.initialState)
  }
  
	render() {
    const {close, database} = this.props;
    const {heading, subHeading, type, duration, sent} = this.state

    let windowBackground = {position: 'fixed',top: 0, left:0, height: '100vh', width: '100vw',
    zIndex: 5, backgroundColor: 'rgba(62, 64, 66, 0.5)'}

    let style = {position:'fixed', zIndex:6, right:'15%', top:'5%', color:'white',
      width:'65vw', height: '80vh', backgroundColor:"#383838", padding:'1%', border: '0.1vw solid white',
      borderRadius: '1vw'}

    let buttonStyle = {
      fontSize: "calc(8px + 0.6vw)", margin:'0.25%', width:'11vw', backgroundColor:'#383838',
          border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white',
    }
    
    const stickyActive = type === 'stick-to-bottom';
    const floatingActive = type === 'floating';

    const buttonActiveStyle = {
      border:'0.2vw solid yellow'
    }
    
    const previewStyle = {
      width: '24vw', height: '13.5vw', border: '2px solid black', position: 'relative', margin: '16px'
    }

    const stickyStyle = {
      width: 'calc(100% - 16px)', backgroundColor: '#486938', color: 'white', position: 'absolute', bottom: 0,
      textAlign: 'center', display: 'flex', padding: '8px', justifyContent: 'center', fontWeight: 'bold', fontSize: '85%'
    }

    const floatingStyle = {
      width: '60%', margin:'0 20% 5%', backgroundColor: '#3c6572', color: 'white', position: 'absolute', bottom: 0,
      textAlign: 'center', padding: '8px', justifyContent: 'center', fontWeight: 'bold'
    }

    const Preview = () => {
      const floating = (
        <div style={floatingStyle}>
          <div style={{marginBottom: '8px'}}>{heading}</div>
          <div style={{fontSize: '70%'}}>{subHeading}</div>
      </div>
      )
      const sticky = (
        <div style={stickyStyle}>
          <div style={{marginRight: '8px', color: 'yellow'}}>{heading}</div>
          <div>{subHeading}</div>
      </div>
      )
      return(
        <div style={previewStyle}>
          <div style={{textAlign: 'center', borderBottom: '2px solid black', padding: '8px'}}>Preview</div>
          {stickyActive ? sticky : floating}
        </div>

      )
    }
    
		return (
      <HotKeys handlers={this.handlers} style={windowBackground}>
        <div style={style}>
        <img className='imgButton' style={{display:'block', width:'1.25vw', height:'1.25vw',
              padding: '0.25vh 0.25vw', position: 'absolute', right: '1vw'}}
               alt="closeIcon" src={closeIcon}
              onClick={close}
              />
        <div style={{marginBottom: '16px', fontSize: '110%'}}>Send Overlay To Stream</div>
				<div>
					<div>
						<div>Heading:</div>
						<input style={{width: '16vw'}} type="text" value={heading} onChange={(e) => this.setState({heading: e.target.value})}/>
					</div>
					<div>
						<div>Sub Heading:</div>
						<input style={{width: '16vw'}} type="text" value={subHeading} onChange={(e) => this.setState({subHeading: e.target.value})}/>
					</div>
					<div>
						<div>Type</div>
						<button style={{...buttonStyle, ...stickyActive && buttonActiveStyle}} onClick={() => this.setState({type: 'stick-to-bottom'})} disabled={stickyActive} >Stick To Bottom</button>
						<button style={{...buttonStyle, ...floatingActive && buttonActiveStyle}} onClick={() => this.setState({type: 'floating'})} disabled={floatingActive} >Floating</button>
					</div>
					<div>
						<div>Duration</div>
						<input style={{width: '32px'}} type='number' value={duration} onChange={(e) => this.setState({duration: e.target.value})}/>
					</div>
				</div>
        <div></div>
				<Preview/>
				<div style={{display: 'flex'}}>
					<button style={buttonStyle} disabled={sent} onClick={this.sendOverlay} >Send</button>
          <img className='imgButton' style={{display:'block', width:'1.25vw', height:'1.25vw',
            padding: '0.25vh 0.25vw', visibility: sent ? 'visible' : 'hidden'}}
              alt="checkOn" src={checkOn} />
					<button style={buttonStyle} onClick={this.clearOverlay} >Clear Overlay</button>
				</div>
        <div style={{margin: '32px 0', borderTop: '2px solid black'}}>
          <div style={{padding: '16px'}}>Presets</div>
          <div style={{display: 'flex'}}>
            <button style={buttonStyle} onClick={() => this.sendPreset('pastorRose')} >Pastor Rose</button>
            <button style={buttonStyle} onClick={() => this.sendPreset('pastorBinns')} >Pastor Binns</button>
            <button style={buttonStyle} onClick={() => this.sendPreset('elderHamilton')} >Elder Hamilton</button>
            <button style={buttonStyle} onClick={() => this.sendPreset('callIn')} >Call In</button>
          </div>
        </div>
        </div>
      </HotKeys>
		);
	}

}