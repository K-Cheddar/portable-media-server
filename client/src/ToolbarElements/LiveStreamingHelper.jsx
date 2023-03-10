import React from 'react';
import {HotKeys} from 'react-hotkeys';
import deleteX from '../assets/deleteX.png';
import closeIcon from '../assets/closeIcon.png'
import checkOn from '../assets/checkOn.png';

export default class LiveStreamingHelper extends React.Component{

	constructor (props) {
		super(props);
    const { overlayInfo: {info} } = props;
    this.initialState = {
			heading: '',
			subHeading: '',
			type: 'stick-to-bottom',
      duration: 7,
      sent: false,
      index: -1,
      isPreset: true,
      showDelete: true,
      mouseX: 0,
      mouseY: 0,
      indexBeingDragged:-1,
      mouseDown: false,
    }
    const infoNotEmpty = info && Object.keys(info).length !== 0;
    this.state = infoNotEmpty ? {...this.initialState, ...info} : this.initialState;
  }

  updateMouse = (e) => {
    if(!this.state.mouseDown)
      return;
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  }

  insertElement = ( newIndex, oldIndex  ) => {
    const { overlayQueue } = this.props;
    const ele = overlayQueue.splice(oldIndex, 1)[0];
    overlayQueue.splice(newIndex, 0, ele);
  }

  setElement = (index) => {
    this.setState({
      mouseDown: true
    });

    console.log("INDEX", index, this.state)

    this.checkHeld = setTimeout(function() {
      let {mouseDown, indexBeingDragged } = this.state;
      if(mouseDown && indexBeingDragged === -1){
        this.setState({indexBeingDragged: index})
      }
    }.bind(this), 250);

  }

