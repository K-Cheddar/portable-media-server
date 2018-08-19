import React from 'react';
import blank from './assets/blank.png';
// import AnimateOnChange from 'react-animate-on-change'
// import FadeProps from 'fade-props';

export default class DisplayWindow extends React.Component{

  componentDidMount(){
    let video = document.getElementById('background-video-mini');
    if(video)
      video.loop = true;
  }

  componentDidUpdate(prevProps){
    let {background} = this.props;
        // console.log("counter");

    if(background !== prevProps.background ){
      let video = document.getElementById('background-video-mini');
      if(video)
        video.loop = true;
    }
    let box = document.getElementById(`background-text-${this.props.title}-${this.props.words}`);

    if(box){
      let text = box.innerHTML;
      let newText = "";
      for (let i = 0; i < text.length; ++i){
        if(text[i-1] === '{' && text[i+1] === '}'){
          newText += text.charAt(i).fontcolor("#C462FF")
          i+=1;
        }
        else if(text[i-1] === '{' && text[i+2] === '}'){
          newText += text.charAt(i).fontcolor("#C462FF")
          newText += text.charAt(i+1).fontcolor("#C462FF")
          i+=2;
        }
        else if(text[i-1] === '{' && text[i+3] === '}'){
          newText += text.charAt(i).fontcolor("#C462FF")
          newText += text.charAt(i+1).fontcolor("#C462FF")
          newText += text.charAt(i+2).fontcolor("#C462FF")
          i+=3;
        }
        else if(text[i]!== '{'){
          newText+=text[i]
        }
      }
      box.innerHTML = newText;
    }



  }

  render() {

    let {backgrounds, background, style, words, width, title,
      titleSize, presentation, extraPadding} = this.props;

    let img = blank, asset;
    let isVideo = false;

    let height = (parseFloat(width.substring(0, width.length-2),10)*.5625)+"vw"
    if(presentation)
      height = '100vh'
    let tWidth = parseFloat(width.substring(0, width.length-2), 10)
    let fsDivider = tWidth/(42)

    let fontSize = style.fontSize*fsDivider + "vw";
    let color = style.fontColor
    let fs = style.fontSize*fsDivider/40
    if(!presentation){
      fs = style.fontSize*fsDivider/140
    }
    let strokeRadius = `calc(${fs*0.5}vw)`
    let strokeColor = "#000"

    if(title.length > 25){
      title = title.substring(0, 26)
      title+="..."
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


    if(backgrounds.some(e => e.name === background)){
      asset = backgrounds.find(e => e.name === background);
      img = asset.image.src;
      if(asset.type === 'video')
        isVideo = true;
    }

    let pictureContainerStyle = {width: width, height: height, position: 'relative'}

    let level = "100%";
    if(style.brightness)
      level = style.brightness+"%"

    let backgroundPictureStyle= { position:'absolute', zIndex:1, backgroundImage: 'url('+img+')',
      backgroundSize: '100% 100%', filter: `brightness(${level})`,
      width: width, height: height, maxHeight:'80vw',}

    let SS = `${fs*2}vw`
    if(!presentation){
      SS = `${fs*12}vw`
    }

    let wordsStyle = {
      textAlign: 'center', background: 'transparent', border: 0, resize:'none',
      whiteSpace:'pre-wrap', color: color, fontSize: fontSize, fontFamily: "Verdana",
      padding: extraPadding ? "12.5% 5%" : "5%", textShadow: `${SS} ${SS} ${SS} black, ${SS} ${SS} ${SS} black`,
      width: '90%', height:'85%', position: 'absolute', zIndex: 2,
      WebkitTextStroke: `${strokeRadius} ${strokeColor}`
    }

    let videoContainerStyle = {width:width, height:height, position:'relative'}

    let videoStyle = {width:'100%', height:'100%', position:'absolute', zIndex:'-1'}

    let id = `background-text-${title}-${words}`
    // console.log("counter");
    return (
      <div className='displayWindow'>
        {(title !== '') && <div style={titleStyle}>
            {title}
        </div>}
        {!isVideo && <div style={pictureContainerStyle}>
          <div style={backgroundPictureStyle}></div>
          <div id={id} style={wordsStyle}>{words}</div>
        </div>}
        {isVideo &&<div style={videoContainerStyle}>
          <video muted preload="true" loop autoPlay id="background-video-mini"
            style={videoStyle}>
            <source src={asset.video.src} type="video/mp4"/>
            <source src={asset.video.src} type="video/ogg" />
          </video>
          <div style={wordsStyle}>{words}</div>
        </div>}
      </div>
    )
  }

}
