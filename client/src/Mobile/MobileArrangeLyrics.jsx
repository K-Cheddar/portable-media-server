import React from 'react';
import MobileSongSection from './MobileSongSection'
import * as Sort from '../Sort'

import deleteX from '../assets/deleteX.png';
import downArrow from '../assets/down-arrow.png';
import upArrow from '../assets/up-arrow.png';

export default class MobileArrangeLyrics extends React.Component{

  constructor(){
    super();
    this.state ={
      selectedIndex: 0,
      formattedLyrics: [],
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
      mouseDown: false,
      songIndex: 0
    }
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
      newType: item.formattedLyrics[0] ? item.formattedLyrics[0].name : "Verse"
    })
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
    this.setState({selectedIndex: formattedLyrics.length-1})
  }

  addSection = () => {
    let {songOrder, newType} = this.state;
    songOrder.push(newType)
    this.setState({songOrder: songOrder})
  }

  updateSections = (formattedLyrics, oldName) => {
    let sections = [];
    let sectionUpdates = {};
    let {songOrder} = this.state;
    let sectionCounter = {}

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

    // let secName = sections[sections.length-1];
    // if(oldName){
    //   secName = oldName;
    // let typeFromName = oldName.replace(/\s\d+$/, "");
    // if(oldName === typeFromName)
    //   secName = oldName + ' ' + sectionCounter[typeFromName]
    // }

    Sort.sortNamesInList(formattedLyrics)
    Sort.sortList(sections);

    // let newIndex = sections.findIndex(e => e === secName);
    // if(newIndex !== -1){
    //   this.setState({selectedIndex: newIndex})
    // }
    this.setState({
      formattedLyrics: formattedLyrics,
      sectionsPresent: sections,
      songOrder: songOrder,
      newType: sections[0]
    })
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
    let {formattedLyrics, selectedIndex} = this.state;
    formattedLyrics[selectedIndex].words = e.target.value;
    this.setState({formattedLyrics: formattedLyrics});
  }

  changeSectionType = (e) => {
    let {formattedLyrics, selectedIndex} = this.state;
    let name = e.target.value;
    let type = name.replace(/\s\d+$/, "");
    formattedLyrics[selectedIndex].type = type;
    let element = formattedLyrics[selectedIndex];
    formattedLyrics.splice(selectedIndex, 1);
    let index = formattedLyrics.findIndex(e => e.name === name);
    formattedLyrics.splice(index, 0, element);
    this.updateSections(formattedLyrics, name);
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

  selectSection = (name) => {
    let {formattedLyrics} = this.state;
    console.log("hereere");
    let index = formattedLyrics.findIndex(e => e.name === name);
    this.setState({selectedIndex: index})
  }

  moveSection = (indexFrom, indexTo) => {
    let {songOrder}= this.state;
    let temp = songOrder[indexFrom];
    songOrder[indexFrom] = songOrder[indexTo];
    songOrder[indexTo] = temp;
    this.setState({songOrder: songOrder})
  }

  render() {
    let {selectedIndex, formattedLyrics, sectionTypes, sectionsPresent, songOrder, newType} = this.state;
    let {close} = this.props;
    let sectionItem = formattedLyrics[selectedIndex];
    if(!sectionItem)
      return null;

    let songOrderStyle = {width: "80%", height: '4vh', border:'0.1vmax', borderColor: '#b7b7b7', borderStyle:'solid',
        textAlign: 'center'}
    let songOrderSelected = Object.assign({}, songOrderStyle);
    songOrderSelected.borderColor = '#06d1d1';

    let buttonDiv = {width:'5vw', height:'5vw', margin:"0 1.5vw"};
    let orderButton = {display: 'block', width: '100%', height: '100%'}

    let buttonStyle = {margin: 'auto', height: '5vh', width: '20vw', fontSize: 'calc(10px + 0.5vmax)'}

    let SO = songOrder.map((name, index) => {
      let selected = name === formattedLyrics[selectedIndex].name;
      let first = (index === 0);
      let last = (index === songOrder.length-1);
      return(
        <div style={{display:'flex', margin:'1.5vh', userSelect:'none'}} key={index}>
          <div style={buttonDiv}>
            {!first && <img className='imgButton' style={orderButton}
               onClick={() => (this.moveSection(index, index-1))}
               alt="upArrow" src={upArrow}
              />}
          </div>
          <div style={ selected ? songOrderSelected : songOrderStyle}
            onClick={() => (this.selectSection(name))}> {name}
          </div>
          <div style={buttonDiv}>
            {!last &&<img className='imgButton' style={orderButton}
               onClick={() => (this.moveSection(index, index+1))}
               alt="downArrow" src={downArrow}
              />}
          </div>
          <div style={buttonDiv}>
            <img className='imgButton' style={{...orderButton, marginLeft: '1vw'}}
               onClick={() => (this.deleteSectionFromOrder(index))}
               alt="delete" src={deleteX}
              />
          </div>
        </div>
      )
    })

    return (
      <div style={{width: '100%'}}>
        <div style={{display: 'flex', width: '95%', margin: '0 2vw'}}>
          <MobileSongSection item={sectionItem} changeSectionType={this.changeSectionType}
            sectionTypes={sectionTypes} changeSectionText={this.changeSectionText}
            deleteSection={this.deleteSection} sectionsPresent={sectionsPresent}
            index={selectedIndex}
            />
          <div style={{margin: 'auto'}}>
            <button onClick={this.newSection} style={buttonStyle}> New Section</button>
          </div>
        </div>
        <div style={{width: '95%', height: '40%', marginTop: '1vh', overflowY: 'scroll'}}>{SO}</div>
        <div style={{position: 'absolute', right: '1vw', bottom: '8vh', display: 'flex', width: '100%'}}>
          <select style={{height: '5vh', margin: 'auto', width:'20vw'}} value={newType} onChange={(e) => (this.changeNewType(e))}>
            {sectionsPresent.map((element, index) =>
              <option key={index}> {element} </option>
            )}
          </select>
          <button style={buttonStyle} onClick={this.addSection}>Add Section</button>
        </div>
        <div style={{position: 'absolute', right: '1vw', bottom: '1vh', display: 'flex', width: '100%'}}>
          <button style={buttonStyle} onClick={close}>Cancel</button>
          <button style={buttonStyle} onClick={this.autoFormatLyrics}>Submit</button>
        </div>
      </div>
    )
  }

}
