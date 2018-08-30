import React from 'react';
import DisplayWords from './Display_Words'
import DisplayBackground from './Display_Background'
import blank from './assets/blank.png';
import lock from './assets/lock.png';
import unlock from './assets/unlock.png';
import {Rnd} from 'react-rnd';

export default class DisplayWindow extends React.Component{

  constructor (){
    super();
    this.state = {
      boxWidth:  '100%',
      boxHeight: '100%',
      box_x: 0,
      box_y: 0,
      maxHeight: '100%',
      maxWidth:'100%',
      lockBox: true,
    }
  }

  componentDidMount(){
    window.addEventListener("resize", this.updatePosition);
    let video = document.getElementById('background-video-mini');
    if(video)
      video.loop = true;
    this.updatePosition();
  }

  updatePosition = () => {
    if(!this.props.editor)
      return;

    let maxW = this.props.width;
    maxW = parseFloat(maxW.substring(0, maxW.length-2),10);
    maxW/=100;
    maxW*=window.innerWidth;

    let maxH = this.props.height;
    maxH = parseFloat(maxH.substring(0, maxH.length-2),10);
    maxH/=100;
    maxH*=window.innerWidth;

    let box_x = 0;
    let box_y = 0;
    let boxWidth = maxW+ 'px';
    let boxHeight = maxH+'px';
    if(this.props.style.x)
      box_x = this.props.style.x*.01*maxW;
    if(this.props.style.y)
      box_y = this.props.style.y*.01*maxH;
    if(this.props.style.width)
      boxWidth = this.props.style.width*.01*maxW+'px';
    if(this.props.style.height)
      boxHeight = this.props.style.height*.01*maxH+'px';

    this.setState({
      maxWidth: maxW+'px',
      maxHeight: maxH+'px',
      boxWidth: boxWidth,
      boxHeight: boxHeight,
      box_x: box_x,
      box_y: box_y
    })

  }

  componentDidUpdate(prevProps){
    let {background, presentation} = this.props;
    if((this.props.style !== prevProps.style) || (this.props.words !== prevProps.words))
      this.updatePosition();
    if(background !== prevProps.background ){
      let video = document.getElementById('background-video-mini');
      if(video){
        video.loop = true;
        if(presentation)
          video.muted = false
      }
    }
  }

  onBoxDragStop = (position) => {
    this.setState({box_x: position.x,box_y: position.y})
    let {boxWidth, boxHeight} = this.state;
    this.updateBoxPosition(position.x, position.y, boxWidth, boxHeight)
  }

  onBoxResize = (e, direction, ref, delta, position) => {
    this.setState({
      boxWidth: ref.style.width,
      boxHeight: ref.style.height,
      box_x: position.x,
      box_y: position.y
    })
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

  toggleDragLock = () => {
    this.setState({lockBox: !this.state.lockBox})
  }

  render() {
    let {backgrounds, background, style, words, width, title,
      titleSize, presentation, extraPadding, editor} = this.props;

    let {box_x, box_y, boxWidth, boxHeight, maxWidth, maxHeight, lockBox} = this.state;

    let img = blank, asset;
    let isVideo = false;

    let height = (parseFloat(width.substring(0, width.length-2),10)*.5625)+"vw";
    if(presentation)
      height = '100vh';
    let tWidth = parseFloat(width.substring(0, width.length-2), 10);
    let fsDivider = tWidth/(42.5);

    if(title.length > 25){
      title = title.substring(0, 26);
      title+="...";
    }

    let colorCodes = {
      Verse: '#0043ff',
      Chorus: '#ff3200',
      Bridge: '#009e02',
    }

    let titleStyle = {padding:'.25vw', fontSize: titleSize, whiteSpace: 'nowrap', overflow:'hidden',
      background: '#F2F2F2', border: '.1vw solid #ccc', borderRadius: '.2vw/.4vw', textAlign: 'center',
      width: width, boxSizing:'border-box'
    }

    if(title.match(/Verse*[0-9]*/) ){
      titleStyle.background = colorCodes.Verse
      titleStyle.color = '#FFF'
    }
    if(title.match(/Bridge*[0-9]*/)){
      titleStyle.background = colorCodes.Bridge
      titleStyle.color = '#FFF'
    }
    if(title.match(/Chorus*[0-9]*/)){
      titleStyle.background = colorCodes.Chorus
      titleStyle.color = '#FFF'
    }

    let containerStyle = {width:width, height:height, position:'relative'}

    let videoStyle = {width:'100%', height:'100%', position:'absolute', zIndex:'-1'}

    let lockStyle = {width:'1.25vw', height:'1.25vw',
      top:'-0.5vw', left:'-0.5vw', position: 'absolute', zIndex: 2}

    let id = `background-text-${title}-${words}`;

    if(backgrounds.some(e => e.name === background)){
      asset = backgrounds.find(e => e.name === background);
      img = asset.image.src;
      if(asset.type === 'video' && (title === 'Presentation' || title===''))
        isVideo = true;
    }

    return (
      <div>
        {(title !== '') && <div style={titleStyle}>
            {title}
        </div>}
          <div style={containerStyle}>
            {!isVideo &&
              <DisplayBackground img={img} brightness={style.brightness} presentation={presentation}
                width={width} height={height} title={title}>
              </DisplayBackground>
            }
            {isVideo && <video muted preload="true" loop autoPlay id="background-video-mini"
              style={videoStyle}>
              <source src={asset.video.src} type="video/mp4"/>
              <source src={asset.video.src} type="video/ogg" />
            </video>}
            {editor &&
              <Rnd size={{width: boxWidth, height: boxHeight}}
              position={{x: box_x, y: box_y}}
              onDragStop={(e, position) => {this.onBoxDragStop(position) }}
              onResize={(e, direction, ref, delta, position) =>
                {this.onBoxResize(e, direction, ref, delta, position)}}
              onResizeStop={(e, direction, ref, delta, position) =>
                {this.onBoxResizeStop(e, direction, ref, delta, position)}}
              enableUserSelectHack={!lockBox} maxWidth={maxWidth} maxHeight={maxHeight}
              minWidth={'35%'} minHeight={'35%'} bounds={'parent'}
              style={{zIndex: 2, outline: '0.15vw solid #FFF'}}
              disableDragging={lockBox}
              enableResizing={{ top:!lockBox, right:!lockBox, bottom:!lockBox,
                left:!lockBox, topRight:!lockBox, bottomRight:!lockBox,
                bottomLeft:!lockBox, topLeft:!lockBox }}
              >
              {(lockBox && editor) && <img style={lockStyle}
                 alt="lock" src={lock}
                onClick={this.toggleDragLock}
                />}
              {(!lockBox && editor) && <img style={lockStyle}
                 alt="unlock" src={unlock}
                onClick={this.toggleDragLock}
                />}
              <DisplayWords id={id} words={words} fontSize={style.fontSize} presentation={presentation}
                fontColor={style.fontColor} fsDivider={fsDivider} extraPadding={extraPadding} position={style}
                title={title} editor={editor} handleTextChange={this.props.handleTextChange}>
              </DisplayWords>
            </Rnd>}
            {!editor &&
              <DisplayWords id={id} words={words} fontSize={style.fontSize} presentation={presentation}
                fontColor={style.fontColor} fsDivider={fsDivider} extraPadding={extraPadding} position={style}
                title={title} handleTextChange={this.props.handleTextChange}>
              </DisplayWords>
            }

          </div>
      </div>
    )
  }

}
