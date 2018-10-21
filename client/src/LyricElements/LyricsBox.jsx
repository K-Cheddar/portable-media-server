import React, {Component} from 'react';
import {HotKeys} from 'react-hotkeys';

import * as Sort from '../HelperFunctions/Sort';

import SongArrangements from './SongArrangements';
import SongSectionsArea from './SongSectionsArea';
import SongOrderArea from './SongOrderArea';

export default class LyricsBox extends Component{

  constructor(){
    super();
    this.state = {
      text: "",
      arrangements: [],
      formattedLyrics: [],
      selectedArrangement: 0,
      songOrder: [],
      songIndex: 0,
      sectionsPresent:[],
      sectionIndex: -1,
    }

    this.checkHeld = null;
    this.handlers = {
      'undo': (e) => {},
      'redo': (e) => {},
    }
  }

  componentDidMount(){
    let {item} = this.props;
    let sectionsPresent = [];
    let formattedLyrics = item.arrangements[item.selectedArrangement].formattedLyrics
    let songOrder = item.arrangements[item.selectedArrangement].songOrder
    for (var i = 0; i < formattedLyrics.length; i++) {
      sectionsPresent.push(formattedLyrics[i].name);
    }
    this.setState({
      arrangements: JSON.parse(JSON.stringify(item.arrangements)),
      selectedArrangement: item.selectedArrangement,
      formattedLyrics: JSON.parse(JSON.stringify(formattedLyrics)),
      songOrder: JSON.parse(JSON.stringify(songOrder)),
      sectionsPresent: sectionsPresent,
      newType: formattedLyrics[0] ? formattedLyrics[0].name : "Verse",
      songIndex: songOrder.length - 1,
    })
  }

  autoFormatLyrics = () => {
    let {songOrder, arrangements, selectedArrangement, formattedLyrics} = this.state;
    let {item, boxIndex} = this.props;
    arrangements[selectedArrangement].formattedLyrics = formattedLyrics;
    arrangements[selectedArrangement].songOrder = songOrder;
    item.arrangements = arrangements;
    item.selectedArrangement = selectedArrangement;
    this.props.updateItem(item);
    this.props.setWordIndex(0)
    //why is this here;
    // this.props.setSlideBackground(arrangements[selectedArrangement].slides[0].boxes[boxIndex].background)
    this.props.close();
  }

  createSections(lyrics){
    let {formattedLyrics, songOrder} = this.state;
    let lines = lyrics.split("\n\n");
    for(let i = 0; i < lines.length; ++i){
      let name = "Verse "+ formattedLyrics.length + 1;
      let index = formattedLyrics.findIndex(e => e.words === lines[i]);
      if(index === -1){
        formattedLyrics.push({
          type: "Verse",
          name: name,
          words: lines[i]
        })
        songOrder.push(name)
      }
      else
        songOrder.push(formattedLyrics[index].name)
    }

    this.updateSections({formattedLyrics: formattedLyrics})

  }

