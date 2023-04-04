import React from 'react';
import DisplayWords from './Display_Words'
import DisplayBackground from './Display_Background'
import lock from '../assets/lock.png';
import unlock from '../assets/unlock.png';
import {Rnd} from 'react-rnd';

export default class DisplayWindow extends React.Component{

  constructor (){
    super();
    this.state = {
      width: '100%',
      height: '100%',
      x: 0,
      y: 0,
      maxHeight: '100%',
      maxWidth:'100%',
      lockBox: true,
      prevBox: {}
    }
  }

  componentDidMount(){
    window.addEventListener("resize", this.updatePosition);
    this.updatePosition();
  }

  updatePosition = () => {
    let {box, width, height} = this.props;

    let maxW = width;
    maxW = parseFloat(maxW.substring(0, maxW.length-2),10);
    maxW/=100;
    maxW*=window.innerWidth;

    let maxH = height;
    maxH = parseFloat(maxH.substring(0, maxH.length-2),10);
    maxH/=100;
    if(!this.props.presentation)
      maxH*=window.innerWidth;
    else
      maxH*=window.innerHeight;
    let x = box.x ? box.x*.01*maxW : 0;
    let y = box.y ? box.y*.01*maxH : 0;
    let box_width = box.width ? box.width*.01*maxW+'px' : maxW+ 'px';
    let box_height = box.height ? box.height*.01*maxH+'px' : maxH+'px';

    this.setState({
      maxWidth: maxW+'px',
      maxHeight: maxH+'px',
      width: box_width,
      height: box_height,
      x: x,
      y: y,
    })

  }

  componentDidUpdate(prevProps){
    if(!this.props.box || !prevProps.box)
      return;
    if(JSON.stringify(this.props.box) !== this.state.prevBox || this.props.width !== prevProps.width){
      this.updatePosition()
      this.setState({prevBox: JSON.stringify(this.props.box)})
    }
    if(this.props.index !== prevProps.index){
      this.setState({lockBox: true})
    }
  }

  onBoxDragStop = (position) => {
    let {width, height} = this.state;
    this.updateBoxPosition(position.x, position.y, width, height)
  }

  onBoxResize = (e, direction, ref, delta, position, index) => {
    this.setBoxIndex(index)
    let {x, y, width, height} = this.state;
    x = position.x;
    y = position.y;
    width = ref.style.width;
    height = ref.style.height;
    this.setState({width: width, height: height, x: x, y: y})
  }

  onBoxResizeStop = (e, direction, ref, delta, position) => {
    this.updateBoxPosition(position.x, position.y, ref.style.width, ref.style.height)
  }

  updateBoxPosition = (x, y, width, height) => {
    let {maxWidth, maxHeight} = this.state;

    let maxW = parseFloat(maxWidth.substring(0, maxWidth.length-2), 10);
    let maxH = parseFloat(maxHeight.substring(0, maxHeight.length-2), 10);

    width = parseFloat(width.substring(0, width.length-2), 10)/maxW*100;
    height = parseFloat(height.substring(0, height.length-2), 10)/maxH*100;
    x = x/maxW*100;
    y = y/maxH*100;

    this.props.handleBoxChange(x, y, width, height);
  }

  setBoxIndex = (index) => {
    if(this.props.editor)
      this.props.setBoxIndex(index)
  }

  toggleDragLock = () => {
    this.setState({lockBox: !this.state.lockBox})
  }

  render() {
    let {box, img, asset, isVideo, fsDivider, animate, title, index, id, zIndex, editor, extraPadding, presentation} = this.props;
    let {x, y, width, height, lockBox, maxWidth, maxHeight} = this.state;

    let lockStyle = {width:'1.25vw', height:'1.25vw',
      top:'-0.5vw', left:'-0.5vw', position: 'absolute', zIndex: zIndex+1}

    return (
      <div>
        {editor && <div style={{width: '100%', height: '100%', position: 'absolute'}}>
          <Rnd size={{width: width, height: height}}
            position={{x: x, y: y}}
          onDragStop={(e, position) => this.onBoxDragStop(position)}
          onResize={(e, direction, ref, delta, position) =>
            {this.onBoxResize(e, direction, ref, delta, position, index)}}
          onResizeStop={(e, direction, ref, delta, position) =>
            {this.onBoxResizeStop(e, direction, ref, delta, position)}}
          enableUserSelectHack={!lockBox} maxWidth={maxWidth} maxHeight={maxHeight}
          minWidth={'7.5%'} minHeight={'7.5%'} bounds={'parent'}
          style={editor ? {zIndex: zIndex, outline: '0.15vw solid #FFF'} :
          {zIndex: zIndex, outline: '0'}}
          disableDragging={lockBox}
          enableResizing={{ top:!lockBox, right:!lockBox, bottom:!lockBox,
            left:!lockBox, topRight:!lockBox, bottomRight:!lockBox,
            bottomLeft:!lockBox, topLeft:!lockBox }}
            onMouseDown={() => this.setBoxIndex(index)}
          >
          {(lockBox && editor) && <img style={lockStyle}
             alt="lock" src={lock}
            onClick={this.toggleDragLock}
            />}
          {(!lockBox && editor)&& <img style={lockStyle}
             alt="unlock" src={unlock}
            onClick={this.toggleDragLock}
            />}
          <DisplayWords id={id} words={box.words} fontSize={box.fontSize} index={index}
            fontColor={box.fontColor} fsDivider={fsDivider} position={box} title={title}
            editor={editor} handleTextChange={this.props.handleTextChange} animate={animate}
            zIndex={zIndex} presentation={presentation} extraPadding={extraPadding}>
          </DisplayWords>
          <DisplayBackground img={img} brightness={box.brightness} keepRatio={box.keepRatio} title={title} isVideo={isVideo}
            asset={asset} animate={animate} zIndex={zIndex} position={box} presentation={presentation}>
          </DisplayBackground>
        </Rnd>
      </div>}
      {!editor && <div style={{top: y, left: x, width: width, height: height, position: 'absolute'}}>
        <DisplayWords id={id} words={box.words} fontSize={box.fontSize} index={index}
          fontColor={box.fontColor} fsDivider={fsDivider} position={box} title={title}
          editor={editor} handleTextChange={this.props.handleTextChange} animate={animate}
          zIndex={zIndex} presentation={presentation} extraPadding={extraPadding}>
        </DisplayWords>
        <DisplayBackground img={img} brightness={box.brightness} keepRatio={box.keepRatio} title={title} isVideo={isVideo}
          asset={asset} animate={animate} zIndex={zIndex} position={box} presentation={presentation}>
        </DisplayBackground>
      </div>}
      </div>

    )
  }

}