  setTarget = (index) => {
    if(!this.state.mouseDown)
      return;

    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.getFromQueue(index);
      this.insertElement(index, indexBeingDragged);
      this.setState({indexBeingDragged: index})
    }
  }

  releaseElement = () => {
    if(!this.state.mouseDown)
      return;
    const { firebaseUpdateOverlayPresets, overlayQueue } = this.props;
    firebaseUpdateOverlayPresets(overlayQueue, 'queue');
    clearTimeout(this.checkHeld)
    this.setState({
      indexBeingDragged: -1,
      mouseDown: false
    })
  }
  
  addToQueue = () => {
    const {firebaseUpdateOverlayPresets, overlayQueue} = this.props;
    const queue = [...overlayQueue];
    const newItem = {...this.state, index: queue.length};
    queue.push(newItem);
    firebaseUpdateOverlayPresets(queue, 'queue');
  }

  removeFromQueue = (index) => {
    const {firebaseUpdateOverlayPresets, overlayQueue} = this.props;
    const queue = [...overlayQueue];
    queue.splice(index, 1)
    firebaseUpdateOverlayPresets(queue, 'queue');
  }

  // removeFromPresets = (index) => {
  //   const { firebaseUpdateOverlayPresets, overlayPresets} = this.props;
  //   const presets = [...overlayPresets];
  //   presets.splice(index, 1)
  //   setOverlayQueue(queue);
  // }

  getFromQueue = (index) => {
    const { overlayQueue } = this.props;
    const queue = [...overlayQueue];
    this.setState({...queue[index], index, isPreset: false })
  }

  getFromPresets = (index) => {
    const { overlayPresets } = this.props;
    const queue = [...overlayPresets];
    this.setState({...queue[index], index, isPreset: true })
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

  updatePreset = () => {
    const { firebaseUpdateOverlayPresets, overlayPresets, overlayQueue } = this.props;
    const { isPreset, index, heading, subHeading, type, duration, showDelete } = this.state;
    console.log("STATE: ", this.state);

    if (isPreset && index >= 0) {
      overlayPresets[index] = {heading, subHeading, type, duration, showDelete };

      firebaseUpdateOverlayPresets(overlayPresets, 'preset');
    } else if (!isPreset && index >= 0) {
      overlayQueue[index] = {heading, subHeading, type, duration, showDelete };

      firebaseUpdateOverlayPresets(overlayQueue, 'queue');
    }
  }

  toggleDelete = () => {
    this.setState({showDelete: !this.state.showDelete});
    setTimeout(() => this.updatePreset(), 0 )
  }
  
	render() {
    const {close, overlayQueue = [], overlayPresets} = this.props;
    const {heading, subHeading, type, duration, sent, isPreset, 
      showDelete, indexBeingDragged, index: currentIndex, mouseX, mouseY} = this.state

    let windowBackground = {position: 'fixed',top: 0, left:0, height: '100vh', width: '100vw',
    zIndex: 5, backgroundColor: 'rgba(62, 64, 66, 0.5)'}

    let style = {position:'fixed', zIndex:6, right:'15%', top:'2%', color:'white',
      width:'67vw', height: '92vh', backgroundColor:"#383838", padding:'1%', border: '0.1vw solid white',
      borderRadius: '1vw'}

    let buttonStyle = {
      fontSize: "calc(8px + 0.6vw)", margin:'0.25%', width:'11vw', backgroundColor:'#383838',
          borderRadius:'0.5vw', color: 'white', overflow: 'hidden',
          borderWidth: '0.2vw', borderStyle: 'solid', borderColor: '#06d1d1'
    }
    
    const stickyActive = type === 'stick-to-bottom';
    const floatingActive = type === 'floating';

    const buttonActiveStyle = { borderWidth: '0.2vw', borderStyle: 'solid', borderColor: 'yellow'}
    
    const previewStyle = {
      width: '24vw', height: '13.5vw', border: '2px solid black', position: 'relative', margin: '16px 32px'
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
        <div>
          <div style={previewStyle}>
            <div style={{textAlign: 'center', borderBottom: '2px solid black', padding: '8px'}}>Preview</div>
            {stickyActive ? sticky : floating}
          </div>
          <div style={{display: 'flex', margin: '16px 32px'}}>
              <button style={buttonStyle} disabled={sent} onClick={this.sendOverlay} >Send</button>
              <img className='imgButton' style={{display:'block', width:'1.25vw', height:'1.25vw',
                padding: '0.25vh 0.25vw', visibility: sent ? 'visible' : 'hidden'}}
                  alt="checkOn" src={checkOn} />
              <button style={buttonStyle} onClick={this.clearOverlay} >Clear Overlay</button>
            </div>
        </div>
      )
    }

    const queue = overlayQueue.map(({heading, subHeading, showDelete : qShowDelete}, index) => {
      const beingDraggedStyle = { borderColor: '#ffdb3a', opacity:'0.5', position: 'fixed', 
      left: `calc(${mouseX}px - 5px)`, top: `calc(${mouseY}px - 5px)` };
      const selectedStyle = { borderColor: '#06d117' };
      return (
        <div style={{display: 'flex', margin: '8px', width: '12vw'}} key={heading+index}>
          <button 
            style={{...buttonStyle, height: '3vw',
            ...(currentIndex === index && !isPreset && {...selectedStyle}),
            ...(indexBeingDragged === index && {...beingDraggedStyle})}}
            onClick={() => this.getFromQueue(index)} 
            onMouseDown={() => this.setElement(index)}
            onMouseOver={() => this.setTarget(index)}
          >
                <div>
                 {heading || subHeading}
                </div>
                <div style={{fontSize: "calc(4px + 0.4vw)" }}>{!!heading && subHeading}</div>
            </button>
          {qShowDelete && <img className='imgButton' style={{marginTop:'12px', width:'1.5vw', height:'1.5vw'}}
          onClick={ () => this.removeFromQueue(index)}
          alt="delete" src={deleteX}/> }
        </div>
      )
    })

    const presets = overlayPresets.map(({heading, subHeading}, index) => {
      const selectedStyle = { borderColor: '#06d117' };
      return (
        <div style={{display: 'flex'}} key={heading+index}>
          <button style={{...buttonStyle, margin: '8px', height: '3vw',
           ...(currentIndex === index && isPreset && {...selectedStyle})}} 
           onClick={() => this.getFromPresets(index)} >{heading || subHeading}</button>
          {/* <img className='imgButton' style={{margin:'0.5vw', width:'1.5vw', height:'1.5vw', visibility: 'hidden'}}
          onClick={ () => this.removeFromPresets(index)}
          alt="delete" src={deleteX}/> */}
        </div>
      )
    })
    
		return (
      <HotKeys handlers={this.handlers} style={windowBackground}>
        <div style={style} onMouseUp={this.releaseElement} onMouseMove={this.updateMouse}>
          <div>
          <img className='imgButton' style={{display:'block', width:'1.25vw', height:'1.25vw',
                padding: '0.25vh 0.25vw', position: 'absolute', right: '1vw'}}
                alt="closeIcon" src={closeIcon}
                onClick={close}
                />
          <div style={{marginBottom: '16px', fontSize: '110%'}}>Send Overlay To Stream</div>
          <div style={{display: 'flex'}}>
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
            <div style={{display: 'flex', marginTop: '32px'}}>
              <button style={{...buttonStyle}} disabled={sent} onClick={this.addToQueue} >Add to Queue</button>
              <button style={{...buttonStyle, marginLeft: '16px' }} onClick={this.updatePreset} >Save</button>
            </div>
            <button style={{...buttonStyle, marginTop: '16px'}}  onClick={this.toggleDelete} >{showDelete ? 'Hide Delete' : 'Show Delete'}</button>
            </div>
            <div>
             <Preview/>
            </div>

          </div>
          <div style={{margin: '8px 0', borderTop: '2px solid black'}}>
            <div style={{padding: '8px'}}>Presets</div>
            <div style={{display: 'flex', flexWrap:'wrap', overflow:'auto'}}>{presets}</div>
          </div>
          </div>
          <div style={{borderTop: '2px solid black'}}>
          <div style={{padding: '8px'}}>Queue</div>
          <div style={{display: 'flex', marginTop: '8px', flexWrap:'wrap', overflow:'auto', height: '16vw', position: 'relative'}}>{queue}</div>
          
        </div>
        </div>
      </HotKeys>
		);
	}

}