  deleteSectionFromOrder = (index) => {
    let {songOrder} = this.state;
    songOrder.splice(index, 1);
    this.setState({songOrder: songOrder})
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

  selectArrangement = (index) => {
    let {formattedLyrics, selectedArrangement, arrangements, songOrder} = this.state;
    if(arrangements[selectedArrangement]){
      arrangements[selectedArrangement].formattedLyrics = formattedLyrics;
      arrangements[selectedArrangement].songOrder = songOrder;
      this.setState({arrangements: arrangements})
    }
    this.setState({selectedArrangement: index})
    this.updateSections({
      formattedLyrics: arrangements[index].formattedLyrics,
      songOrder: arrangements[index].songOrder,
      songIndex: arrangements[index].songOrder.length - 1,
    });
  }

  setSectionIndex = (index) => {
    let newType = this.state.formattedLyrics[index].name;
    this.setState({sectionIndex: index, newType: newType})
  }

  submitText = () => {
    if(this.state.text.length > 0)
      this.createSections(this.state.text);
    this.setState({text: ""})
  }

  updateArrangements = (arrangements) => {
    this.setState({arrangements: arrangements})
  }

  updateFormattedLyrics = (formattedLyrics) => {
    this.setState({formattedLyrics: formattedLyrics})
  }

  updateSections = (params) => {
    let {formattedLyrics, index, songOrder} = params;
    if(formattedLyrics.length === 0)
      return;

    let sections = [];
    let sectionUpdates = {};
    if(!songOrder)
      songOrder = this.state.songOrder;
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

  updateSongOrder = (songOrder) => {
    this.setState({songOrder: songOrder})
  }

  updateSongIndex = (songIndex) => {
    this.setState({songIndex: songIndex})
  }

  updateNewType = (newType) => {
    this.setState({newType: newType});
  }

  render(){
    let {formattedLyrics, sectionIndex, songOrder, newType, sectionsPresent,
      songIndex, arrangements, selectedArrangement} = this.state;

    let buttonStyle = {fontSize: "calc(8px + 0.4vw)", margin:"1vw", backgroundColor:'#383838',
       border:'0.2vw solid #06d1d1', borderRadius:'0.5vw', color: 'white', padding:'0.5vw'}

    let windowBackground = {position: 'fixed',top: 0, left:0, height: '100vh', width: '100vw',
       zIndex: 5, backgroundColor: 'rgba(62, 64, 66, 0.5)'}
    return(
      <HotKeys handlers={this.handlers} style={windowBackground}>
        <div style={{position:'fixed', zIndex:6, right:'1%', top:'1%', color:'white',
          width:'95vw', height: '93vh', backgroundColor:"#383838", padding:'1%',
          border: '0.1vw solid white', borderRadius: '1vw'}}>
          <div style={{display:'flex'}}>
              <div>
                <div style={{marginRight: '0.25vw'}}>
                  <div style={{textAlign: 'center', fontSize: "calc(10px + 0.65vmax)",
                  marginBottom: '0.65vh'}}>Paste Lyrics Here</div>
                  <textarea style={{width:'20vw', height:'50vh', whiteSpace:'pre-wrap', resize:'none'}}
                  value={this.state.text} onChange={(e) => (this.setState({text: e.target.value}))}/>
                <div>
                  <button style={{...buttonStyle, margin:'0.25vw'}} onClick={this.submitText}>Create Sections</button>
                </div>
                </div>
                <SongArrangements arrangements={arrangements} selectArrangement={this.selectArrangement}
                  updateArrangements={this.updateArrangements} selectedArrangement={selectedArrangement}/>
              </div>
              <SongSectionsArea formattedLyrics={formattedLyrics} updateSections={this.updateSections}
                name={arrangements[selectedArrangement] ? arrangements[selectedArrangement].name : ''}
                deleteSectionFromOrder={this.deleteSectionFromOrder} sectionIndex={sectionIndex}
                setSectionIndex={this.setSectionIndex} sectionsPresent={sectionsPresent}
                updateFormattedLyrics={this.updateFormattedLyrics} songOrder={songOrder}/>
              <div>
                <SongOrderArea songOrder={songOrder} songIndex={songIndex} sectionsPresent={sectionsPresent}
                  deleteSectionFromOrder={this.deleteSectionFromOrder} updateSongIndex={this.updateSongIndex}
                  updateSongOrder={this.updateSongOrder} updateNewType={this.updateNewType} newType={newType}
                  insertSongIntoOrder={this.insertSongIntoOrder}/>
                <div style={{display: 'flex'}}>
                    <button style={buttonStyle} onClick={this.props.close}>Cancel</button>
                    <button style={buttonStyle} onClick={this.autoFormatLyrics}> Submit Changes </button>
                </div>
              </div>
          </div>
        </div>
      </HotKeys>
    )
  }

}
