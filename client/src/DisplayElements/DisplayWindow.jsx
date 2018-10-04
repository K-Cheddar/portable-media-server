import React from 'react';
import DisplayWords from './Display_Words';
import DisplayBackground from './Display_Background';
import DisplayBox from './DisplayBox';
import blank from '../assets/blank.png';
import lock from '../assets/lock.png';
import unlock from '../assets/unlock.png';
import {Rnd} from 'react-rnd';

export default class DisplayWindow extends React.Component{

  constructor (){
    super();
    this.state = {
      prevSlide: {},
    }
  }

  render() {
    let {backgrounds, slide, width, title, titleSize, presentation, extraPadding, editor, zIndex} = this.props;

    let img = blank, asset;
    let isVideo = false;

    if(!slide){
      slide = {boxes: [{words: '', background: '', style: {}}]}
    }

    let colorCodes = {
      Verse: '#0043ff',
      Chorus: '#ff3200',
      Bridge: '#009e02',
    }

    let titleStyle = {padding:'.25vw', fontSize: titleSize, whiteSpace: 'nowrap', overflow:'hidden',
      background: '#F2F2F2', border: '.1vw solid #ccc', borderRadius: '.2vw/.4vw', textAlign: 'center',
      width: width, boxSizing:'border-box', color: 'black'
    }

    if(title.match(/Verse\s?\d*$/) ){
      titleStyle.background = colorCodes.Verse
      titleStyle.color = '#FFF'
    }
    if(title.match(/Bridge\s?\d*$/)){
      titleStyle.background = colorCodes.Bridge
      titleStyle.color = '#FFF'
    }
    if(title.match(/Chorus\s?\d*$/)){
      titleStyle.background = colorCodes.Chorus
      titleStyle.color = '#FFF'
    }

    if(title.length > 25){
      title = title.substring(0, 26);
      title+="...";
    }

    let height = (parseFloat(width.substring(0, width.length-2),10)*.5625)+"vw";
    if(presentation)
      height = '100vh';
    let tWidth = parseFloat(width.substring(0, width.length-2), 10);
    let fsDivider = tWidth/(42.5);

    let containerStyle = {width:width, height:height, position:'relative'};

    let boxes = slide.boxes.map((box, index) => {
      let zIndex = index
      let background = box.background;
      let words = box.words;
      let style = box;
      let id = `background-text-${title}-${words}`;
      if(backgrounds.some(e => e.name === background)){
        asset = backgrounds.find(e => e.name === background);
        img = asset.image.src;
        if(asset.type === 'video' && (title === 'Presentation' || presentation || editor))
          isVideo = true;
      }
      let animate = presentation || title === 'Presentation' || editor || title === 'Presentation ';
      return(
        <div style={{zIndeX: zIndex}} key={index}>
          {editor &&
            <DisplayBox box={box} handleTextChange={this.props.handleTextChange} animate={animate}
              index={index} handleBoxChange={this.props.handleBoxChange} id={id} title={title} isVideo={isVideo}
               asset={asset} img={img} setBoxIndex={this.props.setBoxIndex} fsDivider={fsDivider} width={width}
               height={height} zIndex={zIndex} index={index}/>}
          {!editor && <div>
            <DisplayWords id={id} words={words} fontSize={style.fontSize} presentation={presentation}
              fontColor={style.fontColor} fsDivider={fsDivider} extraPadding={extraPadding} position={style}
              title={title} animate={animate}>
            </DisplayWords>
            <DisplayBackground img={img} brightness={style.brightness} presentation={presentation}
              position={style} title={title} isVideo={isVideo} asset={asset} animate={animate}>
            </DisplayBackground>
            </div>
          }
        </div>
      )
    })


    return (
      <div>
        {(title !== '') && <div style={titleStyle}>
            {title}
        </div>}
          <div style={containerStyle}>
            {boxes}
          </div>
      </div>
    )
  }

}
