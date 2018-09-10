import React, {Component} from 'react';
import deleteX from './assets/deleteX.png';
import SongSection from './SongSection';
import * as Sort from './Sort';
// import zoomIn from './assets/zoomIn.png'
// import zoomOut from './assets/zoomOut.png'

export default class LyricsBox extends Component{

  constructor(){
    super();
    this.state = {
      text: "",
      formattedLyrics: [],
      sectionIndex: -1,
      sectionTypes:[
        "Verse",
        "Chorus",
        "Bridge",
        "Intro",
        "Ending",
        "Pre-Chorus",
        "Reprise",
        "Reading",
        "Interlude",
        "Pre-Bridge"
      ],
      sectionsPresent:[],
      songOrder: [],
      newType: "Verse",
      mouseX: 0,
      mouseY: 0,
      indexBeingDragged:-1,
      mouseDown: false,
      songIndex: 0,
      numSongSections: 4
    }

    this.checkHeld = null;

  }

  componentDidMount(){
    let {item} = this.props;
    let sectionsPresent = [];
    for (var i = 0; i < item.formattedLyrics.length; i++) {
      sectionsPresent.push(item.formattedLyrics[i].name);
    }
    this.setState({
      formattedLyrics: item.formattedLyrics.slice(),
      songOrder: item.songOrder.slice(),
      sectionsPresent: sectionsPresent,
      newType: item.formattedLyrics[0] ? item.formattedLyrics[0].name : "Verse",
      songIndex: item.songOrder.length - 1
    })
  }

