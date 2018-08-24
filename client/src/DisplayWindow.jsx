import React from 'react';
import DisplayWords from './Display_Words'
import DisplayBackground from './Display_Background'
import blank from './assets/blank.png';

export default class DisplayWindow extends React.Component{

  componentDidMount(){
    let video = document.getElementById('background-video-mini');
    if(video)
      video.loop = true;
  }

  componentDidUpdate(prevProps){
    let {background} = this.props;

    if(background !== prevProps.background ){
      let video = document.getElementById('background-video-mini');
      if(video){
        video.loop = true;
        if(this.props.title === '')
          video.muted = false
      }
    }

  }

  render() {
    let {backgrounds, background, style, words, width, title,
      titleSize, presentation, extraPadding} = this.props;

    let img = blank, asset;
    let isVideo = false;

    let height = (parseFloat(width.substring(0, width.length-2),10)*.5625)+"vw";
    if(presentation)
      height = '100vh';
    let tWidth = parseFloat(width.substring(0, width.length-2), 10);
    let fsDivider = tWidth/(43);

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

    let id = `background-text-${title}-${words}`;

    if(backgrounds.some(e => e.name === background)){
      asset = backgrounds.find(e => e.name === background);
      img = asset.image.src;
      if(asset.type === 'video' && (title === 'Presentation' || presentation))
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
            <DisplayWords id={id} words={words} fontSize={style.fontSize} presentation={presentation}
              fontColor={style.fontColor} fsDivider={fsDivider} extraPadding={extraPadding}
              title={title}>
            </DisplayWords>
          </div>
      </div>
    )
  }

}
