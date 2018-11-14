import React, {Component} from 'react'
import zoomIn from '../assets/zoomIn.png'
import zoomOut from '../assets/zoomOut.png'
import newButton from '../assets/new-button.png';

import SongSection from './SongSection';

export default class SongSectionsArea extends Component{

  constructor(){
    super();
    this.state = {
      numSongSections: 4,
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
    }
  }

  changeSectionText = (e) => {
    let {formattedLyrics, sectionIndex} = this.props;
    formattedLyrics[sectionIndex].words = e.target.value;
    this.props.updateFormattedLyrics(formattedLyrics);
  }

  changeSectionType = (e) => {
    let {formattedLyrics, sectionIndex} = this.props;
    let name = e.target.value;
    let type = name.replace(/\s\d+$/, "");
    formattedLyrics[sectionIndex].type = type;
    let element = formattedLyrics[sectionIndex];
    let index = formattedLyrics.findIndex(e => e.name === name);
    // if(element.type === type && index > sectionIndex)
    //   index--;
    if(name === type)
      index = formattedLyrics.length-1;
    console.log(element.type, type, sectionIndex, index);
    formattedLyrics.splice(sectionIndex, 1);
    formattedLyrics.splice(index, 0, element);
    this.props.updateSections({formattedLyrics: formattedLyrics, index: index});
  }

  decreaseRows = () => {
    let {numSongSections} = this.state;
    if(numSongSections > 2)
      this.setState({numSongSections: numSongSections-1})
  }

  deleteSection = (index) => {
    let {formattedLyrics, songOrder, sectionsPresent} = this.props;

    for (var i = 0; i < songOrder.length; i++) {
      if(formattedLyrics[index].name === songOrder[i]){
        this.props.deleteSectionFromOrder(i);
      }
    }

    formattedLyrics.splice(index, 1);
    sectionsPresent.splice(index, 1);
    this.props.updateSections({formattedLyrics: formattedLyrics})
  }

  increaseRows = () => {
    let {numSongSections} = this.state;
    if(numSongSections < 6)
      this.setState({numSongSections: numSongSections+1})
  }

  newSection = () => {
    let {formattedLyrics} = this.props;
    formattedLyrics.push({
      type: "Verse",
      name: "Verse "+(formattedLyrics.length+1),
      words: ""
    })
    this.props.updateSections({formattedLyrics: formattedLyrics})
  }

  render(){
    let {formattedLyrics, name, sectionsPresent, sectionIndex} = this.props;
    let {numSongSections, sectionTypes} = this.state;
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

    if(fullArray.length > 0){
      let lastRow = fullArray[fullArray.length -1];
      if(lastRow.length < numSongSections)
        lastRow.push('newSection')
      else
        fullArray.push(['newSection'])
    }
    else
      fullArray.push(['newSection'])

    let sectionWidth= 0.98/numSongSections;

    let list = fullArray.map((element, index) => {
      let row = element.map(function (item, i){
        let newSection = item === 'newSection'
        return(
          <div style={{width:`${sectionWidth*100}%`}} key={index*numSongSections+i}>
            {!newSection &&<SongSection item={item} setSectionIndex={that.props.setSectionIndex} changeSectionType={that.changeSectionType}
              sectionTypes={sectionTypes} changeSectionText={that.changeSectionText} deleteSection={that.deleteSection}
              i={i} index={index} sectionIndex={sectionIndex} sectionsPresent={sectionsPresent}
              numSongSections={numSongSections} sectionWidth={sectionWidth}
              />}
            {newSection && <div className='imgButton' style={{backgroundColor: '#b7b7b7',
               marginTop:'12.5%', width: '87.5%', height:'82.5%', border: '0.25vw #2ECC71 solid',
              borderRadius:'0.5vw', fontWeight: 'bold'}}
            onClick={that.newSection}>
            <div style={{textAlign: 'center', paddingTop: '5%', fontSize: `calc(5.6vw*${sectionWidth})`,
              color: 'black'}}>New Section</div>
            <img style={{display:'block', width:'72.5%', height:'70%', margin:'1vh auto'}}
               alt="newButton" src={newButton}
              />
            </div>}
          </div>
        );
      })
      return (
        <div style={{display:'flex', paddingBottom:'1vmax', height:`${1.3/numSongSections*100}%`, width:'55vw'}} key={index}> {row}</div>
      );
    })

    return(
      <div>
        <div style={{display: 'flex', position: 'relative', marginBottom: '1vh'}}>
          <div style={{textAlign: 'center', fontSize: "calc(11px + 0.75vmax)",
          width: '60%', marginLeft: '20%', borderBottom: '0.1vw #f4f142 solid',
          fontWeight: 'bold'}}>
          {name}
        </div>
          <img style={{display:'block', width:'2vw', height:'2vw', margin:'0 1vw'}}
              onClick={this.decreaseRows}
              alt="zoomIn" src={zoomIn}
             />
           <img style={{display:'block', width:'2vw', height:'2vw', margin:'0 1vw'}}
               onClick={this.increaseRows}
               alt="zoomOut" src={zoomOut}
              />
        </div>
        <div style={{paddingLeft:'1vmax', overflowX: 'hidden', height: "87.5vh", width:"56vw"}}>
          {list}
        </div>
      </div>
    )
  }
}