  updateMouse = (e) => {
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY
    })
  }

  setElement = (index) => {

    this.setState({songIndex: index})

    this.setState({
      mouseDown: true
    })

    this.checkHeld = setTimeout(function() {
      let {mouseDown} = this.state;
      if(mouseDown){
        this.setState({indexBeingDragged: index})
      }

    }.bind(this), 350);

  }

  setTarget = (index) => {
    let {indexBeingDragged} = this.state;
    if((indexBeingDragged !== -1) && (indexBeingDragged !== index)){
      this.insertSongIntoOrder(index);
      this.setState({indexBeingDragged: index})
    }
  }

  releaseElement = () => {
    clearTimeout(this.checkHeld)
    this.setState({
      indexBeingDragged: -1,
      mouseDown: false
    })

  }

  setSectionIndex = (index) => {
    this.setState({sectionIndex: index})
  }

  createSections(lyrics){
    let {formattedLyrics} = this.state;
    let lines = lyrics.split("\n\n");
    for(let i = 0; i < lines.length; ++i){
      formattedLyrics.push({
        type: "Verse",
        name: "Verse",
        words: lines[i]
      })
    }

    this.updateSections(formattedLyrics)

  }

  autoFormatLyrics = () => {
    let {songOrder, formattedLyrics} = this.state;
    let {item} = this.props;

    item.songOrder = songOrder;
    item.formattedLyrics = formattedLyrics;
    item = this.props.formatSong(item);
    this.props.updateItem(item);
    this.props.close();
  }

  newSection = () => {
    let {formattedLyrics} = this.state;
    formattedLyrics.push({
      type: "Verse",
      name: "Verse",
      words: ""
    })
    this.updateSections(formattedLyrics)
  }

  addSection = () => {
    let {songOrder, newType, songIndex} = this.state;
    songOrder.splice(songIndex+1, 0, newType)
    this.setState({songOrder: songOrder, songIndex: songIndex+1})
  }

  updateSections = (formattedLyrics, index) => {
    let sections = [];
    let sectionUpdates = {};
    let {songOrder} = this.state;
    let sectionCounter = {};

    for(let i = 0; i < formattedLyrics.length; ++i){
      if(formattedLyrics[i].type in sectionCounter){
        sectionCounter[formattedLyrics[i].type]++;
        sectionCounter[formattedLyrics[i].type+'_counter']++;
      }
      else{
        sectionCounter[formattedLyrics[i].type] = 1;
        sectionCounter[formattedLyrics[i].type+'_counter'] = 0;
      }
    }

    for (let t = 0; t < formattedLyrics.length; ++t){
      let type = formattedLyrics[t].type;
      let max = sectionCounter[formattedLyrics[t].type];
      let counter = sectionCounter[formattedLyrics[t].type+'_counter'];
      let name;
      if(max === 1)
        name = type;
      else{
        name = type + ' ' + (max-counter);
        sectionCounter[formattedLyrics[t].type+'_counter']--;
      }
      let changed = formattedLyrics[t].name !== name;
      sectionUpdates[formattedLyrics[t].name] = {newName: name, changed: changed}
      formattedLyrics[t].name = name;
      sections.push(name);
    }

    for (let i = 0; i < songOrder.length; ++i){
      let section = songOrder[i];
      if(sectionUpdates[section] && sectionUpdates[section].changed)
        songOrder[i] = sectionUpdates[section].newName
    }

    if(songOrder.length === 0){
      songOrder = sections;
    }

    let oldName = formattedLyrics[index] ? formattedLyrics[index].name : formattedLyrics[formattedLyrics.length-1].name;

    Sort.sortNamesInList(formattedLyrics)
    Sort.sortList(sections);

    let newIndex = formattedLyrics.findIndex(e => e.name === oldName);

    this.setState({
      formattedLyrics: formattedLyrics,
      sectionsPresent: sections,
      songOrder: songOrder,
      newType: sections[0]
    })
    let that = this;
    setTimeout(function(){
      if(!formattedLyrics[newIndex])
        return;
      that.setState({sectionIndex: newIndex })
      let id = formattedLyrics[newIndex].name
      document.getElementById(id).focus();
    },100)

  }

  deleteSectionFromOrder = (index) => {
    let {songOrder} = this.state;
    songOrder.splice(index, 1);
    this.setState({songOrder: songOrder})
  }

  deleteSection = (index) => {
    let {formattedLyrics, sectionsPresent, songOrder} = this.state;

    for (var i = 0; i < songOrder.length; i++) {
      if(formattedLyrics[index].name === songOrder[i]){
        this.deleteSectionFromOrder(i);
      }
    }

    formattedLyrics.splice(index, 1);
    sectionsPresent.splice(index, 1);
    this.updateSections(formattedLyrics)
  }

  changeSectionText = (e) => {
    let {formattedLyrics, sectionIndex} = this.state;
    formattedLyrics[sectionIndex].words = e.target.value;
    this.setState({formattedLyrics: formattedLyrics});
  }

  changeSectionType = (e) => {
    let {formattedLyrics, sectionIndex} = this.state;
    let name = e.target.value;
    let type = name.replace(/\s\d+$/, "");
    formattedLyrics[sectionIndex].type = type;
    let element = formattedLyrics[sectionIndex];
    let index = formattedLyrics.findIndex(e => e.name === name);
    if(element.type === type && index > sectionIndex)
      index--;
    if(name === type)
      index = formattedLyrics.length-1;
    formattedLyrics.splice(sectionIndex, 1);
    formattedLyrics.splice(index, 0, element);
    this.updateSections(formattedLyrics, index);
  }

  changeNewType = (e) => {
    let newType = e.target.value;
    this.setState({newType: newType});
  }

  insertSongIntoOrder = (targetIndex) => {
    let {songOrder, songIndex} = this.state;
    let song = songOrder[songIndex];
    songOrder.splice(songIndex, 1);
    songOrder.splice(targetIndex, 0, song);

    this.setState({
      songOrder: songOrder,
      songIndex: targetIndex
    })
  }

  submitText = () => {
    if(this.state.text.length > 0)
      this.createSections(this.state.text);
    this.setState({text: ""})
  }

  textChange = (event) => {
    this.setState({text: event.target.value})
  }

  increaseRows = () => {
    let {numSongSections} = this.state;
    if(numSongSections < 6)
      this.setState({numSongSections: numSongSections+1})
  }

  decreaseRows = () => {
    let {numSongSections} = this.state;
    if(numSongSections > 2)
      this.setState({numSongSections: numSongSections-1})
  }

  render(){
    let {formattedLyrics, sectionIndex, sectionTypes, songOrder, newType,
       sectionsPresent, mouseX, mouseY, indexBeingDragged, songIndex, numSongSections} = this.state;
      let that = this;
    let fullArray = [];
    let row = [];

    for(var i = 0; i < formattedLyrics.length; i+=numSongSections){
      for(var j = i; j < i+numSongSections; ++j){
        if(formattedLyrics[j])
          row.push(formattedLyrics[j]);
      }

      fullArray.push(row);
      row = [];
    }

    let list = fullArray.map((element, index) => {
      let row = element.map(function (item, i){
        return(
          <div style={{width:`${0.95/numSongSections*100}%`}} key={index*numSongSections+i}>
            <SongSection item={item} setSectionIndex={that.setSectionIndex} changeSectionType={that.changeSectionType}
              sectionTypes={sectionTypes} changeSectionText={that.changeSectionText} deleteSection={that.deleteSection}
              i={i} index={index} sectionIndex={sectionIndex} sectionsPresent={sectionsPresent}
              numSongSections={numSongSections}
              />
          </div>
        );
      })
      return (
        <div style={{display:'flex', paddingBottom:'1vmax', height:`${1.3/numSongSections*100}%`}} key={index}> {row}</div>
      );
    })

    let style;
    let songStyle = {width: "10vw", border:'0.1vmax', borderColor: '#b7b7b7', borderStyle:'solid',
        textAlign: 'center'}
    let songDraggedStyle = {width: "10vw", position:'fixed', left:(mouseX +2) + 'px',
        top: (mouseY + 2) + 'px', border:'0.1vmax', borderColor: '#b7b7b7', borderStyle:'solid',
        textAlign: 'center'};

    let buttonStyle = {fontSize: "calc(8px + 0.4vw)", margin:"1vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.5vw'}

    let songOrderDiv = {display:'flex', padding:'1vmax', userSelect:'none'};
    let songOrderSelected = Object.assign({}, songOrderDiv);
    songOrderSelected.borderBottom = '0.5vh solid #06d1d1';

    let SO = songOrder.map((element, index) => {

      let beingDragged = (indexBeingDragged === index)
      if(beingDragged){
        style = songDraggedStyle;
      }
      if(!beingDragged){
        style = songStyle
      }
      return(
        <div style={(index === songIndex) ? songOrderSelected : songOrderDiv} key={index}>
          <div style={style}
            onMouseDown={() => (this.setElement(index))}
            onMouseOver={() => (this.setTarget(index))}>
            {element}
          </div>
          {beingDragged && <div style={songStyle}></div>}
          <img style={{display:'block', width:'1.5vmax', height:'1.5vmax', paddingLeft:"2%"}}
             onClick={() => (this.deleteSectionFromOrder(index))}
             alt="delete" src={deleteX}
            />
        </div>
      )
    })
    return(
      <div style={{position:'fixed', top:0, left:0, height:'100vh',
        zIndex: 4, backgroundColor:'rgba(62, 64, 66, 0.5)', width:'100vw'}}>
        <div style={{position:'fixed', zIndex:5, right:'1%', top:'1%', color:'white',
          width:'95vw', height: '95vh', backgroundColor:"#383838", padding:'1%'}}>
          <div style={{display:'flex'}}>
              <div>
                <textarea style={{width:'20vw', height:'85vh', whiteSpace:'pre-wrap', resize:'none'}}
                value={this.state.text} onChange={this.textChange}/>
              <button style={buttonStyle} onClick={this.submitText}>Create Sections</button>
              </div>
              <div >
                <div style={{paddingLeft:'1vmax', overflowX: 'hidden', height: "85vh", width:"56vw"}}>
                  {list}
                </div>
                <div style={{display: 'flex'}}>
                  <button style={buttonStyle}
                    onClick={this.newSection}>
                    New Section
                  </button>
{/*                  <img style={{display:'block', width:'2vw', height:'2vw', margin:'1vw'}}
                      onClick={this.decreaseRows}
                      alt="zoomIn" src={zoomIn}
                     />
                  <img style={{display:'block', width:'2vw', height:'2vw', margin:'1vw'}}
                       onClick={this.increaseRows}
                       alt="zoomOut" src={zoomOut}
                      />*/}
                </div>
              </div>
              <div >
                <div style={{paddingLeft:'1vmax', overflowX: 'hidden', height: "80vh", width:"17vw"}}>
                  <div style={{fontSize: "calc(10px + 0.5vmax)"}}>Song Order</div>
                  <div style={{fontSize: "calc(8px + 0.4vmax)"}}
                    onMouseMove={this.updateMouse} onMouseUp={this.releaseElement}
                    onMouseLeave={this.releaseElement}>{SO}</div>
                </div>
                <div style={{display:'flex', height: '8vh'}}>
                  <select style={{...buttonStyle, padding:'0.25vw'}}
                    value={newType} onChange={(e) => (this.changeNewType(e))}>
                    {sectionsPresent.map((element, index) =>
                      <option key={index}> {element} </option>
                    )}
                  </select>
                  <button style={{...buttonStyle, padding:'0.25vw'}}
                    onClick={this.addSection}>
                    Add Section
                  </button>
                </div>
              </div>
          </div>
          <div style={{position:"absolute", display: 'flex', right:"0", bottom:"0"}}>
              <button style={buttonStyle}
                onClick={this.props.close}>
                Cancel
              </button>
              <button style={buttonStyle}
                onClick={this.autoFormatLyrics}>
                Submit Changes
              </button>
          </div>

        </div>
      </div>
    )
  }

}
